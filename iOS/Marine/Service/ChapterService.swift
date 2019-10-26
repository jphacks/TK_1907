//
//  ChapterService.swift
//  Marine
//
//  Created by Imagine Kawabe on 2019/10/26.
//  Copyright © 2019 Imagine Kawabe. All rights reserved.
//

import Foundation
import FirebaseFirestore
import RxSwift
import RxFirebase

final class ChapterService {

    static let chaptersPerPage = 10

    func fetch(bookId: String) -> Observable<ChapterQueryResult> {
        let baseRef =  Firestore.firestore().collection("Books").document(bookId).collection("Chapters")
        return baseRef.limit(to: ChapterService.chaptersPerPage).rx.getDocuments()
        .map({ querySnapshot in
            return ChapterQueryResult(querySnapshot: querySnapshot)
        })
    }
}
