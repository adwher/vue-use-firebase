import firebase from "firebase/app"
import "firebase/auth"

export function useSignUp() {
    const auth = firebase.auth()

    async function signUpEmailPassword(email: string, password: string) {
        await auth.createUserWithEmailAndPassword(email, password)
    }

    async function signUpAnonymously() {
        await auth.signInAnonymously()
    }

    return { signUpEmailPassword, signUpAnonymously }
}
