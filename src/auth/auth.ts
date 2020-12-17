import firebase from 'firebase/app'
import 'firebase/auth'

import { reactive, ref } from 'vue'

interface User {
    uid: string;
    phoneNumber: string;
    email: string;
    displayName: string;
    photoURL: string;
    createdAt: string;
    signedAt: string;
}

export function useAuth() {
    const auth = firebase.auth()

    const user = reactive<User>({
        uid: "",
        phoneNumber: "",
        email: "",
        displayName: "",
        photoURL: "",
        createdAt: "",
        signedAt: "",
    })

    const isAnonymous = ref(true)

    auth.onAuthStateChanged(function (session) {
        if (session !== null) {
            user.uid = session.uid
            user.displayName = session.displayName
            user.email = session.email
            user.phoneNumber = session.phoneNumber
            user.photoURL = session.photoURL
            user.createdAt = session.metadata.creationTime
            user.signedAt = session.metadata.lastSignInTime

            isAnonymous.value = false
        }

        else {
            user.uid = null
            user.displayName = null
            user.email = null
            user.phoneNumber = null
            user.photoURL = null

            isAnonymous.value = true
        }

    })

    async function signOut() {
        await auth.signOut()
    }

    return { user, isAnonymous, signOut }
}
