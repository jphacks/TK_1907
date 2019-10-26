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

final class SingleBookViewController: UIViewController, StoryboardInstantiate {

    static var storyboardName: StoryboardName = .single

    @IBOutlet weak var backgroundImageView: UIImageView!
    @IBOutlet weak var thumbnailImageView: UIImageView!
    @IBOutlet weak var bookTitleLabel: UILabel!

    override func viewDidLoad() {
        super.viewDidLoad()

        // Do any additional setup after loading the view.
    }
}
