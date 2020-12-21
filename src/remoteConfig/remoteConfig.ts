import firebase from 'firebase/app'
import 'firebase/remote-config'

export type Config = { [key: string]: string }

export function useRemoteConfig<T extends Config>(defaultConfig?: T) {
    const remote = firebase.remoteConfig()

    remote.settings = {
        fetchTimeoutMillis: 500_000,
        minimumFetchIntervalMillis: 100,
    }

    remote.defaultConfig = defaultConfig || {}

    async function fetchConfig(): Promise<T> {
        await remote.fetchAndActivate()

        const config = {}
        const data = remote.getAll()
        
        for (const key of Object.keys(data)) {
            config[key] = data[key].asString()
        }

        return config as T
    }

    return { fetchConfig }
}