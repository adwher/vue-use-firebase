import firebase from "firebase/app"
import "firebase/analytics"
import "firebase/auth"

export function useAnalytics() {
    const analytics = firebase.analytics()
    const auth = firebase.auth()

    auth.onAuthStateChanged(function (session) {
        analytics.setUserId(session?.uid ?? null)
    })

    function record(name: string, payload: object = null) {
        analytics.logEvent(name, payload)
    }

    function setScreen(name: string) {
        analytics.setCurrentScreen(name)
    }

    return { record, setScreen }
}
