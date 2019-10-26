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
        case let .chapter(chapter):
            return chapter.identity
        case .header:
            return "HomeHeader"
        }
    }
    case book(Book)
    case chapter(Chapter)
    case header
}

typealias CustomSection = AnimatableSectionModel<SectionID, CellItem>

protocol Identifiable: IdentifiableType, Equatable {
    associatedtype Identifier: Equatable
    var identity: Identifier { get }
}

enum SectionID: String, IdentifiableType {
    case homeHeader
    case books
    case chapters
    var identity: String {
        return self.rawValue
    }
}
