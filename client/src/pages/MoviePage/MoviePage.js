import React, { useState, useCallback, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import YouTube from 'react-youtube'
import { useHttp } from '../../hooks/http.hook'
import { Loader } from '../../utils/Loader/Loader'
import { PlayButton } from '../../utils/PlayButton/PlayButton'
import './MoviePage.css'

export const MoviePage = () => {
	const { request, loading } = useHttp()
	const [movie, setMovie] = useState(null)
	const [play, setPlay] = useState(false)
	const playButtonBackgroundEl = useRef(null)

	const movieId = useParams().id
	const urlOrigin = window.location.origin

	const getMovie = useCallback(async () => {
		try {
			const fetched = await request(`/api/movies/${movieId}`, 'GET')
			setMovie(fetched)
		} catch (e) {}
	}, [movieId, request])

	useEffect(() => {
		getMovie()
	}, [getMovie])

	const ready = event => {
		event.target.playVideo()
	}

	const playTrailer = () => {
		setPlay(true)
		playButtonBackgroundEl.current.classList.add('active')
		setTimeout(() => {
			playButtonBackgroundEl.current.classList.add('disabled')
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
			{!loading && movie && (
				<div className="movie-page">
					<div>
						{play ? (
							<YouTube
								videoId={movie.description.trailer}
								id={'player'}
								opts={{
									playerVars: {
										rel: 0,
										hl: 'en'
									}
								}}
								onReady={ready}
							/>
						) : (
							<div id="player"></div>
						)}
						<div
							ref={playButtonBackgroundEl}
							className="play-button-background"
							onClick={playTrailer}
						>
							<PlayButton turnOn={play} />
						</div>
					</div>
					<div className="info">
						<div className="poster-wrapper">
							<img
								src={`${urlOrigin}/api/movies/poster/${movie._id}`}
								alt="poster"
							/>
						</div>
						<div className="about-wrapper">
							<h2>{movie.description.name}</h2>
							<ul>
								<li>
									<span>Genres: </span>
									{movie.description.genres}
								</li>
								<li>
									<span>Time: </span>
									{movie.description.time} min
								</li>
								<li>
									<span>Production: </span>
									{movie.description.production}
								</li>
								<li>
									<span>Directors: </span>
									{movie.description.directors}
								</li>
								<li>
									<span>Cast: </span>
									{movie.description.stars}
								</li>
							</ul>
							<p>Storyline</p>
							<hr />
							<p>{movie.description.storyline}</p>
						</div>
					</div>
				</div>
			)}
		</>
	)
}
