const mongoose = require('mongoose')
const slug = require('mongoose-slug-updater')

mongoose.plugin(slug)

const genderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        maxLength: 32
    },
    description: {
        type: String
    },
    slug: {
        type: String,
        slug: 'name',
        unique: true
    },
    type: {
        type: String,
        default: 'gender'
    }
})

genderSchema.virtual('objectID').get(function () {
    return this._id.toHexString()
})

genderSchema.set('toJSON', {
    virtuals: true
})

module.exports = mongoose.model('Gender', genderSchema)
