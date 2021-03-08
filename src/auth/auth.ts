import firebase from "firebase/app"
import "firebase/auth"

import { readonly, reactive } from "vue"

interface User {
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
    
    auth.onAuthStateChanged(function (session) {
        user.uid = session?.uid ?? ""
        user.displayName = session?.displayName ?? ""
        user.email = session?.email ?? ""
        user.phoneNumber = session?.phoneNumber ?? ""
        user.photoURL = session?.photoURL ?? ""
        user.createdAt = session?.metadata?.creationTime ?? ""
        user.signedAt = session?.metadata?.lastSignInTime ?? ""
    })

    async function getToken() {
        return auth.currentUser.getIdToken()
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

    return { user: readonly(user), updateData, getToken }
}

export async function isLogged() {
    const auth = firebase.auth()

    return new Promise(resolve => {
        const unsuscribe = auth.onAuthStateChanged(session => {
            unsuscribe()
            return resolve(!!session)
        })
    })
}

export async function signOut() {
    const auth = firebase.auth()
    await auth.signOut()
}