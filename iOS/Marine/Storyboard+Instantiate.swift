//
//  Storyboard+Instantiate.swift
//  Marine
//
//  Created by Imagine Kawabe on 2019/10/26.
//  Copyright © 2019 Imagine Kawabe. All rights reserved.
//

import UIKit

enum StoryboardName: String {
    case account = "Main"
    case single = "Single"
}

protocol StoryboardInstantiate {
    static var storyboardName: StoryboardName { get }
}

extension StoryboardInstantiate where Self: UIViewController {
    static func instantiate() -> Self {
        let storyboard = UIStoryboard(name: storyboardName.rawValue, bundle: nil)
        let viewControllerInstance = storyboard.instantiateViewController(withIdentifier: String(describing: self)) as! Self

        let backButtonItem = UIBarButtonItem(title: "", style: .plain, target: nil, action: nil)
        viewControllerInstance.navigationItem.backBarButtonItem = backButtonItem

        return viewControllerInstance
    }
}
