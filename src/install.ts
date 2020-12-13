import firebase from 'firebase/app'

import { App } from 'vue'
import Authorize from "./components/authorize"

export function createFirebase(options: Object) {
    firebase.initializeApp(options)

    return {
        install(app: App) {
            app.component("authorize", Authorize)
        }
    }  
}