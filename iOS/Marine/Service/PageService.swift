//
//  PageService.swift
//  Marine
//
//  Created by Imagine Kawabe on 2019/10/27.
//  Copyright © 2019 Imagine Kawabe. All rights reserved.
//

import Foundation
import FirebaseFirestore
import RxSwift
import RxFirebase

final class PageService {

    static let pagesPerPage = 10

    func fetch(bookId: String, chapterId: String) -> Observable<PageQueryResult> {
        let baseRef =  Firestore.firestore().collection("Books").document(bookId).collection("Chapters").document(chapterId).collection("Pages")
        return baseRef.limit(to: PageService.pagesPerPage).rx.getDocuments()
        .map({ querySnapshot in
            return PageQueryResult(querySnapshot: querySnapshot)
        })
    }
}
