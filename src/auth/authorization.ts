import { defineComponent, ref, watch } from "vue"
import { useAuth } from "./auth"

export const Logged = defineComponent({
    async setup(props, { slots }) {
        const { user, isLogged } = useAuth()

        const isAuth = ref(await isLogged())
        watch(user, () => isAuth.value = user.uid !== null)

        return () => [isAuth.value ? slots.default?.call(null, user) : null]
    }
})

export const NotLogged = defineComponent({
    async setup(props, { slots }) {
        const { user, isLogged } = useAuth()

        const isAuth = ref(await isLogged())
        watch(user, () => isAuth.value = user.uid !== null)

        return () => [isAuth.value ? null : slots.default?.call(null)]
    }
})