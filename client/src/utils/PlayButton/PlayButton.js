import React from 'react'
import './PlayButton.css'

export const PlayButton = ({ turnOn }) => {
	const active = turnOn ? ' active' : ''

	return (
		<div className={`circle-out${active}`}>
			<div className="circle-in">
				<div className="triangle" />
			</div>
		</div>
	)
}
