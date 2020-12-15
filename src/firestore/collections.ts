import firebase from 'firebase/app'
import 'firebase/firestore'

import { onBeforeMount, Ref, ref } from 'vue'

// collection

export type Collection<D> = {
    [key: string]: D
}

export type Query = firebase.firestore.QuerySnapshot

// useCollection

export function useCollection<T>(id: string) {
    const storage = firebase.firestore()
    const collection = storage.collection(id)

    const docs = ref<Collection<T>>({})
    const isLoading = ref(false)

    onBeforeMount(async function () {
        isLoading.value = true
        
        try {
            assignQueryToRef(docs, await collection.get())
        }

        finally {
            isLoading.value = false
        }
    })

    collection.onSnapshot(function (snapshot) {
        snapshot.docChanges().forEach(function (change) {
            if (change.type === "removed") {
                delete docs.value[change.doc.id]
            }

            else {
                Object.assign(docs.value, { [change.doc.id]: change.doc.data() })
            }
        })
    })

    // crud

    async function obtain(id: string): Promise<T | undefined> {
        const result = await collection.doc(id).get()
        return result.exists ? result.data() as T : undefined
    }

    async function put(id: string, document: T) {
        await collection.doc(id).set(document)
    }

    async function update(id: string, document: T) {
        await collection.doc(id).update(document)
    }

    async function remove(id: string) {
        await collection.doc(id).delete()
    }

    async function add(document: T): Promise<string> {
        const result = await collection.add(document)
        return result.id
    }

    return { docs, isLoading, obtain, put, update, remove, add }
}

export async function assignQueryToRef<T>(target: Ref<Collection<T>>, query: Query) {
    for (const doc of query.docs) {
        Object.assign(target.value, { [doc.id]: doc.data() })
    }
}