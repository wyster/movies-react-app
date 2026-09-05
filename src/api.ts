import axios from "axios";

type Process = {
    env: {
        REACT_APP_API_URL?: string
    }
}

const runtime = globalThis as typeof globalThis & { process?: Process }
const apiUrl = typeof window !== 'undefined'
    ? window.REACT_APP_API_URL
    : runtime.process?.env.REACT_APP_API_URL
export const api = axios.create({baseURL: `${apiUrl}/`})

export const getMovieDetails = (id: number) => api.get('details', {params: {id}}).then(r => r.data)
export const getSearch = (q: string) => api.get('search', {params: {q}}).then(r => r.data)
export const getMovieId = (url: string) => api.get('id-from-url', {params: {url}}).then(r => r.data)
export const getPlayer = (filmId: number, translatorId: number) => api.get('movie/player', {
    params: {
        id: filmId,
        translator_id: translatorId
    }
}).then(r => r.data)
export const getSerialData = (serialId: number, translatorId: number) => api.get('serial/episodes', {
    params: {
        id: serialId,
        translator_id: translatorId
    }
}).then(r => r.data)
export const getSerialPlayer = (serialId: number, translatorId: number, episodeId: number, seasonId: number) => api.get('serial/player', {
    params: {
        id: serialId,
        translator_id: translatorId,
        episode: episodeId,
        season: seasonId
    }
}).then(r => r.data)
