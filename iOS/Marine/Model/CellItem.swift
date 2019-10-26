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

    static func == (lhs: CellItem, rhs: CellItem) -> Bool {
        return lhs.identity == rhs.identity
    }

    typealias Identity = String
    var identity: Identity {
        switch self {
        case let .post(post):
            return post.identity
        case let .accountTableViewCellReactor(accountTableViewCellReactor):
            return accountTableViewCellReactor.identity
        case let .topic(topic):
            return topic.identity
        case let .notification(notification):
            return notification.identity
        case let .like(like):
            return like.identity
        case let .user(user):
            return user.identity
        }
    }
    case item(PostTableViewCellReactor)
    case accountTableViewCellReactor(AccountTableViewCellReactor)
    case topic(Topic)
    case notification(PoemyNotification)
    case like(Like)
    case user(User)
}
