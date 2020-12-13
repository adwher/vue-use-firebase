import firebase from 'firebase/app'
import 'firebase/auth'

declare global {
    interface Window {
        recaptcha?: firebase.auth.RecaptchaVerifier
    }
}

export function useSignIn() {
    const auth = firebase.auth()

    function configurateReCaptcha(container: string, options: Object) {
        window.recaptcha = new firebase.auth.RecaptchaVerifier(container, options)
    }

    // social

    async function signInGoogle() {
        const provider = new firebase.auth.GoogleAuthProvider()
        await auth.signInWithPopup(provider)
    }

    async function signInFacebook() {
        const provider = new firebase.auth.FacebookAuthProvider()
        await auth.signInWithPopup(provider)
    }

    async function signInGitHub() {
        const provider = new firebase.auth.GithubAuthProvider()
        await auth.signInWithPopup(provider)
    }

    // phoneNumber

    async function signInPhoneNumber(sessionId: string, code: string) {
        const credential = firebase.auth.PhoneAuthProvider.credential(sessionId, code)
        await auth.signInWithCredential(credential)
    }

    async function sendVerificationCode(phoneNumber: string): Promise<string> {
        const result = await auth.signInWithPhoneNumber(phoneNumber, window.recaptcha)
        return result.verificationId
    }

    // email and password

    async function signInEmailPassword(email: string, password: string) {
        await auth.signInWithEmailAndPassword(email, password)
    }

    return {
        configurateReCaptcha,
        sendVerificationCode,
        signInGoogle,
        signInFacebook,
        signInGitHub,
        signInPhoneNumber,
        signInEmailPassword
    }
}