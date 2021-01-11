import firebase from "firebase/app"
import "firebase/firestore"

import { onBeforeMount, onBeforeUnmount, ref, Ref, UnwrapRef } from "vue"

type Docs<T> = { [key: string]: T }
type DocsRef<T> = Ref<{ [key: string]: UnwrapRef<T> }>

interface Collection<T> {
    docs: () => DocsRef<T>
    put: (id: string, document: T) => void
    update: (id: string, document: T) => void
    remove: (id: string) => void
    add: (document: T) => Promise<string>
    obtain: (id: string) => Promise<Doc<T> | undefined>
}

interface Doc<T> {
    data: Ref<UnwrapRef<T>>
    subcollection: <S>(id: string) => Collection<S>
}

function createReference<T>(collection: firebase.firestore.CollectionReference) {

    function docs(): DocsRef<T> {
        const docs = ref<Docs<T>>({})
        
        onBeforeMount(async function () {
            const reference = await collection.get()
            reference.docs.forEach(doc => Object.assign(docs.value, { [doc.id]: doc.data() }))
        })

        const unsuscribe = collection.onSnapshot(function (data) {
            data.docChanges().forEach(function (change) {
                const doc = change.doc

                if (change.type === "removed") {
                    delete docs.value[change.doc.id]
                }

                else {
                    Object.assign(docs.value, { [doc.id]: doc.data() })
                }
            })
        })

        onBeforeUnmount(unsuscribe)

        return docs
    }

    async function obtain(id: string): Promise<Doc<T> | undefined> {
        const reference = await collection.doc(id).get()

        if (reference.exists) {
            const data = ref(reference.data() as T)

            const unsuscribe = reference.ref.onSnapshot(function () {
                data.value = null
                Object.assign(data.value, reference.data())
            })

            onBeforeUnmount(unsuscribe)

            return {
                data: data,
                subcollection: path => createReference(reference.ref.collection(path))
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

    return { docs, put, update, remove, add, obtain }
}

export function useCollection<T>(id: string): Collection<T> {
    const firestore = firebase.firestore()
    const collection = firestore.collection(id)

    return createReference(collection)
}
