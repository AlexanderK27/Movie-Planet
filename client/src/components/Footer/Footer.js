import React from 'react'
import './Footer.css'

export const Footer = () => {
	const activeYear = new Date().getFullYear()

	return (
		<footer>
			<div>
				<p>Movie Planet Theater &copy; 2020{activeYear === 2020 ? '' : `-${activeYear}`}</p>
				<p>+1 788-111-1899</p>
				<p>835 Market St, San Francisco, CA 94103, United States</p>
			</div>
			<p>o.kolomiichuk@outlook.com</p>
		</footer>
	)
}
