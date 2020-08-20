const { Router } = require('express')
const { check, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const router = Router()

router.post(
	'/registration',
	[
		check('userName', 'Please, provide your name').trim().notEmpty(),
		check('email', 'Invalid email').normalizeEmail().isEmail(),
		check(
			'password',
			'Password must contain at least 6 characters'
		).isLength({ min: 6 }),
	],
	async (req, res) => {
		try {
			const errors = validationResult(req)
			if (!errors.isEmpty()) {
				return res.status(400).json({
					errors: errors.array(),
					message: 'Invalid registration data',
				})
			}

			const { userName, email, password } = req.body

			const candidate = await User.findOne({ email })
			if (candidate) {
				return res.status(400).json({ message: 'User already exists' })
			}

			const hashedPassword = await bcrypt.hash(password, 10)
			const user = new User({
				name: userName,
				email,
				password: hashedPassword,
			})

			await user.save()

			const token = jwt.sign(
				{ userId: user.id },
				process.env.JWT_SECRET,
				{ expiresIn: '1h' }
			)
			const countdownStartPoint = Date.now()

			res.status(201).json({
				token,
				userId: user.id,
				tokenStart: countdownStartPoint,
			})
		} catch (e) {
			res.status(500).json({
				message: 'Something went wrong, try again later',
			})
		}
	}
)

router.post(
	'/login',
	[
		check('email', 'Invalid email').normalizeEmail().isEmail(),
		check('password', 'Invalid password').exists(),
	],
	async (req, res) => {
		try {
			const errors = validationResult(req)
			if (!errors.isEmpty()) {
				return res.status(400).json({
					errors: errors.array(),
					message: 'Invalid email or password',
				})
			}

			const { email, password } = req.body

			const user = await User.findOne({ email })
			if (!user) {
				return res
					.status(400)
					.json({ message: 'Invalid email or password' })
			}

			const isMatch = await bcrypt.compare(password, user.password)
			if (!isMatch) {
				return res
					.status(400)
					.json({ message: 'Indalid email or password' })
			}

			const token = jwt.sign(
				{ userId: user.id },
				process.env.JWT_SECRET,
				{ expiresIn: '1h' }
			)
			const countdownStartPoint = Date.now()

			res.json({
				token,
				userId: user.id,
				tokenStart: countdownStartPoint,
			})
		} catch (e) {
			res.status(500).json({
				message: 'Something went wrong, try again later',
			})
		}
	}
)

module.exports = router
