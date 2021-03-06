import React from 'react'
import { Link } from 'react-router-dom'
import './MovieCard.css'

export const MovieCard = ({
	genres,
	production,
	stars,
	address,
	urlOrigin
}) => {
	return (
		<div className="card">
			<div className="img-wrapper">
				<img
					src={`${urlOrigin}/api/movies/poster/${address}`}
					alt="poster"
				/>
			</div>
			<div className="about">
				<div className="wave"></div>
				<div className="about-data">
					<p className="ganre">{genres}</p>
					<p className="production">{production}</p>
					<p className="cast">{stars}</p>
					<Link
						to={`/movie/${address}`}
						target="_blank"
						rel="noopener noreferrer"
					>
						<button>read more</button>
					</Link>
				</div>
			</div>
		</div>
	)
}
