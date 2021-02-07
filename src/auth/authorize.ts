import { defineComponent, reactive, watch } from "vue"
import { useAuth } from "../auth/auth"

export const Authorize = defineComponent({
    async setup(props, { slots }) {
        const { user, isLogged } = useAuth()

        const state = reactive({
            user: user,
            isAuth: await isLogged()
        })

        watch(() => user.uid, function (uid) {
            state.isAuth = uid !== "" && uid !== null
        })

        return () => [
            slots.default?.call(null, state)
        ]
    }
})
