const { Schema, model, Types } = require('mongoose')

const ticketSchema = new Schema({
	movieName: { type: String, required: true, trim: true },
	date: { type: Number, trim: true },
	row: { type: Number, required: true },
	seat: { type: Number, required: true },
	seatType: { type: String, required: true, trim: true },
	price: { type: Number, required: true },
	purchDate: { type: Date, required: true, default: Date.now },
	orderNum: { type: Number, required: true },
	owner: { type: Types.ObjectId, required: true, ref: 'User' }
})

const Ticket = model('Ticket', ticketSchema)

module.exports = Ticket
