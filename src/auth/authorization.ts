import { defineComponent, onBeforeMount, reactive, watch } from "vue"
import { isLogged, useAuth } from "./auth"

export const AuthView = defineComponent({
    setup(props, { slots }) {
        const { user } = useAuth()

        const state = reactive({
            isAuth: false,
            isLoading: true,
        })

        onBeforeMount(async function () {
            state.isAuth = await isLogged()
            state.isLoading = false
        })

        watch(() => user.uid, () => state.isAuth = user.uid !== null && user.uid !== "")

        return () => [
            state.isLoading
                ? slots.fallback?.call(null)
                : state.isAuth
                    ? slots.logged?.call(null, user)
                    : slots.default?.call(null)
        ]
    }
})