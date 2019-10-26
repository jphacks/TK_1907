//
//  HomeViewReactor.swift
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

final class HomeViewReactor: Reactor {

    var initialState: State
    let bookService: BookService

    enum Action {
        case load
        case select
        case loadNext
    }

    enum Mutation {
        case setBooks([Book], lastSnapshot: DocumentSnapshot?, hasNext: Bool)
        case appendBooks([Book], lastSnapshot: DocumentSnapshot?, hasNext: Bool)
        case setLoading(isLoading: Bool)
        case setFirstLoading(isLoading: Bool)
    }

    struct State {
        var isFirstLoading: Bool
        var isLoading: Bool
        var headerSection: CustomSection
        var booksSection: CustomSection
        var hasNext: Bool
        var lastSnapshot: DocumentSnapshot?
    }

    init() {
        initialState = State(isFirstLoading: false, isLoading: false, headerSection: .init(model: .homeHeader, items: [CellItem.header]), booksSection: .init(model: .books, items: []), hasNext: true, lastSnapshot: nil)
        self.bookService = BookService()
    }

    func mutate(action: Action) -> Observable<Mutation> {
        switch action {
        case .load:
            return .concat([
                .just(.setFirstLoading(isLoading: true)),
                bookService.fetch().map { result in
                    .setBooks(result.books, lastSnapshot: result.lastSnapshot, hasNext: result.hasNext)
                },
                .just(.setFirstLoading(isLoading: false))
                ])
        default:
            return .empty()
        }
    }

    func reduce(state: State, mutation: Mutation) -> State {
        var newState = state
        switch mutation {
        case let .setBooks(books, lastSnapshot: lastSnapshot, hasNext: hasNext):
            newState.booksSection.items = books.map(CellItem.book)
            newState.lastSnapshot = lastSnapshot
            newState.hasNext = hasNext
        case let .setFirstLoading(isLoading: isLoading):
            newState.isFirstLoading = isLoading
            newState.isLoading = isLoading
        default:
            break;
        }
        return newState
    }
}

