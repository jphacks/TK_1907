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
    let bookService: BookService

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
        var book: Book
        var chapterSection: CustomSection
    }

    init(book: Book) {
        initialState = State(isLoading: false, book: book, chapterSection: .init(model: .chapters, items: []))
        self.bookService = BookService()
    }

    func mutate(action: Action) -> Observable<Mutation> {
        switch action {
        case .load:
            return postService.fetch(postId: currentState.postId)
                .compactMap { result in
                    Mutation.setPost(result)
                }
                .flatMap { fetchPost -> Observable<Mutation> in
                    if case let Mutation.setPost(post) = fetchPost {
                        var fetchUser: Observable<Mutation> {
                            return self.userService.fetch(userId: post.userId).map (Mutation.setUser)
                        }
                        return .concat([
                        .just(.setLoading(isLoading: true)),
                        Observable.just(.setPost(post)),
                        fetchUser,
                        .just(.setLoading(isLoading: false))
                        ])
                    } else {
                        return .empty()
                    }
                }
        case .blockUser:
            guard let post = currentState.post else { return .empty() }
            blockService.blockUser(post: post)
            return .empty()
        case .deletePost:
            guard let post = currentState.post else { return .empty() }
            return postService.delete(post: post).map { _ in
                .empty
            }
        }
    }

    func transform(mutation: Observable<Mutation>) -> Observable<Mutation> {
        let postEventMutation = self.postService.event
            .flatMap { [weak self] event -> Observable<Mutation> in
                self?.mutate(postEvent: event) ?? .empty()
        }
        return Observable.of(mutation, postEventMutation).merge()
    }

    private func mutate(postEvent: PostEvent) -> Observable<Mutation> {
        switch postEvent {
        case let .delete(post):
            guard post.postId == currentState.postId else { return .empty() }
            return .just(.setIsPostRemoved)
        case let .update(post):
            return .just(.reloadRow(post.0))
        default:
            return .empty()
        }
    }

    func reduce(state: State, mutation: Mutation) -> State {
        var newState = state
        switch mutation {
        case let .setPost(post):
            let postTableViewCellReactor = PostTableViewCellReactor(post: post, isLiked: likeService.checkIsLiked(post: post), parent: self.parent)
            newState.post = post
            newState.postSection.items = [CellItem.post(postTableViewCellReactor)]
        case let .setUser(user):
            newState.userSection.items = [CellItem.user(user)]
        case let .setLoading(isLoading):
            newState.isLoading = isLoading
        case .setIsPostRemoved:
            newState.isPostRemoved = true
        case let .reloadRow(post):
            guard let parent = parent as? TimelineViewController else { return newState }
            guard let row = currentState.postSection.items.getPostRow(post: post) else { return newState }
            parent.tableView.reloadRows(at: [IndexPath(row: row, section: 0)], with: .fade)
        case .empty:
            return newState
        }
        return newState
    }
}
