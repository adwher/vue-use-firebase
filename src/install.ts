import firebase from 'firebase/app'

import { App } from 'vue'
import Authorize from "./auth/authorize"

export function createFirebasePlugin(options: object) {
    firebase.initializeApp(options)

    return {
        install(app: App) {
            app.component("FirebaseAuthorize", Authorize)
        }
    }  
}