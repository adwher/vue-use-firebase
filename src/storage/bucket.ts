import firebase from "firebase/app"
import "firebase/storage"

export function useBucket(id?: string) {
    const storage = firebase.storage()
    const reference = storage.ref(id)

    
}