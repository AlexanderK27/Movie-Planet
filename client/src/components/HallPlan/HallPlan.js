import React, { useRef, useState } from 'react'
import './HallPlan.css'

export const HallPlan = ({ session, hall, pickSeat }) => {
	const [disabledSeatSizeBtn, setDisabledSeatSizeBtn] = useState(null)
	const hallPlanEl = useRef(null)
	const maxSeatSize = 5
	const minSeatSize = 1

	// mark sold seats on the hall plan
	for (let ticket of session.soldTickets) {
		// loop through raws
		hall.rows.forEach((row, index) => {
			if (index === ticket.row - 1) {
				// loop through seats and give false value if seat is sold
				row.seats.forEach((e, i, arr) =>
					i === ticket.seat - 1 ? (arr[i] = false) : null
				)
			}
		})
	}

	const hallSizeHandler = e => {
		const btnClass = e.target.className

		let seatSize = +hallPlanEl.current.className.split('-')[1]

		if (btnClass === 'seat-size-enlarger') {
			hallPlanEl.current.className = `size-${++seatSize}`

			if (seatSize === maxSeatSize) {
				setDisabledSeatSizeBtn('enlarger')
			} else if (seatSize === minSeatSize + 1) {
				setDisabledSeatSizeBtn(false)
			}
		} else if (btnClass === 'seat-size-reducer') {
			hallPlanEl.current.className = `size-${--seatSize}`

			if (seatSize === minSeatSize) {
				setDisabledSeatSizeBtn('reducer')
			} else if (seatSize === maxSeatSize - 1) {
				setDisabledSeatSizeBtn(false)
			}
		}
	}

	const pickSeatHandler = e => {
		const seatEl = e.target
		pickSeat(seatEl.id)

		if (!seatEl.classList.contains('active')) {
			seatEl.classList.add('active')
		} else {
			seatEl.classList.remove('active')
		}
	}

	return (
		<div className="hall">
			<div className="hall-size">
				<button
					className="seat-size-enlarger"
					onClick={hallSizeHandler}
					disabled={disabledSeatSizeBtn === 'enlarger'}
				>
					+
				</button>
				<button
					className="seat-size-reducer"
					onClick={hallSizeHandler}
					disabled={disabledSeatSizeBtn === 'reducer'}
				>
					-
				</button>
			</div>
			<div ref={hallPlanEl} className="size-3" id="plan">
				<div className="screen">screen</div>
				{hall.rows.map((row, index) => {
					const rowNum = index + 1
					if (row.seatType === 'premium') {
						return (
							<div className="row vip" key={row._id}>
								<span className="row-number">{rowNum}</span>
								{row.seats.map((seat, index) => {
									if (seat === false) {
										return (
											<div
												className="seat premium sold"
												key={row._id + index}
											></div>
										)
									}
									return (
										<div
											id={`seat_${
												index + 1
											}_${rowNum}_premium`}
											title={index + 1}
											className="seat premium"
											key={row._id + index}
											onClick={pickSeatHandler}
										></div>
									)
								})}
								<span className="row-number">{rowNum}</span>
							</div>
						)
					} else {
						return (
							<div className="row" key={row._id}>
								<span className="row-number">{rowNum}</span>
								{row.seats.map((seat, index) => {
									if (seat === false) {
										return (
											<div
												className="seat sold"
												key={row._id + index}
											></div>
										)
									}
									return (
										<div
											id={`seat_${
												index + 1
											}_${rowNum}_stand`}
											title={index + 1}
											className="seat"
											key={row._id + index}
											onClick={pickSeatHandler}
										></div>
									)
								})}
								<span className="row-number">{rowNum}</span>
							</div>
						)
					}
				})}
			</div>
		</div>
	)
}
