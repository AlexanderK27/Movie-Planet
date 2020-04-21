import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { useRoutes } from './routes'
import { useAuth } from './hooks/auth.hook'
import { AuthContext } from './context/AuthContext'
import { Navbar } from './components/Navbar/Navbar'
import { Loader } from './utils/Loader/Loader'
import Footer from './components/Footer/Footer'

function App() {
    const { token, tokenTime, expireTime, userId, login, logout, ready } = useAuth()

    const isAuthenticated = !!token
    const routes = useRoutes(isAuthenticated)

    if (!ready) {
        return <Loader />
    }

    return (
        <AuthContext.Provider value={{
            token, tokenTime, expireTime, userId, login, logout, isAuthenticated
        }}>
            <Router>
                <Navbar />
                <div className="main">
                    {routes}
                </div>
                <Footer />
            </Router>
        </AuthContext.Provider>
    )
}

export default App