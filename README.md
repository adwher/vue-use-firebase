# vue-use-firebase

Firebase with Composition API for vue

```vue
<template>
    <section>
        <input type="text" v-model="note">
        <button @click="makeNote">Add</button>

        <div class="notes">
            <div class="note" v-for="(note, id) in notes" :key="id">
                <p>{{ note.body }}</p>
                <p>{{ note.complete ? 'completed' : 'todo' }}</p>
            </div>

            <button @click="loadMore">More</button>
        </div>
    </section>
</template>

<script lang="ts">
import { useCollection, useInfiniteScroll } from "vue-use-firebase"
import { defineComponent, ref } from "vue"

interface Note {
    body: string
    complete: boolean
}

export default defineComponent({
    setup() {
        const { add, remove } = useCollection<Note>("notes")
        const { docs: notes, loadMore } = useInfiniteScroll<Note>("notes", 10)

        const note = ref("")
        const makeNote = () => add({ body: note.value, complete: false })

        return { makeNote, note, notes, loadMore }
    }
})
</script>

```

Code by [@adwher](https://github.com/adwher)
