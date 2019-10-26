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

final class HomeViewController: UIViewController {

    var disposeBag: DisposeBag = DisposeBag()
    
    @IBOutlet weak var collectionView: UICollectionView! {
        didSet {
            collectionView.register(UINib(nibName: "BookCollectionViewCell", bundle: nil), forCellWithReuseIdentifier: "BookCell")
            setUpCollectionViewLayout()
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
            guard let cell = self.collectionView.dequeueReusableCell(withReuseIdentifier: "BookCell", for: indexPath) as? BookCollectionViewCell else { return UICollectionViewCell() }
            guard case let CellItem.book(book) = item else { return UICollectionViewCell() }
            cell.bookTitleLabel.text = book.title
            if let url = URL(string: book.thumbnail) {
                cell.thumbnailImageView.af_setImage(
                    withURL: url,
                    placeholderImage: nil,
                    imageTransition: .crossDissolve(0.2)
                )
            }
            return cell
        })
    }
}

extension HomeViewController: UICollectionViewDelegate {
    private func setUpCollectionViewLayout() {
        let layout = UICollectionViewFlowLayout()
        let fullWidthWithoutBorder = UIScreen.main.bounds.width - 2
        layout.itemSize = CGSize(width: fullWidthWithoutBorder / 2, height: fullWidthWithoutBorder * (105 / 148) + 42)
        layout.minimumInteritemSpacing = 1
        layout.minimumLineSpacing = 2
        collectionView.collectionViewLayout = layout
    }
}
