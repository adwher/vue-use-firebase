import { defineComponent } from "vue"
import { useAuth } from "./auth"

export const Logged = defineComponent({
    async setup(props, { slots }) {
        const { user } = useAuth()
        return () => user.uid !== null ? [slots.default?.call(null, user)] : []
    }
})

export const NotLogged = defineComponent({
    async setup(props, { slots }) {
        const { user } = useAuth()
        return () => user.uid === null ? [slots.default?.call(null)] : []
    }
})