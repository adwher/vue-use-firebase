import { defineComponent } from 'vue'
import { useAuth } from '../auth/auth'

export default defineComponent({
    setup(props, { slots }) {
        const { isAnonymous, user } = useAuth()

        return () => [
            isAnonymous.value ? slots.default?.call(null) : slots.logged?.call(null, user)
        ]
    },
})