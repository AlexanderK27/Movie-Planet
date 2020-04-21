const { Router } = require('express')
const auth = require('../middleware/auth.middleware')
const User = require('../models/User')
const { sendContactEmail } = require('../emails/emailTemplates')
const router = Router()

router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId)
        res.json(user)
    } catch (e) {
        res.status(500).json({ message: 'Something went wrong, try again later' })
    }
})

router.post('/mail', async (req, res) => {
    try {
        sendContactEmail(req.body)
        res.json({ message: 'Your message has been successfuly sent. We will reply you as soon as possible. Thank you for choosing our movie theater!' })
    } catch (e) {
        res.status(500).json({ message: 'Something went wrong, try again later' })
    }
})

module.exports = router