import React, { useState, useCallback, useEffect } from 'react'
import moment from 'moment'
import { useHttp } from '../../hooks/http.hook'
import { Loader } from '../../utils/Loader/Loader'
import { MovieCard } from '../../components/MovieCard/MovieCard'
import './SoonPage.css'

export const SoonPage = () => {
    document.title = 'Future Premieres'
    const [movies, setMovies] = useState([])
    const {request, loading} = useHttp()
    
    const getMovies = useCallback( async () => {
        try {
            const fetched = await request('/api/movies/soon', 'GET')
            setMovies(fetched)
        } catch (e) {}
    }, [request])

    useEffect( () => {
        getMovies()
    }, [getMovies])    

    if (loading) {
        return <Loader />
    }

    // sorting movies in arrays by date
    if (!movies || movies.length === 0) {
        return (
            <div className="soon-page">
                <p>Sorry, there are no premieres in the near future</p>
            </div>
        )
    }
    const eachMovieStartDate = []
    const sortedMovies = []
    for ( let movie in movies ) {
        movie = movies[movie]
        const existsIndex = eachMovieStartDate.findIndex( date => date === movie.startDate) 
        if (existsIndex !== -1) {
            sortedMovies[existsIndex].movies.push({
                id: movie._id,
                genres: movie.description.genres,
                production: movie.description.production,
                stars: movie.description.stars,
                poster: movie.description.poster
            })        
        } else {
            sortedMovies.push({
                date: movie.startDate,
                movies:  [{
                    id: movie._id,
                    genres: movie.description.genres,
                    production: movie.description.production,
                    stars: movie.description.stars,
                    poster: movie.description.poster
                }]
            })
            eachMovieStartDate.push(movie.startDate)
        }
    }

    return (
        <>
            { !loading && movies && 
                    <div className="soon-page">
                    {sortedMovies.map( day => {
                        return (
                            <div key={day.date}>
                                <div className="date">{moment(day.date * 1000).format('MMMM D')}</div>
                                <div className="card-block">
                                {day.movies.map( movie => {
                                    return (
                                        <MovieCard 
                                            key={movie.id}
                                            genres={movie.genres}
                                            production={movie.production}
                                            stars={movie.stars}
                                            address={movie.id}
                                        />
                                    )
                                })}
                                </div>
                            </div>
                        )
                    })}
                </div> 
            }
        </>
    )
}