import firebase from 'firebase/app'
import 'firebase/firestore'

import { ref, Ref, UnwrapRef } from 'vue'

export type CollectionRef<T> = Ref<{ [key: string]: UnwrapRef<T> }>

export interface Collection<T> {
    put: (id: string, document: T) => void
    update: (id: string, document: T) => void
    remove: (id: string) => void
    add: (document: T) => Promise<string>
    
    docs: CollectionRef<T>
    doc: (id: string) => Promise<Doc<T> | undefined>
}

export interface Doc<T> {
    data: Ref<UnwrapRef<T>>
    subcollection: <S>(id: string) => Collection<S>
}

function useReference<T>(collection: firebase.firestore.CollectionReference) {
    const docs = ref<{ [key: string]: T }>({})

    collection.get()
        .then(function (reference) {
            for (const doc of reference.docs) {
                Object.assign(docs.value, { [doc.id]: doc.data() })
            }
    
            collection.onSnapshot(function (snapshot) {
                snapshot.docChanges().forEach(function (event) {
                    if (event.type === "removed") delete docs.value[event.doc.id]
                    else {
                        Object.assign(docs.value, { [event.doc.id]: event.doc.data() })
                    }
                })
            })
        })

    async function doc(id: string): Promise<Doc<T> | undefined> {
        const reference = await collection.doc(id).get()

        if (reference.exists) {
            const data = ref(reference.data() as T)

            reference.ref.onSnapshot(function () {
                data.value = null
                Object.assign(data.value, reference.data())
            })

            return {
                data: data,
                subcollection: (path) => useReference(reference.ref.collection(path))
            }
        }

        else return undefined
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
        const reference = await collection.add(document)
        return reference.id
    }

    return { docs, doc, put, update, remove, add }
}

export function useCollection<T>(id: string): Collection<T> {
    const firestore = firebase.firestore()
    const collection = firestore.collection(id)
    
    return useReference(collection)
}
