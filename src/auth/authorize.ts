import { defineComponent, onBeforeMount, ref, watch } from "vue"
import { useAuth } from "../auth/auth"

export const Authorize = defineComponent({
    setup(props, { slots }) {
        const { user, isLogged } = useAuth()

        const isAuth = ref(false)
        const isLoading = ref(true)

        watch(() => user.uid, function (uid) {
            isAuth.value = uid !== "" && uid !== null
        })

        onBeforeMount(async function () {
            isAuth.value = await isLogged()
            isLoading.value = false
        })

        return () => [
            isLoading.value
                ? slots?.fallback?.call(null)
                : isAuth.value
                    ? slots?.logged?.call(null, user)
                    : slots?.default?.call(null)
        ]
    }
})
