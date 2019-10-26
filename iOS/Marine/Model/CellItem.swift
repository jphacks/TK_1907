//
//  CellItem.swift
//  Marine
//
//  Created by Imagine Kawabe on 2019/10/26.
//  Copyright © 2019 Imagine Kawabe. All rights reserved.
//

import Foundation
import RxDataSources

enum CellItem: IdentifiableType, Equatable {
    typealias Identity = String

    static func == (lhs: CellItem, rhs: CellItem) -> Bool {
        return lhs.identity == rhs.identity
    }

    var identity: Identity {
        switch self {
        case let .book(book):
            return book.identity
        }
    }
    case book(Book)
}
