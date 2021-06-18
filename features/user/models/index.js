const mongoose = require('mongoose')
const crypto = require('crypto')
const uuidv1 = require('uuid/v1')
const slug = require('mongoose-slug-updater');
const {ObjectId} = mongoose.Schema

mongoose.plugin(slug);

const IdentitySchema = new mongoose.Schema({
    adaptiveEquipment: [{
        type: ObjectId,
        ref: 'AdaptiveEquipment'
    }],
    bodyModification: [{
        type: ObjectId,
        ref: 'BodyModification'
    }],
    blind: {
        type: Boolean,
        default: false
    },
    deaf: {
        type: Boolean,
        default: false
    },
    dateOfBirth: String,
    gender: [{
        type: ObjectId,
        ref: 'Gender'
    }],
    guideAnimal: {
        type: Boolean,
        default: false
    },
    languagePrimary: [{
        type: ObjectId,
        ref: 'Language'
    }],
    languageSecondary: [{
        type: ObjectId,
        ref: 'Language'
    }],
    methodOfCommunication: [{
        type: ObjectId,
        ref: 'MethodOfCommunication'
    }],
    physicalAppearance: [{
        type: ObjectId,
        ref: 'PhysicalAppearance'
    }],
    pronoun: [{
        type: ObjectId,
        ref: 'Pronoun'
    }],
    race: [{
        type: ObjectId,
        ref: 'Race'
    }],
    serviceAnimal: [{
        type: ObjectId,
        ref: 'ServiceAnimal'
    }],
    sexualOrientation: [{
        type: ObjectId,
        ref: 'SexualOrientation'
    }],
    transgender: {
        type: Boolean,
        default: false
    },
})

const userSchema = new mongoose.Schema({
    avatar: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        unique: true,
        sparse: true,
        trim: true,
        default: ''
    },
    ethnicHispanicOrigin: {
        type: Boolean,
        default: false
    },
    handle: {
        type: String,
        default: ''
    },
    hashed_password: {
        type: String,
        required: true,
    },
    identity: {
        type: IdentitySchema,
        default: () => ({})
    },
    nameFirst: {
        type: String,
        trim: true,
        default: ''
    },
    nameMiddle: {
        type: String,
        trim: true,
        default: ''
    },
    nameLast: {
        type: String,
        trim: true,
        default: ''
    },
    role: {
        type: Number,
        default: 2
    },
    tel: {
        type: String,
        unique: true,
        default: ''
    },
    salt: String,
    slug: {
        type: String,
        slug: ["nameFirst"],
        unique: true
    },
    type: {
        type: String,
        default: 'user'
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