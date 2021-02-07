# vue-use-firebase

Firebase with Composition API for vue.

## Install

`npm i -S vue@^3.0.0 firebase vue-use-firebase`

## Usage

```ts
import { useAuth, useCollection } from "vue-use-firebase" // import just what you want
```

### Auth

```ts
import { useAuth } from "vue-use-firebase"

const { user, signOut } = useAuth()

function logOut() {
    if (user.uid === "adwher") signOut()
}
```

## Example

```vue
<template>
    <section>
        <input type="text" v-model="text">
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

import firebase from "firebase/app"

firebase.initializeApp() // make the initialization

interface Note {
    body: string
    complete: boolean
}

export default defineComponent({
    setup() {
        const { add, remove } = useCollection<Note>("notes")
        const { docs: notes, loadMore } = useInfiniteScroll<Note>("notes", 10)

        const text = ref("")
        const makeNote = () => add({ body: text.value, complete: false })

        return { makeNote, text, notes, loadMore }
    }
})
</script>

```

Code by [@adwher](https://github.com/adwher)
