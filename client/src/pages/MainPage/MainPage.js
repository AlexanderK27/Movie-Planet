import React, { useState, useCallback, useEffect } from 'react'
import { useHttp } from '../../hooks/http.hook'
import { Loader } from '../../utils/Loader/Loader'
import { MoviesList } from '../../components/MoviesList/MoviesList'
import './MainPage.css'

export const MainPage = () => {
    const [movies, setMovies] = useState([])
    const {request, loading} = useHttp()
    
    const getMovies = useCallback( async () => {
        try {
            const fetched = await request('/api/movies/now', 'GET')
            setMovies(fetched)
        } catch (e) {}
    }, [request])

    useEffect( () => {
        getMovies()
    }, [getMovies])    

    if (loading) {
        return <Loader />
    }

    return (
        <>
            { !loading && movies &&  
                            <div className="main-page">
                                <MoviesList movies={movies} /> 
                            </div> 
            }
        </>
    )
}