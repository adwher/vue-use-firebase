import { defineComponent, computed } from "vue"
import { useAuth } from "../auth/auth"

export default defineComponent({
    async setup(props, { slots }) {
        const { user } = useAuth()
        const isAnonymous = computed(() => user.uid === "" || user.uid === null)

        return () => [
            isAnonymous.value
                ? slots.default?.call(null)
                : slots.logged?.call(null, user)
        ]
    }
})
