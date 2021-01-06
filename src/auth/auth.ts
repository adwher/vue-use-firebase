import firebase from "firebase/app"
import "firebase/auth"

import { onUnmounted, readonly, reactive } from "vue"

export interface User {
    uid: string
    displayName: string
    phoneNumber: string
    email: string
    photoURL: string
    createdAt: string
    signedAt: string
}

interface UserData {
    phoneNumber?: string
    email?: string
    displayName?: string
}

export function useAuth() {
    const auth = firebase.auth()
    const user = reactive<User>({
        uid: "",
        displayName: "",
        email: "",
        phoneNumber: "",
        photoURL: "",
        createdAt: "",
        signedAt: "",
    })
    
    const unsuscribe = auth.onAuthStateChanged(function (session) {
        if (session === null) {
            user.uid = ""
            user.displayName = ""
            user.email = ""
            user.phoneNumber = ""
            user.photoURL = ""
            user.createdAt = ""
            user.signedAt = ""
        }

        else {
            user.uid = session.uid
            user.displayName = session.displayName
            user.email = session.email
            user.phoneNumber = session.phoneNumber
            user.photoURL = session.photoURL
            user.createdAt = session.metadata.creationTime
            user.signedAt = session.metadata.lastSignInTime
        }
    })

    onUnmounted(unsuscribe)

    async function isLogged(): Promise<boolean> {
        return new Promise(function (resolve) {
            auth.onAuthStateChanged(function (session) {
                return resolve(session !== null)
            })
        })
    }

    async function updateData(data: UserData) {
        const session = auth.currentUser

        if (session !== null) {
            session.email = data.email ?? session.email
            session.phoneNumber = data.phoneNumber ?? session.phoneNumber
            session.displayName = data.displayName ?? session.displayName

            auth.updateCurrentUser(session)
        }
    }

    async function signOut() {
        await auth.signOut()
    }

    return { user: readonly(user), updateData, isLogged, signOut }
}
