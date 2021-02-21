import firebase from "firebase/app"
import "firebase/firestore"

import { onBeforeMount, onBeforeUnmount, ref, Ref, UnwrapRef } from "vue"

// collection

type Docs<T> = Ref<{ [key: string]: UnwrapRef<T> }>

interface Collection<T> {
    list(): Docs<T>
    put(id: string, document: T): void
    update(id: string, document: T): void
    remove(id: string): void
    add(document: T): Promise<string>
    obtain(id: string): Promise<Doc<T>>
    exist(id: string): Promise<boolean>
}

interface Doc<T> {
    data: Ref<UnwrapRef<T>>
    subcollection<S>(id: string): Collection<S>
}

function createReference<T>(collection: firebase.firestore.CollectionReference) {
    function list(): Docs<T> {
        const docs = ref<Docs<T>>(Object.create(null))

        onBeforeMount(async function () {
            const reference = await collection.get()
            reference.docs.forEach(doc => Object.assign(docs.value, { [doc.id]: doc.data() }))
        })

        const unsuscribe = collection.onSnapshot(snap => {
            snap.docChanges().forEach(change => {
                if (change.type === "removed") {
                    delete docs.value[change.doc.id]
                }
    
                else {
                    Object.assign(docs.value, { [change.doc.id]: change.doc.data() })
                }
            })
        })
        
        onBeforeUnmount(() => unsuscribe)
        return docs
    }
    
    async function obtain(id: string): Promise<Doc<T>> {
        const reference = await collection.doc(id).get()

        if (reference.exists) {
            const data = ref<T>(reference.data() as T)

            const unsuscribe = reference.ref.onSnapshot(function () {
                data.value = reference.data() as UnwrapRef<T>
            })

            onBeforeUnmount(() => unsuscribe)

            return {
                data,
                subcollection: path => createReference(reference.ref.collection(path)),
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

    async function add(document: T) {
        const reference = await collection.add(document)
        return reference.id
    }

    async function exist(id: string) {
        const reference = await collection.doc(id).get()
        return reference.exists
    }

    return { list, put, update, remove, add, obtain, exist }
}

export function useCollection<T>(id: string) {
    const firestore = firebase.firestore()
    const collection = firestore.collection(id)

    return createReference<T>(collection)
}
