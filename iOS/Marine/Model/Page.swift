//
//  Page.swift
//  Marine
//
//  Created by Imagine Kawabe on 2019/10/27.
//  Copyright © 2019 Imagine Kawabe. All rights reserved.
//

import Foundation
import UIKit
import FirebaseFirestore.FIRDocumentSnapshot

struct PageQueryResult {
    var hasNext: Bool
    var pages: [Page]
    var lastSnapshot: DocumentSnapshot?

    init(querySnapshot: QuerySnapshot) {
        hasNext = querySnapshot.documents.count == PageService.pagesPerPage
        pages = querySnapshot.documents.compactMap { Page.init(document: $0) }
        lastSnapshot = querySnapshot.documents.last
    }
}

class Page: Identifiable {

    static func == (lhs: Page, rhs: Page) -> Bool {
        return lhs.identity == rhs.identity
    }

    typealias Identity = String
    var identity: Identity
    var imageUrlString: String

    init(identifier: String, imageUrlString: String) {
        self.identity = identifier
        self.imageUrlString = imageUrlString
    }

    init?(document: DocumentSnapshot) {
        guard let dictionary = document.data() as? [String : Any],
            let url = dictionary["WrappedURL"] as? String else { return nil }
        self.identity = document.documentID
        if let encodedUrl = url.addingPercentEncoding(withAllowedCharacters:.urlQueryAllowed) {
            self.imageUrlString = encodedUrl
        } else {
            self.imageUrlString = ""
        }
    }
}
