//
//  BookCollectionViewCell.swift
//  Marine
//
//  Created by Imagine Kawabe on 2019/10/26.
//  Copyright © 2019 Imagine Kawabe. All rights reserved.
//

import UIKit

final class BookCollectionViewCell: UICollectionViewCell {

    @IBOutlet weak var thumbnailImageView: UIImageView! {
        didSet {
            thumbnailImageView.layer.maskedCorners = [.layerMaxXMinYCorner, .layerMinXMinYCorner]
            thumbnailImageView.layer.cornerRadius = 8
        }
    }
    @IBOutlet weak var bookTitleLabel: UILabel!
    @IBOutlet weak var containerView: UIView! {
        didSet {
            containerView.layer.cornerRadius = 8
            containerView.layer.masksToBounds = false
            containerView.layer.shadowOffset = CGSize(width: 2, height: 2)
            containerView.layer.shadowRadius = 3
            containerView.layer.shadowOpacity = 0.3
            containerView.layer.borderColor = UIColor.lightGray.cgColor
        }
    }

    override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
    }

}
