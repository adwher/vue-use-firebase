import firebase from "firebase/app"
import "firebase/analytics"
import "firebase/auth"

export function useLogger() {
    const analytics = firebase.analytics()
    const auth = firebase.auth()

    auth.onAuthStateChanged(function (session) {
        analytics.setUserId(session?.uid ?? null)
    })

    function record(name: string, screen: string, payload: object = null) {
        analytics.setCurrentScreen(screen)
        analytics.logEvent(name, payload)
    }

    return { record }
}