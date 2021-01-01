import firebase from "firebase/app"
import "firebase/auth"

import { reactive, readonly } from "vue"

interface User {
    uid: string
    phoneNumber: string
    email: string
    displayName: string
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
        phoneNumber: "",
        email: "",
        displayName: "",
        photoURL: "",
        createdAt: "",
        signedAt: ""
    })

    auth.onAuthStateChanged(function (session) {
        if (session !== null) {
            user.uid = session.uid
            user.displayName = session.displayName
            user.email = session.email
            user.phoneNumber = session.phoneNumber
            user.photoURL = session.photoURL
            user.createdAt = session.metadata.creationTime
            user.signedAt = session.metadata.lastSignInTime
        }
        
        else {
            user.uid = null
            user.displayName = null
            user.email = null
            user.phoneNumber = null
            user.photoURL = null
            user.createdAt = null
            user.signedAt = null
        }
    })

    async function isLogged(): Promise<boolean> {
        return new Promise(function (resolve) {
            auth.onAuthStateChanged(function (session) {
                return resolve(session !== null)
            })
        })
    }

    async function updateData(data: UserData) {
        const user = auth.currentUser

        if (user !== null) {
            user.email = data.email ?? user.email
            user.phoneNumber = data.phoneNumber ?? user.phoneNumber
            user.displayName = data.displayName ?? user.displayName

            auth.updateCurrentUser(user)
        }
    }

    async function signOut() {
        await auth.signOut()
    }

    return { user: readonly(user), updateData, isLogged, signOut }
}
