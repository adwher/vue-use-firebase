import { defineComponent, ref, watch } from "vue"
import { useAuth } from "./auth"

async function useLogged() {
    const { user, isLogged } = useAuth()

    const isAuth = ref(await isLogged())

    watch(() => user.uid, function (uid) {	
        isAuth.value = uid !== "" && uid !== null	
    })

    return { isAuth, user }
}

export const Logged = defineComponent({
    async setup(props, { slots }) {
        const { isAuth, user } = await useLogged()
        return () => [isAuth.value ? slots.default?.call(null, user) : null]
    }
})

export const NotLogged = defineComponent({
    async setup(props, { slots }) {
        const { isAuth } = await useLogged()
        return () => [isAuth.value ? null : slots.default?.call(null)]
    }
})