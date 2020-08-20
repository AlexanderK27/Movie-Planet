import React, { useState, useRef } from 'react'
import moment from 'moment'
import './ModalWindows.css'
import ae_logo from '../../logos/ae-logo.png'
import mc_logo from '../../logos/mc-logo.png'
import vs_logo from '../../logos/visa-logo.png'
import pp_logo from '../../logos/paypal-logo.png'

export const PurchaseWindow = ({ props }) => {
	const {
		movieName,
		sesDate,
		time,
		seatPrice,
		tickets,
		total,
		buyTicketHandler,
		closeModalHandler
	} = props
	const [stepNum, setStepNum] = useState(1)
	const paymentMethodsWrapEl = useRef(null)

	const standSeats = tickets.filter(ticket => ticket.price === 'stand')
	const premiumSeats = tickets.filter(ticket => ticket.price === 'premium')

	const amountOfStdSeats = standSeats.length
	const amountOfPremSeats = premiumSeats.length

	const nextStepHandler = () => setStepNum(stepNum + 1)
	const prevStepHandler = () => setStepNum(stepNum - 1)

	const pickPaymentHandler = e => {
		paymentMethodsWrapEl.current.childNodes.forEach(node =>
			node.classList.remove('active')
		)
		e.target.classList.add('active')
	}

	return (
		<div className="modal-background">
			<div className="modal-window">
				<span className="cross" onClick={closeModalHandler}>
					&times;
				</span>
				{stepNum === 1 ? (
					<div className="first-step">
						<h3>Check your order</h3>
						<div className="movie-data">
							<p>{movieName}</p>
							<p>
								{moment(sesDate).format('MMMM D')} {time}
							</p>
						</div>
						<div className="tickets">
							{amountOfStdSeats !== 0 ? (
								<p>
									{amountOfStdSeats}
									{amountOfStdSeats > 1
										? ' seats '
										: ' seat '}
									of standard type
								</p>
							) : null}
							{amountOfPremSeats !== 0 ? (
								<p>
									{amountOfPremSeats}
									{amountOfPremSeats > 1
										? ' seats '
										: ' seat '}
									of premium type
								</p>
							) : null}
							<table>
								<thead>
									<tr>
										<th>Type</th>
										<th>Row</th>
										<th>Seat</th>
										<th>Price</th>
									</tr>
								</thead>
								<tbody>
									{tickets.map(ticket => {
										return (
											<tr
												key={ticket.row * Math.random()}
											>
												<td>
													{ticket.price}
													{ticket.price === 'stand'
														? 'ard'
														: null}
												</td>
												<td>{ticket.row}</td>
												<td>{ticket.seat}</td>
												<td>
													${seatPrice[ticket.price]}
												</td>
											</tr>
										)
									})}
								</tbody>
							</table>
						</div>
						<div className="buttons">
							<span>Total: ${total}</span>
							<button onClick={nextStepHandler}>Сontinue</button>
						</div>
					</div>
				) : (
					<div className="second-step">
						<h3>Choose payment method</h3>
						<div
							className="payment-methods"
							ref={paymentMethodsWrapEl}
						>
							<img
								src={ae_logo}
								alt="american express"
								id="ae-method"
								onClick={pickPaymentHandler}
							/>
							<img
								src={mc_logo}
								alt="mastercard"
								id="mc-method"
								onClick={pickPaymentHandler}
							/>
							<img
								src={vs_logo}
								alt="visa"
								id="vs-method"
								onClick={pickPaymentHandler}
							/>
							<img
								src={pp_logo}
								alt="paypal"
								id="pp-method"
								onClick={pickPaymentHandler}
							/>
						</div>
						<p>No need to pay, just get your ticket</p>
						<div className="buttons">
							<button onClick={prevStepHandler}>Go back</button>
							<button onClick={buyTicketHandler}>Buy</button>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}

export const ServerResponseWindow = ({ props }) => {
	const { category, symbol, text, closeModalHandler } = props
	return (
		<div className="modal-background lite" onClick={closeModalHandler}>
			<div className={`response-window ${category}`}>
				<p>
					<span>{symbol}</span>&nbsp;{text}
				</p>
			</div>
		</div>
	)
}
