//
//  AppDelegate.swift
//  Marine
//
//  Created by Imagine Kawabe on 2019/10/26.
//  Copyright © 2019 Imagine Kawabe. All rights reserved.
//

import Firebase
import Lottie
import UIKit
import Alamofire

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?
    var container: UIView?

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {

        FirebaseApp.configure()

        DataRequest.addAcceptableImageContentTypes(["application/octet-stream"])

        let initialViewController = UIStoryboard(name: "Main", bundle: nil).instantiateInitialViewController()
        self.window?.rootViewController = initialViewController
        self.window?.makeKeyAndVisible()
        
        return true
    }

    // MARK: UISceneSession Lifecycle

    func application(_ application: UIApplication, configurationForConnecting connectingSceneSession: UISceneSession, options: UIScene.ConnectionOptions) -> UISceneConfiguration {
        // Called when a new scene session is being created.
        // Use this method to select a configuration to create the new scene with.
        return UISceneConfiguration(name: "Default Configuration", sessionRole: connectingSceneSession.role)
    }

    func application(_ application: UIApplication, didDiscardSceneSessions sceneSessions: Set<UISceneSession>) {
        // Called when the user discards a scene session.
        // If any sessions were discarded while the application was not running, this will be called shortly after application:didFinishLaunchingWithOptions.
        // Use this method to release any resources that were specific to the discarded scenes, as they will not return.
    }
}

extension AppDelegate {
    class func instance() -> AppDelegate {
        return UIApplication.shared.delegate as! AppDelegate
    }

    func showActivityIndicator(fullScreen: Bool) {
        guard let window = UIApplication.shared.keyWindow else { return }
        container = UIView()
        var frame: CGRect {
            if fullScreen {
                return window.frame
            } else {
                return CGRect(x: 0, y: 0, width: 100, height: 100)
            }
        }
        container?.frame = frame
        container?.center = window.center
        container?.backgroundColor = UIColor(displayP3Red: 253, green: 255, blue: 252, alpha: 0.3)
        let loadingView = AnimationView()
        loadingView.frame = CGRect(x: 0, y: 0, width: 100, height: 100)
        loadingView.layer.masksToBounds = true
        loadingView.center = CGPoint(x: (container?.frame.size.width)! / 2, y: (container?.frame.size.height)! / 2)
        loadingView.animation = Animation.named("loading")
        loadingView.loopMode = .loop
        loadingView.animationSpeed = 1.5
        loadingView.backgroundColor = .clear
        loadingView.play()

        container?.addSubview(loadingView)
        window.addSubview(container!)
    }

    func dismissActivityIndicator() {
        if let container = container {
            DispatchQueue.main.async {
                container.removeFromSuperview()
            }
        }
    }
}
