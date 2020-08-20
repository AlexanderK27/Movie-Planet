const { Schema, model, Types } = require('mongoose')

const movieSchema = new Schema({
	description: {
		name: { type: String, required: true, trim: true },
		genres: { type: String, required: true, trim: true },
		time: { type: Number, required: true },
		production: { type: String, required: true, trim: true },
		directors: { type: String, required: true, trim: true },
		stars: { type: String, required: true, trim: true },
		storyline: { type: String, required: true, trim: true },
		poster: { type: Buffer },
		trailer: { type: String }
	},
	startDate: { type: Number, required: true },
	endDate: { type: Number, required: true },
	schedule: [
		{
			sessions: [
				{
					time: { type: String, required: true, trim: true },
					hall: { type: Types.ObjectId, required: true },
					seatPrice: {
						stand: { type: Number, required: true },
						premium: { type: Number, required: true }
					},
					soldTickets: [
						{
							row: { type: Number, required: true },
							seat: { type: Number, required: true },
							seatType: {
								type: String,
								required: true,
								trim: true
							},
							sesDate: { type: Number, required: true }
						}
					]
				}
			]
		}
	]
})

const Movie = model('Movie', movieSchema)

module.exports = Movie
