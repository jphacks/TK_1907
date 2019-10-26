//
//  BookPresentable.swift
//  Marine
//
//  Created by Imagine Kawabe on 2019/10/26.
//  Copyright © 2019 Imagine Kawabe. All rights reserved.
//

import RxSwift
import Swinject
import SwinjectAutoregistration
import UIKit

protocol BookPresentable {
    func showBook(book: Book)
}

extension BookPresentable where Self: UIViewController {
    func showBook(book: Book) {
        let singleBookViewController = createSingleBookViewController(book: book)
        self.navigationController?.pushViewController(singleBookViewController, animated: true)
    }

    private func createSingleBookViewController(book: Book) -> SingleBookViewController {
        let singleBookViewController = SingleBookViewController.instantiate()
        singleBookViewController.reactor = SingleBookViewReactor(book: book)
        return singleBookViewController
    }
}

