import firebase from 'firebase/app'

import { App } from 'vue'
import Authorize from "./auth/authorize"

export function createFirebase(options: Object) {
    firebase.initializeApp(options)

    return {
        install(app: App) {
            app.component("authorize", Authorize)
        }
    }  
}