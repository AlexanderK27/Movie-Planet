import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'

import { AuthContext } from './context/AuthContext'
import { Footer } from './components/Footer/Footer'
import { Loader } from './utils/Loader/Loader'
import { Navbar } from './components/Navbar/Navbar'
import { useAuth } from './hooks/auth.hook'
import { useRoutes } from './routes'

function App() {
	const {
		token,
		tokenTime,
		expireTime,
		userId,
		login,
		logout,
		ready
	} = useAuth()

	const isAuthenticated = !!token
	const routes = useRoutes(isAuthenticated)

	if (!ready) {
		return <Loader />
	}

	return (
		<AuthContext.Provider
			value={{
				token,
				tokenTime,
				expireTime,
				userId,
				login,
				logout,
				isAuthenticated
			}}
		>
			<Router>
				<Navbar />
				<div className="main">{routes}</div>
				<Footer />
			</Router>
		</AuthContext.Provider>
	)
}

export default App
