const { Schema, model, Types } = require('mongoose')

const userSchema = new Schema({
	name: { type: String, required: true, trim: true },
	email: { type: String, required: true, unique: true, trim: true },
	password: { type: String, required: true, trim: true },
	tickets: [{ type: Types.ObjectId, ref: 'Ticket' }]
})

userSchema.virtual('usertickets', {
	ref: 'Ticket',
	localField: '_id',
	foreignField: 'owner'
})

userSchema.methods.toJSON = function () {
	const user = this
	const userObject = user.toObject()

	delete userObject.password

	return userObject
}

const User = model('User', userSchema)

module.exports = User
