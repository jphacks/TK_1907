//
//  HomeHeaderCollectionViewCell.swift
//  Marine
//
//  Created by Imagine Kawabe on 2019/10/26.
//  Copyright © 2019 Imagine Kawabe. All rights reserved.
//

import UIKit

class HomeHeaderCollectionViewCell: UICollectionViewCell {


    @IBOutlet weak var headerImageView: UIImageView! {
        didSet {
            headerImageView.layer.cornerRadius = 8
            headerImageView.clipsToBounds = true
        }
    }

    override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
    }

}
