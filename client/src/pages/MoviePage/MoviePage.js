import React, { useState, useCallback, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import YouTube from 'react-youtube';
import { useHttp } from '../../hooks/http.hook'
import { Loader } from '../../utils/Loader/Loader'
import { PlayButton } from '../../utils/PlayButton/PlayButton'
import './MoviePage.css'

export const MoviePage = () => {
    const {request, loading} = useHttp()
    const [movie, setMovie] = useState(null)
    const [player, setPlayer] = useState(false)
    const movieId = useParams().id

    let hostname = window.location.hostname
    if (hostname === 'localhost') hostname = 'localhost:3000'
    
    const getMovie = useCallback( async () => {
        try {
            const fetched = await request(`/api/movies/${movieId}`, 'GET')
            setMovie(fetched)
        } catch (e) { }
    }, [movieId, request])    
    
    useEffect( () => {
        getMovie()
    }, [getMovie])

    const ready = (event) => {
        event.target.playVideo()
    }
    
    const playTrailer = () => {
        setPlayer(true)
        document.querySelector('.circle-out').style.boxShadow = "0 0 8px 3px #FF6D12"
        document.querySelector('.circle-out').style.backgroundColor = "#FF6D12"
        document.querySelector('#play-background').style.boxShadow = "2px 12px 12px 1px #FF6D12"
        setTimeout( () => {
            document.getElementById('play-background').style.display = 'none'
        }, 2000)
    }

    if (loading) {
        return <Loader />
    }

    if (movie) {
        document.title = `${movie.description.name}`
    }

    return (
        <>
            { !loading && movie && 
                    <div className="movie-page">
                        <div>
                        {
                            player ?
                            <YouTube
                                videoId={movie.description.trailer}
                                id={"player"}
                                opts={{
                                    playerVars: {
                                        rel: 0,
                                        hl: 'en'
                                    }
                                }}
                                onReady={ready}
                            /> : <div id="player"></div>
                        }
                            <div id="play-background" onClick={playTrailer}>
                                <PlayButton />
                            </div>
                        </div>
                        <div className="info">
                            <div className="poster-wrapper">
                                <img 
                                    src={`http://${hostname}/api/movies/poster/${movie._id}`} 
                                    alt="poster" 
                                />
                            </div>
                            <div className="about-wrapper">
                                <h2>{movie.description.name}</h2>
                                <ul>
                                    <li><span>Genres: </span>{movie.description.genres}</li>
                                    <li><span>Time: </span>{movie.description.time} min</li>
                                    <li><span>Production: </span>{movie.description.production}</li>
                                    <li><span>Directors: </span>{movie.description.directors}</li>
                                    <li><span>Cast: </span>{movie.description.stars}</li>
                                </ul>
                                <p>Storyline</p>
                                <hr/>
                                <p>{movie.description.storyline}</p>
                            </div>
                        </div>

                    </div> 
            }
        </>
    )
}