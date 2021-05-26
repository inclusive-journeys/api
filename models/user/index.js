const mongoose = require('mongoose')
const crypto = require('crypto')
const uuidv1 = require('uuid/v1')
const slug = require('mongoose-slug-updater');
const {ObjectId} = mongoose.Schema

mongoose.plugin(slug);

const userSchema = new mongoose.Schema({
    avatar: String,
    email: {
        type: String,
        unique: true,
        sparse: true,
        trim: true
    },
    handle: String,
    hashed_password: {
        type: String,
        required: true,
    },
    identity: {
        type: ObjectId,
        ref: 'Identity',
    },
    nameFirst: {
        type: String,
        trim: true,
    },
    nameMiddle: {
        type: String,
        trim: true,
    },
    nameLast: {
        type: String,
        trim: true,
    },
    role: {
        type: Number,
        default: 2
    },
    tel: {
        type: String,
        unique: true
    },
    salt: String,
    slug: {
        type: String,
        slug: ["nameFirst"],
        unique: true
    }
}, {timestamps: true})

/// virtual field
userSchema.virtual('password')
    .set(function (password) {
        this._password = password
        this.salt = uuidv1()
        this.hashed_password = this.encryptPassword(password)
    })
    .get(function () {
        return this._password
    })

//objectID necessary for algolia search
userSchema.virtual('objectID').get(function () {
    return this._id;
})

userSchema.set('toJSON', {
    virtuals: true
})

userSchema.methods = {
    authenticate: function (plainText) {
        return this.encryptPassword(plainText) === this.hashed_password
    },

    encryptPassword: function (password) {
        if (!password) return ''
        try {
            return crypto.createHmac('sha1', this.salt).update(password).digest('hex')

        } catch (err) {
            return ''
        }
    }
}

module.exports = mongoose.model('User', userSchema)
