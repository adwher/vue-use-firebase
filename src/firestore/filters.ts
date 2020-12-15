import firebase from 'firebase/app'
import 'firebase/firestore'

import { onBeforeMount, reactive, readonly, ref } from 'vue'
import { Collection, assignQueryToRef } from '../firestore/collections'

export function usePaginate<T>(id: string, orderBy: string, take: number = 25) {
    const storage = firebase.firestore()
    const collection = storage.collection(id)

    const docs = ref<Collection<T>>({})
    const metadata = reactive({
        size: 0,
        page: 0,
        isLoading: true,
    })

    let last: firebase.firestore.DocumentData = undefined

    async function updateDocs(query: firebase.firestore.Query) {
        const results = await query.get()
        last = results.docs[results.size - 1]

        docs.value = {}
        assignQueryToRef(docs, results)
    }

    onBeforeMount(async function () {
        metadata.isLoading = true

        try {
            const begin = collection.limit(take).orderBy(orderBy)
            updateDocs(begin)

            // metadata

            const query = await collection.get()
            metadata.size = query.size > take ? Math.round(query.size / take) : 1
        }

        finally {
            metadata.isLoading = false
        }
    })

    async function next() {
        metadata.isLoading = true

        try {
            if (metadata.page < (metadata.size - 1)) {
                const query = collection.orderBy(orderBy).limit(take).startAfter(last)
                await updateDocs(query)
    
                metadata.page++
            }
        }

        finally {
            metadata.isLoading = false
        }
    }

    async function previous() {
        metadata.isLoading = true

        try {
            if (metadata.page > 0) {
                const query = collection.orderBy(orderBy).limitToLast(take).endBefore(last)
                await updateDocs(query)
    
                metadata.page--
            }
        }

        finally {
            metadata.isLoading = false
        }
    }

    return { docs, metadata: readonly(metadata), next, previous }
}