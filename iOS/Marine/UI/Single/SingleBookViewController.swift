//
//  SingleBookViewController.swift
//  Marine
//
//  Created by Imagine Kawabe on 2019/10/26.
//  Copyright © 2019 Imagine Kawabe. All rights reserved.
//

import UIKit
import ReactorKit
import RxCocoa
import RxDataSources
import RxSwift
import SwinjectStoryboard
import WaterfallLayout

final class SingleBookViewController: UIViewController, StoryboardInstantiate {

    static var storyboardName: StoryboardName = .single
    var disposeBag: DisposeBag = DisposeBag()

    struct Const {
        static let headerHeight: CGFloat = 260
    }

    @IBOutlet weak var backgroundImageView: UIImageView!
    @IBOutlet weak var thumbnailImageView: UIImageView!
    @IBOutlet weak var bookTitleLabel: UILabel!
    @IBOutlet weak var collectionView: UICollectionView! {
        didSet {
            let layout = WaterfallLayout()
            layout.delegate = self
            layout.sectionInset = UIEdgeInsets(top: 0, left: 12, bottom: 12, right: 12)
            layout.minimumLineSpacing = 8.0
            layout.minimumInteritemSpacing = 8.0
            layout.headerHeight = 12
            collectionView.register(UINib(nibName: "ChapterCollectionViewCell", bundle: nil), forCellWithReuseIdentifier: "ChapterCell")
            collectionView.contentInset.top = Const.headerHeight
            collectionView.collectionViewLayout = layout
        }
    }

    override func viewDidLoad() {
        super.viewDidLoad()
    }

    override func viewWillAppear(_ animated: Bool) {
        self.navigationController?.view.backgroundColor = .clear
        self.navigationController?.navigationBar.tintColor = .white
    }

    override func viewWillDisappear(_ animated: Bool) {
        self.navigationController?.view.backgroundColor = .white
        self.navigationController?.navigationBar.tintColor = UIColor(named: "MarineBlack")
    }
}

extension SingleBookViewController: StoryboardView {
    func bind(reactor: SingleBookViewReactor) {
        self.collectionView.rx.setDelegate(self).disposed(by: disposeBag)
        // ACTION
        Observable<Void>.just(())
            .map { _ in Reactor.Action.load }
            .bind(to: reactor.action)
            .disposed(by: disposeBag)

        collectionView.rx.modelSelected(CellItem.self)
            .subscribe(onNext: { cellItem in
                if case let CellItem.chapter(chapter) = cellItem {
                    let viewerViewController = ViewerViewController.instantiate()
                    viewerViewController.bookId = reactor.currentState.book.identity
                    viewerViewController.chapterId = chapter.identity
                    viewerViewController.modalTransitionStyle = .crossDissolve                          
                    viewerViewController.modalPresentationStyle = .fullScreen
                    self.present(viewerViewController, animated: true, completion: nil)
                }
            })
            .disposed(by: disposeBag)

        // STATE
        let dataSource = createDataSource(reactor: reactor)
        reactor.state.asObservable()
            .map { [$0.chapterSection] }
            .distinctUntilChanged()
            .bind(to: self.collectionView.rx.items(dataSource: dataSource))
            .disposed(by: self.disposeBag)

        reactor.state.asObservable()
            .map({ $0.isFirstLoading })
            .distinctUntilChanged()
            .subscribe(onNext: { isLoading in
                if isLoading {
                    AppDelegate.instance().showActivityIndicator(fullScreen: false)
                } else {
                    AppDelegate.instance().dismissActivityIndicator()
                }
            })
            .disposed(by: disposeBag)

        reactor.state.asObservable()
            .map { $0.book }
            .subscribe(onNext: { book in
                self.bookTitleLabel.text = book.title
                if let url = URL(string: book.thumbnail) {
                    self.thumbnailImageView.af_setImage(
                        withURL: url,
                        placeholderImage: nil,
                        imageTransition: .crossDissolve(0.2)
                    )
                    self.backgroundImageView.af_setImage(
                        withURL: url,
                        placeholderImage: nil,
                        imageTransition: .crossDissolve(0.2)
                    )
                }
            })
            .disposed(by: disposeBag)
    }

    private func createDataSource(reactor: SingleBookViewReactor) -> RxCollectionViewSectionedAnimatedDataSource<CustomSection> {
        return RxCollectionViewSectionedAnimatedDataSource<CustomSection>.init(animationConfiguration: AnimationConfiguration(insertAnimation: .fade, reloadAnimation: .fade, deleteAnimation: .fade), configureCell: { [weak self] dataSource, table, indexPath, item in
            guard let self = self else { return UICollectionViewCell() }
            if case let CellItem.chapter(chapter) = item {
                guard let cell = self.collectionView.dequeueReusableCell(withReuseIdentifier: "ChapterCell", for: indexPath) as? ChapterCollectionViewCell else { return UICollectionViewCell() }
                cell.chapterTitleLabel.text = chapter.title
                if let url = URL(string: chapter.thumbnail) {
                    cell.thumbnailImageView.af_setImage(
                        withURL: url,
                        placeholderImage: nil,
                        imageTransition: .crossDissolve(0.2)
                    )
                }
                return cell
            }
            return UICollectionViewCell()
        })
    }
}

extension SingleBookViewController: WaterfallLayoutDelegate, UICollectionViewDelegate {
    func collectionViewLayout(for section: Int) -> WaterfallLayout.Layout {
        return .flow(column: 1)
    }

    func collectionView(_ collectionView: UICollectionView, layout: WaterfallLayout, sizeForItemAt indexPath: IndexPath) -> CGSize {
        return CGSize(width: UIScreen.main.bounds.width, height: UIScreen.main.bounds.width / 3.5)
    }
}
