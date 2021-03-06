const mongoose = require('mongoose')
const slug = require('mongoose-slug-updater');
const {ObjectId, Types} = mongoose.Schema

mongoose.plugin(slug);

const ReviewSchema = new mongoose.Schema({
    review: {
        type: String,
        default: false,
        maxLength: 5000
    },
    safe: {
        type: String,
        trim: true
    },
    celebrated: {
        type: String,
        trim: true
    },
    welcome: {
        type: String,
        trim: true
    },
    photo: {
        type: String,
        trim: true
    },
    user: {
        type: ObjectId,
        ref: 'User'
    },
    place: {
      type: ObjectId,
      ref: 'Place'
    },
    placeName: {
        type: String,
        trim: true
    },
    placeSlug: {
        type: String,
        trim: true
    },
    updated: {
        type: Date,
        default: Date.now
    },
})

//objectID necessary for algolia search
ReviewSchema.virtual('objectID').get(function () {
    return this._id;
})

ReviewSchema.set('toJSON', {
    virtuals: true
})

module.exports = mongoose.model('Review', ReviewSchema)
