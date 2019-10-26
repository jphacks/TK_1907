//
//  SingleBookViewReactor.swift
//  Marine
//
//  Created by Imagine Kawabe on 2019/10/26.
//  Copyright © 2019 Imagine Kawabe. All rights reserved.
//

import Foundation
import RxSwift
import ReactorKit
import FirebaseFirestore
import Swinject
import SwinjectAutoregistration

final class SingleBookViewReactor: Reactor {

    var initialState: State
    let chapterService: ChapterService

    enum Action {
        case load
    }

    enum Mutation {
        case setChapters([Chapter], lastSnapshot: DocumentSnapshot?, hasNext: Bool)
        case setLoading(isLoading: Bool)
        case setFirstLoading(isLoading: Bool)
    }

    struct State {
        var isLoading: Bool
        var isFirstLoading: Bool
        var book: Book
        var chapterSection: CustomSection
    }

    init(book: Book) {
        initialState = State(isLoading: false, isFirstLoading: false, book: book, chapterSection: .init(model: .chapters, items: []))
        self.chapterService = ChapterService()
    }

    func mutate(action: Action) -> Observable<Mutation> {
        switch action {
        case .load:
            let setLoading = Observable.just(Mutation.setFirstLoading(isLoading: true))
            let unsetLoading = Observable.just(Mutation.setFirstLoading(isLoading: false))
            let loadChapters = chapterService.fetch(bookId: currentState.book.identity)
                .compactMap { result in
                    Mutation.setChapters(result.chapters, lastSnapshot: result.lastSnapshot, hasNext: result.hasNext)
                }
            return .concat(setLoading, loadChapters, unsetLoading)
        }
    }

    func reduce(state: State, mutation: Mutation) -> State {
        var newState = state
        switch mutation {
        case let .setChapters(chapters, lastSnapshot: lastSnapshot, hasNext: hasNext):
            newState.chapterSection.items = chapters.map(CellItem.chapter)
            // TODO Update lastSnapshot and hasNext if pagination is needed
        case let .setFirstLoading(isLoading: isLoading):
            newState.isFirstLoading = isLoading
        case let .setLoading(isLoading: isLoading):
            newState.isLoading = isLoading
        }
        return newState
    }
}
