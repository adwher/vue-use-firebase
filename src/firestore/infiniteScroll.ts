import firebase from "firebase/app"
import "firebase/firestore"

import { onBeforeMount, onBeforeUnmount, reactive, readonly, ref } from "vue"

export function createInfiniteScroll<T>(query: firebase.firestore.Query, take: number = 5) {
    query = query.limit(take)
    
    const docs = ref<{ [key: string]: T }>({})
    const metadata = reactive({ isLoading: true })

    let last: firebase.firestore.DocumentData
    let unsuscribe = query.onSnapshot(onSnapshotChange)

    async function updateDocs() {
        metadata.isLoading = true

        try {
            const results = await query.get()

            last = results.docs[results.size - 1]
            unsuscribe = query.onSnapshot(onSnapshotChange)

            for (const doc of results.docs) {
                Object.assign(docs.value, { [doc.id]: doc.data() })
            }
        }
        
        finally {
            metadata.isLoading = false
        }
    }

    onBeforeMount(updateDocs)

    async function onSnapshotChange(snapshot: firebase.firestore.QuerySnapshot) {
        snapshot.docChanges().forEach(function (change) {
            if (change.type === "removed") {
                delete docs.value[change.doc.id]
            }
            
            else {
                Object.assign(docs.value, {
                    [change.doc.id]: change.doc.data()
                })
            }
        })
    }

    onBeforeUnmount(() => unsuscribe())

    async function loadMore() {
        console.log("hello")

        if (last !== undefined || last !== null) {
            query = query.startAfter(last)
            await updateDocs()
        }
    }

    return { docs, metadata: readonly(metadata), loadMore }
}

export function useInfiniteScroll(id: string, take: number = 5) {
    const firestore = firebase.firestore()
    const collection = firestore.collection(id)

    return createInfiniteScroll(collection, take)
}
