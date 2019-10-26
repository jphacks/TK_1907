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
    
    @IBOutlet weak var collectionView: UICollectionView!

    override func viewDidLoad() {
        super.viewDidLoad()

    }
}

extension HomeViewController: StoryboardView {
    func bind(reactor: HomeViewReactor) {
        self.collectionView.rx.setDelegate(self).disposed(by: disposeBag)
        let dataSource = createDataSource(reactor: reactor)
        
        // STATE
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
            // TODO
            if let url = URL(string: "https://img.ero-manga-kingdom.com/wp-content/uploads/2019/06/6a469753935ba300ed81f7bd9842dcc8-650x917-1.jpg") {
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

extension HomeViewController: UICollectionViewDelegate {}
