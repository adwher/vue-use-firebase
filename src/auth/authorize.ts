import { defineComponent, onBeforeMount, ref, watch } from "vue"
import { useAuth } from "../auth/auth"

export const Authorize = defineComponent({
    setup(_props, { slots }) {
        const { user, isLogged } = useAuth()

        const isAuth = ref(false)
        const isLoading = ref(true)

        onBeforeMount(async function () {
            isLoading.value = await isLogged()
        })

        watch(() => user.uid, function (uid) {
            isAuth.value = uid !== "" && uid !== null
        })

        return () => [
            slots?.default?.call(null, { isLoading, isAuth })
        ]
    }
})
