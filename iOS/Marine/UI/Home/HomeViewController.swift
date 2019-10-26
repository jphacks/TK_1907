//
//  HomeViewController.swift
//  Marine
//
//  Created by Imagine Kawabe on 2019/10/26.
//  Copyright © 2019 Imagine Kawabe. All rights reserved.
//

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
        
    }
}
