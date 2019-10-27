//
//  ItemService.swift
//  Marine
//
//  Created by Imagine Kawabe on 2019/10/26.
//  Copyright © 2019 Imagine Kawabe. All rights reserved.
//

import Foundation
import FirebaseFirestore
import RxSwift
import RxFirebase

final class BookService {

    static let booksPerPage = 10

    func fetch() -> Observable<BookQueryResult> {
        let baseRef =  Firestore.firestore().collection("Books")
        return baseRef.rx.getDocuments()
        .map({ querySnapshot in
            return BookQueryResult(querySnapshot: querySnapshot)
        })
    }
}
