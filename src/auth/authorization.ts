import { defineComponent, onBeforeMount, ref, watch } from "vue"
import { isLogged, useAuth } from "./auth"

function useLogged() {
    const { user } = useAuth()

    const isAuth = ref(false)

    onBeforeMount(async () => isAuth.value = await isLogged())

    watch(() => user.uid, function (uid) {	
        isAuth.value = uid !== "" && uid !== null	
    })

    return { isAuth, user }
}

export const Logged = defineComponent({
    setup(props, { slots }) {
        const { isAuth, user } = useLogged()
        return () => [isAuth.value ? slots.default?.call(null, user) : null]
    }
})

export const NotLogged = defineComponent({
    setup(props, { slots }) {
        const { isAuth } = useLogged()
        return () => [isAuth.value ? null : slots.default?.call(null)]
    },
})