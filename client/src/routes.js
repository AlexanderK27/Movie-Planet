import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { AuthPage } from './pages/AuthPage/AuthPage'
import { ContactPage } from './pages/ContactPage/ContactPage'
import { MoviePage } from './pages/MoviePage/MoviePage'
import { MainPage } from './pages/MainPage/MainPage'
import { ProfilePage } from './pages/ProfilePage/ProfilePage'
import { SessionPage } from './pages/SessionPage/SessionPage'
import { SoonPage } from './pages/SoonPage/SoonPage'

export const useRoutes = isAuthenticated => {
    if (isAuthenticated) {
        return (
            <Switch>
                <Route path="/" exact>
                    <MainPage />
                </Route>
                <Route path="/session/:id">
                    <SessionPage />
                </Route>
                <Route path="/soon" exact>
                    <SoonPage />
                </Route>
                <Route path="/movie/:id">
                    <MoviePage />
                </Route>
                <Route path="/profile" exact>
                    <ProfilePage />
                </Route>
                <Route path="/contact" exact>
                    <ContactPage />
                </Route>
                <Redirect to="/" exact/>
            </Switch>
        )
    }

    return (
        <Switch>
            <Route path="/" exact>
                <MainPage />
            </Route>
            <Route path="/session/:id">
                <SessionPage />
            </Route>
            <Route path="/soon" exact>
                <SoonPage />
            </Route>
            <Route path="/movie/:id">
                <MoviePage />
            </Route>
            <Route path="/auth/:type">
                <AuthPage />
            </Route>
            <Route path="/contact" exact>
                <ContactPage />
            </Route>
            <Redirect to="/" exact/>
        </Switch>
    )
}