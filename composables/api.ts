export const useGlossaryApi = (url: string, options: any = {}) => {
    const config = useRuntimeConfig()
    const defaultOptions = {
        baseURL: config.public.apiBase,
        ...useRequestHeaders(['authorization'])
    }
    return useFetch(url, {
        ...options,
        ...defaultOptions
    })
}