//
//  HomeViewController.swift
//  Marine
//
//  Created by Imagine Kawabe on 2019/10/26.
//  Copyright © 2019 Imagine Kawabe. All rights reserved.
//

import AlamofireImage
import ReactorKit
import RxDataSources
import RxSwift
import UIKit
import WaterfallLayout

final class HomeViewController: UIViewController {

    var disposeBag: DisposeBag = DisposeBag()
    
    @IBOutlet weak var collectionView: UICollectionView! {
        didSet {
            let layout = WaterfallLayout()
            layout.delegate = self
            layout.sectionInset = UIEdgeInsets(top: 0, left: 12, bottom: 12, right: 12)
            layout.minimumLineSpacing = 8.0
            layout.minimumInteritemSpacing = 8.0
            layout.headerHeight = 12
            collectionView.collectionViewLayout = layout
            collectionView.register(UINib(nibName: "BookCollectionViewCell", bundle: nil), forCellWithReuseIdentifier: "BookCell")
            collectionView.register(UINib(nibName: "HomeHeaderCollectionViewCell", bundle: nil), forCellWithReuseIdentifier: "HomeHeaderCell")
        }
    }

    override func viewDidLoad() {
        super.viewDidLoad()

        self.reactor = HomeViewReactor()

    }
}

extension HomeViewController: StoryboardView {
    func bind(reactor: HomeViewReactor) {
        self.collectionView.rx.setDelegate(self).disposed(by: disposeBag)
        // ACTION
        Observable<Void>.just(())
            .map { _ in Reactor.Action.load }
            .bind(to: reactor.action)
            .disposed(by: disposeBag)

        // STATE
        let dataSource = createDataSource(reactor: reactor)
        reactor.state.asObservable()
            .map { [$0.headerSection, $0.booksSection] }
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
    }

    private func createDataSource(reactor: HomeViewReactor) -> RxCollectionViewSectionedAnimatedDataSource<CustomSection> {
        return RxCollectionViewSectionedAnimatedDataSource<CustomSection>.init(animationConfiguration: AnimationConfiguration(insertAnimation: .fade, reloadAnimation: .fade, deleteAnimation: .fade), configureCell: { [weak self] dataSource, table, indexPath, item in
            guard let self = self else { return UICollectionViewCell() }
            if case let CellItem.book(book) = item {
                guard let cell = self.collectionView.dequeueReusableCell(withReuseIdentifier: "BookCell", for: indexPath) as? BookCollectionViewCell else { return UICollectionViewCell() }
                cell.bookTitleLabel.text = book.title
                if let url = URL(string: book.thumbnail) {
                    cell.thumbnailImageView.af_setImage(
                        withURL: url,
                        placeholderImage: nil,
                        imageTransition: .crossDissolve(0.2)
                    )
                }
                return cell
            } else if case CellItem.header = item {
                guard let cell = self.collectionView.dequeueReusableCell(withReuseIdentifier: "HomeHeaderCell", for: indexPath) as? HomeHeaderCollectionViewCell else { return UICollectionViewCell() }
                return cell
            }

            return UICollectionViewCell()
        })
    }
}

extension HomeViewController: WaterfallLayoutDelegate, UICollectionViewDelegate {
    func collectionViewLayout(for section: Int) -> WaterfallLayout.Layout {
        switch section {
        case 0: return .flow(column: 1) // single column flow layout
        case 1: return .waterfall(column: 2, distributionMethod: .balanced) // three waterfall layout
        default: return .flow(column: 2)
        }
    }

    func collectionView(_ collectionView: UICollectionView, layout: WaterfallLayout, sizeForItemAt indexPath: IndexPath) -> CGSize {
        switch indexPath.section {
        case 0:
            return CGSize(width: UIScreen.main.bounds.width - 40, height: UIScreen.main.bounds.width / 3.5)
        case 1:
            return CGSize(width: UIScreen.main.bounds.width / 2, height: (UIScreen.main.bounds.width / 2) * (148 / 105) + 60)
        default:
            return CGSize(width: UIScreen.main.bounds.width / 2, height: (UIScreen.main.bounds.width / 2) * (148 / 105) + 42)
        }
    }
}
