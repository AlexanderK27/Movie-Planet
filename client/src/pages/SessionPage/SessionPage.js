import React, { useState, useCallback, useEffect, useContext } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import moment from 'moment'
import { AuthContext } from '../../context/AuthContext'
import { useHttp } from '../../hooks/http.hook'
import { Loader } from '../../utils/Loader/Loader'
import { HallPlan } from '../../components/HallPlan/HallPlan'
import { PurchaseWindow } from '../../components/ModalWindows/ModalWindows'
import './SessionPage.css'

export const SessionPage = () => {
	const history = useHistory()
	const sessionId = useParams().id
	const { request, loading } = useHttp()
	const { token, tokenTime, expireTime, logout } = useContext(AuthContext)
	const [session, setSession] = useState(null)
	const [hall, setHall] = useState(null)
	const [tickets, setTicket] = useState([])
	const [isModalOpened, setIsModalOpened] = useState(false)

	let tokenValue = token

	if (tokenTime + expireTime < Date.now()) {
		logout()
		tokenValue = false
	}

	const movieName = localStorage.getItem('movieName')
	const movieId = localStorage.getItem('movieId')
	const sesDate = parseInt(localStorage.getItem('date'))

	const pickSeatHandler = ticketData => {
		let ticketsArr = [].concat(tickets)
		const newTicket = ticketData.split('_')
		const isAlreadyInArr = ticketsArr.find(
			el => el.row === newTicket[2] && el.seat === newTicket[1]
		)

		if (isAlreadyInArr) {
			const cleanedArr = ticketsArr.filter(el => {
				if (el.row === newTicket[2] && el.seat === newTicket[1]) {
					return false
				} else {
					return true
				}
			})
			return setTicket(cleanedArr)
		}

		ticketsArr.push({
			price: newTicket[3],
			row: newTicket[2],
			seat: newTicket[1]
		})
		setTicket(ticketsArr)
	}

	const getSession = useCallback(async () => {
		try {
			if (!movieId) {
				return history.push('/')
			}
			const fetched = await request(
				`/api/movies/session/${sessionId}?mv=${movieId}`,
				'GET'
			)
			const fSession = fetched.session
			const fHall = fetched.hall
			setSession(fSession)
			setHall(fHall)
		} catch (e) {}
	}, [sessionId, movieId, request, history])

	useEffect(() => {
		getSession()
	}, [getSession])

	const openModalHandler = () => {
		if (tickets.length === 0) {
			return null
		}
		if (tokenValue) {
			setIsModalOpened(true)
		}
	}

	const closeModalHandler = () => {
		setIsModalOpened(false)
	}

	const buyTicketHandler = async () => {
		if (tokenValue) {
			if (tokenTime + expireTime < Date.now()) {
				logout()
				return history.push('/auth/signin')
			}
			if (tickets.length === 0) {
				return null
			}
			const orderNum = parseInt(
				Date.now().toString().slice(0, 6) +
					Date.now().toString().slice(9)
			)
			const orderPOST = []
			const orderPATCH = []

			let date = moment(sesDate).format('YYYY/MM/DD')
			let time = session.time.split(':')
			let hour = parseInt(time[0], 10)
			hour = hour === 12 ? hour : (hour += 12)
			time = `${hour}:${time[1]}:00`
			date = new Date(`${date} ${time}`).getTime()

			for (let ticket in tickets) {
				orderPOST.push({
					movieName,
					date,
					row: tickets[ticket].row,
					seat: tickets[ticket].seat,
					seatType: tickets[ticket].price,
					price: session.seatPrice[tickets[ticket].price],
					orderNum
				})
				orderPATCH.push({
					movieId,
					sessionId,
					row: tickets[ticket].row,
					seat: tickets[ticket].seat,
					seatType: tickets[ticket].price,
					sesDate
				})
			}

			try {
				await request(
					'/api/tickets/purchase',
					'POST',
					{
						order: orderPOST
					},
					{ Authorization: `Bearer ${tokenValue}` }
				)
			} catch (e) {}
			try {
				await request(
					'/api/tickets/purchase',
					'PATCH',
					{
						order: orderPATCH
					},
					{ Authorization: `Bearer ${tokenValue}` }
				)
			} catch (e) {}

			history.push('/profile')
		}
	}

	if (loading) {
		return <Loader />
	}

	if (hall) {
		let hallName = hall.color.split('')
		hallName[0] = hallName[0].toUpperCase()
		document.title = `Pick a seat | ${hallName
			.toString()
			.replace(/,/g, '')} hall`
	}

	// Total cost of selected tickets
	let total = 0
	tickets.map(ticket => {
		total += session.seatPrice[ticket.price]
		return total
	})

	return (
		<>
			{!loading && session && hall && (
				<div className="session-page">
					{isModalOpened ? (
						<PurchaseWindow
							props={{
								movieName,
								sesDate,
								time: session.time,
								seatPrice: session.seatPrice,
								tickets,
								total,
								buyTicketHandler,
								closeModalHandler
							}}
						/>
					) : null}
					<div className="movie-data">
						<h2>{movieName}</h2>
						<p>
							{moment(sesDate).format('MMMM D')} {session.time}
						</p>
					</div>
					<div className="purchase-data">
						<div>
							<p>Your tickets</p>
							<div className="neon"></div>
							{tickets.map((ticket, index) => {
								return (
									<div
										key={ticket.row * Math.random()}
										className="ticket"
									>
										<div>
											{index + 1}. &nbsp;Row: {ticket.row}
											, Seat: {ticket.seat}
										</div>
										<div>
											(${session.seatPrice[ticket.price]})
										</div>
									</div>
								)
							})}
						</div>
						<div>
							<p>Total: ${total}</p>
							<button
								disabled={!!!tokenValue}
								onClick={openModalHandler}
							>
								Buy
							</button>
						</div>
						{!tokenValue ? (
							<p className="warning-message">
								Sign in to buy a ticket
							</p>
						) : null}
					</div>
					<div className="hallplan-wrapper">
						<HallPlan
							session={session}
							hall={hall}
							pickSeat={pickSeatHandler}
						/>
					</div>
				</div>
			)}
		</>
	)
}
