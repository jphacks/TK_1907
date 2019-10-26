//
//  ViewerViewController.swift
//  Marine
//
//  Created by Imagine Kawabe on 2019/10/27.
//  Copyright © 2019 Imagine Kawabe. All rights reserved.
//

import Alamofire
import AlamofireImage
import UIKit
import ImageSlideshow
import RxSwift
import SwinjectStoryboard
import Kingfisher

class ViewerViewController: UIViewController, StoryboardInstantiate {

    static var storyboardName: StoryboardName = .single

    @IBOutlet weak var imageSlideShow: ImageSlideshow!
    @IBOutlet weak var closeButton: UIButton!

    var bookId: String?
    var chapterId: String?
    var disposeBag: DisposeBag = DisposeBag()

    override func viewDidLoad() {
        super.viewDidLoad()
    }

    override func viewDidAppear(_ animated: Bool) {
        guard let bookId = bookId, let chapterId = chapterId else { return }
        PageService().fetch(bookId: bookId, chapterId: chapterId)
            .subscribe(onNext: { result in
                guard !result.pages.isEmpty else { return }
                let inputSources = result.pages.compactMap { KingfisherSource(urlString: $0.imageUrlString) }
                self.imageSlideShow.setImageInputs(inputSources)
            })
            .disposed(by: disposeBag)

        closeButton.rx.tap
            .subscribe(onNext: { _ in
                DispatchQueue.main.async {
                    self.dismiss(animated: false, completion: nil)
                }
            })
            .disposed(by: disposeBag)
    }
}
