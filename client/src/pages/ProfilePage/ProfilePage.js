import React, { useState, useCallback, useEffect, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import QRCode from 'qrcode'
import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'
import { useHttp } from '../../hooks/http.hook'
import { AuthContext } from '../../context/AuthContext'
import { Loader } from '../../utils/Loader/Loader'
import { TicketsList } from '../../components/TicketsList/TicketsList'
import { OrderTemplate } from '../../documents/OrderTemplate'
import './ProfilePage.css'
pdfMake.vfs = pdfFonts.pdfMake.vfs

export const ProfilePage = () => {
	document.title = 'Profile'
	const history = useHistory()
	const [tickets, setTickets] = useState([])
	const [user, setUser] = useState({ name: '', email: '' })
	const { request, loading } = useHttp()
	const { token, tokenTime, expireTime, logout } = useContext(AuthContext)
	const [qrcode, setQrcode] = useState(false)

	const getTickets = useCallback(async () => {
		try {
			const fetched = await request(`/api/tickets/my`, 'GET', null, {
				Authorization: `Bearer ${token}`
			})
			setTickets(fetched)
		} catch (e) {}
	}, [token, request])

	useEffect(() => {
		getTickets()
	}, [getTickets, token])

	const getUser = useCallback(async () => {
		try {
			const fetched = await request(`/api/user/me`, 'GET', null, {
				Authorization: `Bearer ${token}`
			})
			setUser(fetched)
		} catch (e) {}
	}, [token, request])

	useEffect(() => {
		getUser()
	}, [getUser, token])

	useEffect(
		useCallback(() => {
			if (qrcode) {
				const canvas = document.getElementById('qrcode')
				QRCode.toCanvas(
					canvas,
					qrcode,
					{ width: 300, margin: 2 },
					error => {
						if (error) {
							canvas
								.getContext('2d')
								.ctx.fillText(
									'Something went wrong, unable to generate a QRCode :(',
									10,
									10
								)
						}
					}
				)
			}
		}, [qrcode]),
		[qrcode]
	)

	const downloadOrderPDF = tickets => {
		pdfMake
			.createPdf(OrderTemplate(tickets).docDefinition)
			.download(`Movie_Planet_${tickets[0].orderNum}`)
	}
	const openOrderPDF = tickets => {
		pdfMake.createPdf(OrderTemplate(tickets).docDefinition).open()
	}
	const generateQRCodeHandler = text => setQrcode(text)
	const closeQRCodeHadler = () => setQrcode(null)

	if (loading) {
		return <Loader />
	}

	if (!tokenTime || tokenTime + expireTime < Date.now()) {
		logout()
		history.push('/auth/signin')
	}

	return (
		<>
			{!loading && (
				<div className="profile-page">
					{qrcode ? (
						<div className="qrcode-background">
							<div>
								<span onClick={closeQRCodeHadler}>&times;</span>
								<canvas id="qrcode"></canvas>
							</div>
						</div>
					) : null}
					<TicketsList
						className="tickets-list"
						tickets={tickets}
						qrcodeHandler={generateQRCodeHandler}
						downloadOrderPDF={downloadOrderPDF}
						openOrderPDF={openOrderPDF}
					/>
					<div className="sidebar">
						<div className="user-data">
							<p>Signed in as</p>
							<h4>{user.name}</h4>
							<p>{user.email}</p>
						</div>
					</div>
				</div>
			)}
		</>
	)
}
