const { Schema, model, Types } = require('mongoose')

const hallSchema = new Schema({
	color: { type: String, required: true, trim: true },
	rows: [
		{
			seatType: { type: String, default: 'stand', trim: true },
			seats: [{ type: Boolean, default: true }]
		}
	]
})

const Hall = model('Hall', hallSchema)

module.exports = Hall
