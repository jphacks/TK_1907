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

    @IBOutlet weak var backgroundImageView: UIImageView!
    @IBOutlet weak var thumbnailImageView: UIImageView!
    @IBOutlet weak var bookTitleLabel: UILabel!

    override func viewDidLoad() {
        super.viewDidLoad()

        // Do any additional setup after loading the view.
    }
}

extension SingleBookViewController: StoryboardView {
    func bind(reactor: SingleBookViewReactor) {

    }
}

extension SingleBookViewController: UICollectionViewDelegate {
    func collectionViewLayout(for section: Int) -> WaterfallLayout.Layout {
        return .flow(column: 1)
    }

    func collectionView(_ collectionView: UICollectionView, layout: WaterfallLayout, sizeForItemAt indexPath: IndexPath) -> CGSize {
        return CGSize(width: UIScreen.main.bounds.width, height: UIScreen.main.bounds.width / 3.5)
    }
}
