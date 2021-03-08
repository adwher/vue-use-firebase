import firebase from "firebase/app"
import "firebase/auth"

declare global {
    interface Window {
        recaptcha?: firebase.auth.RecaptchaVerifier
    }
}

type Provider = "Google" | "GitHub" | "Facebook" | "Twitter"

function selectProvider(provider: Provider): firebase.auth.AuthProvider {
    switch (provider) {
        case "Facebook":
            return new firebase.auth.FacebookAuthProvider()

        case "GitHub":
            return new firebase.auth.GithubAuthProvider()

        case "Twitter":
            return new firebase.auth.TwitterAuthProvider()

        case "Google":
        default:
            return new firebase.auth.GoogleAuthProvider()
    }
}

interface SetupReCatpchaOptions {
    size: "invisible" | "normal" | "compact"
    theme?: "light" | "dark"
    badge?: "bottomright" | "bottomleft" | "inline"
}

export function useSignIn() {
    const auth = firebase.auth()
    auth.useDeviceLanguage()

    async function setupReCaptcha(container: string, options: SetupReCatpchaOptions) {
        if (window.recaptcha) {
            window.recaptcha.clear()
        }
        
        else {
            window.recaptcha = new firebase.auth.RecaptchaVerifier(container, options)
        }

        window.recaptcha.render()
    }

    // social

    async function signInRedirect(provider: Provider) {
        const choosed = selectProvider(provider)
        await auth.signInWithRedirect(choosed)
    }

    async function signInPopup(provider: Provider) {
        const choosed = selectProvider(provider)
        await auth.signInWithPopup(choosed)
    }

    // phoneNumber

    async function signInPhoneNumber(sessionId: string, code: string) {
        const credential = firebase.auth.PhoneAuthProvider.credential(
            sessionId,
            code
        )

        await auth.signInWithCredential(credential)
    }

    async function sendVerificationCode(phoneNumber: string): Promise<string> {
        const result = await auth.signInWithPhoneNumber(
            phoneNumber,
            window.recaptcha
        )
        
        return result.verificationId
    }

    // email and password

    async function signInEmailPassword(email: string, password: string) {
        await auth.signInWithEmailAndPassword(email, password)
    }

    return {
        setupReCaptcha,
        sendVerificationCode,
        signInRedirect,
        signInPopup,
        signInPhoneNumber,
        signInEmailPassword
    }
}
