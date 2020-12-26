import firebase from 'firebase/app'
import 'firebase/firestore'

import { onBeforeMount, onBeforeUnmount, reactive, ref } from 'vue'

export function createInfiniteScroll<T>(id: string, take: number = 20) {
    const firestore = firebase.firestore()
    const collection = firestore.collection(id)

    const docs = ref<{ [key: string]: T }>({})
    const metadata = reactive({ isLoading: true })

    let query = collection.limit(take)
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

    async function onSnapshotChange(snapshot: firebase.firestore.QuerySnapshot) {
        snapshot.docChanges().forEach(function (change) {
            if (change.type === "removed") {
                delete docs.value[change.doc.id]
            }

            else {
                Object.assign(docs.value, { [change.doc.id]: change.doc.data() })
            }
        })
    }

    onBeforeMount(updateDocs)
    onBeforeUnmount(unsuscribe)

    function loadMore() {
        query = query.startAfter(last)
        updateDocs()
    }

    return { docs, metadata, loadMore }
}