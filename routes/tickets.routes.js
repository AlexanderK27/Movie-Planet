const fs = require('fs')
const { Router } = require('express')

const auth = require('../middleware/auth.middleware')
const Movie = require('../models/Movie')
const orderTemplate = require('../documents/orderTemplate')
const { sendEmailWithTicket } = require('../emails/emailTemplates')
const User = require('../models/User')
const Ticket = require('../models/Ticket')

const router = Router()

router.post('/purchase', auth, async (req, res) => {
	const order = req.body.order

	try {
		for (let tck in order) {
			const ticket = new Ticket({ ...order[tck], owner: req.user.userId })
			await ticket.save()
		}

		const user = await User.findById(req.user.userId)
		const tickets = await Ticket.find({ orderNum: order[0].orderNum })

		orderTemplate(tickets)

		setTimeout(() => {
			let buff = fs.readFileSync('movie-planet-ticket.pdf')
			let base64data = buff.toString('base64')

			sendEmailWithTicket(user.email, base64data)

			res.status(201).send()
		}, 1000)
	} catch (e) {
		res.status(500).json({
			message: 'Something went wrong, try again later'
		})
	}
})

router.patch('/purchase', auth, async (req, res) => {
	const order = req.body.order

	try {
		const movie = await Movie.findById(order[0].movieId)

		for (let tck in order) {
			for (let day of movie.schedule) {
				day.sessions.forEach(session => {
					if (session._id.toString() === order[tck].sessionId) {
						session.soldTickets.push({
							row: order[tck].row,
							seat: order[tck].seat,
							seatType: order[tck].seatType,
							sesDate: order[tck].sesDate
						})
					}
				})
			}
		}

		await movie.save()
		res.send()
	} catch (e) {
		res.status(500).json({
			message: 'Something went wrong, try again later'
		})
	}
})

router.get('/my', auth, async (req, res) => {
	try {
		const user = await User.findById(req.user.userId)
		await user
			.populate({
				path: 'usertickets',
				options: {
					sort: { date: -1 }
				}
			})
			.execPopulate()
		res.send(user.usertickets)
	} catch (e) {
		res.status(500).json({
			message: 'Something went wrong, try again later'
		})
	}
})

module.exports = router
