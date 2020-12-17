import firebase from 'firebase/app'
import 'firebase/analytics'
import 'firebase/auth'

export function useAnalytics() {
    const analytics = firebase.analytics()
    const auth = firebase.auth()

    auth.onAuthStateChanged(function (session) {
        if (session !== null) analytics.setUserId(session.uid)
        else analytics.setUserId("")
    })

    function record(name: string, payload: object = {}) {
        analytics.logEvent(name, payload)
    }
    
    return { record }
}