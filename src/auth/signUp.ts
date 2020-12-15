import firebase from 'firebase/app'
import 'firebase/auth'

export function useSignUp() {
    const auth = firebase.auth()
    
    async function signUpEmailPassword(email: string, password: string) {

    }

    return { signUpEmailPassword }
}