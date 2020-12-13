import firebase from 'firebase/app'
import 'firebase/firestore'

import { onBeforeMount, reactive, readonly, ref } from 'vue'
import { Collection, queryToRef } from '../firestore/collections'

export function usePaginate<T>(id: string, orderBy: string, take: number = 25) {
    const storage = firebase.firestore()
    const collection = storage.collection(id)

    const metadata = reactive({ size: 0, page: 0 })
    
    const isLoading = ref(false)
    const docs = ref<Collection<T>>({})

    let last: firebase.firestore.DocumentData = undefined

    async function updateDocs(query: firebase.firestore.Query) {
        const results = await query.get()
        last = results.docs[results.size - 1]

        docs.value = {}
        queryToRef(docs, results)
    }

    onBeforeMount(async function () {
        isLoading.value = true

        try {
            const query = await collection.get()
            metadata.size = query.size > take ? Math.round(query.size / take) : 1

            const begin = collection.limit(take).orderBy(orderBy)
            updateDocs(begin)
        }

        finally {
            isLoading.value = false
        }
    })

    async function next() {
        isLoading.value = true

        try {
            if (metadata.page < (metadata.size - 1)) {
                const query = collection.orderBy(orderBy).limit(take).startAfter(last)
                await updateDocs(query)
    
                metadata.page++
            }
        }

        finally {
            isLoading.value = false
        }
    }

    async function previous() {
        isLoading.value = true

        try {
            if (metadata.page > 0) {
                const query = collection.orderBy(orderBy).limitToLast(take).endBefore(last)
                await updateDocs(query)
    
                metadata.page--
            }
        }

        finally {
            isLoading.value = false
        }
    }

    return { docs, metadata: readonly(metadata), isLoading, next, previous }
}