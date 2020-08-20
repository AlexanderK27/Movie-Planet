import React from 'react'
import './Ticket.css'

export const Ticket = ({ params }) => {
	const {
		id,
		movieName,
		date,
		sesDate,
		row,
		seat,
		seatType,
		price,
		purchaseDate,
		qrcodeHandler
	} = params

	let ticketClass = 'Ticket'
	if (sesDate < Date.now() - 60 * 60 * 1000) {
		ticketClass = 'Ticket expired'
	}

	return (
		<div className={ticketClass} onClick={qrcodeHandler.bind(params, id)}>
			<div className="shadow">
				{ticketClass === 'Ticket expired' ? (
					<div>expired</div>
				) : (
					<p>press to get qr code</p>
				)}
			</div>
			<div className="data-block">
				<div className="main-data">
					<p>{movieName}</p>
					<p>{date}</p>
				</div>
				<div className="seat-data">
					<p>Row: {row}</p>
					<p>Seat: {seat}</p>
					<p>Type: {seatType}</p>
				</div>
				<div className="summary-data">
					<p>Price: ${price}</p>
					<p>{purchaseDate}</p>
				</div>
			</div>
		</div>
	)
}
