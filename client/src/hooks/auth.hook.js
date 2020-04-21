import { useState, useCallback, useEffect } from 'react'

const storageName = 'userData'

export const useAuth = () => {
    const [token, setToken] = useState(null)
    const [tokenTime, setTokenTime] = useState(null)
    const expireTime = 58*60*1000
    const [userId, setUserId] = useState(null)
    const [ready, setReady] = useState(false)

    const login = useCallback((jwtToken, id, tokenStart) => {
        setToken(jwtToken)
        setUserId(id)
        setTokenTime(tokenStart)

        localStorage.setItem(storageName, JSON.stringify({
            userId: id, token: jwtToken, time: tokenStart
        }))
    }, [])

    const logout = useCallback(() => {
        setToken(null)
        setUserId(null)
        setTokenTime(null)

        localStorage.removeItem(storageName)
    }, [])

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem(storageName))

        if (data && data.token) {
            if (data.time + expireTime > Date.now()) {
                login(data.token, data.userId, data.time)
            } else {
                logout()
            }
        } 
        setReady(true)

    }, [login, expireTime, logout])

    return { token, tokenTime, expireTime, userId, login, logout, ready }
}