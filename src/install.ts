import { App } from "vue"
import Authorize from "./auth/authorize"

export function createFirebasePlugin() {
    return {
        install(app: App) {
            app.component("FirebaseAuthorize", Authorize)
        }
    }
}
