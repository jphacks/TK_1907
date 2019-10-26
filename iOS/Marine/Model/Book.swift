//
//  Item.swift
//  Marine
//
//  Created by Imagine Kawabe on 2019/10/26.
//  Copyright © 2019 Imagine Kawabe. All rights reserved.

import Foundation
import UIKit
import FirebaseFirestore.FIRDocumentSnapshot

struct BookQueryResult {
    var hasNext: Bool
    var books: [Book]
    var lastSnapshot: DocumentSnapshot?

    init(querySnapshot: QuerySnapshot) {
        hasNext = querySnapshot.documents.count == BookService.booksPerPage
        books = querySnapshot.documents.compactMap { Book.init(document: $0) }
        lastSnapshot = querySnapshot.documents.last
    }
}

class Book: Identifiable {

    static func == (lhs: Book, rhs: Book) -> Bool {
        return lhs.identity == rhs.identity
    }

    typealias Identity = String
    var identity: Identity
    var title: String
    var thumbnail: String

    init(identifier: String, title: String, thumbnail: String) {
        self.identity = identifier
        self.title = title
        self.thumbnail = thumbnail
    }

    init?(document: DocumentSnapshot) {
        guard let dictionary = document.data() as? [String : Any],
            let title = dictionary["Title"] as? String,
            let thumbnail = dictionary["Thumbnail"] as? String else { return nil }
        self.identity = document.documentID
        self.title = title
        self.thumbnail = thumbnail
    }
}
