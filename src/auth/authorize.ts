import { defineComponent } from 'vue'
import { useAuth } from '../auth/auth'

export default defineComponent({
    async setup(props, { slots }) {
        const { isLogged, user } = useAuth()
        const isAuth = await isLogged()

        return () => [
            isAuth ? slots?.logged(null, user) : slots?.default()
        ]
    },
})