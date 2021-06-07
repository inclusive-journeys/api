const User = require('../models')
const formidable = require('formidable')
const {Order} = require('../../shop/order/models')
const {errorHandler} = require('../../../utils/helpers/dbErrorHandler')

exports.userById = (req, res, next, id) => {
    User.findById(id).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User not found'
            })
        }

        req.profile = user
        next()
    })
}

exports.userBySlug = (req, res, next, slug) => {
    User.findOne({slug: slug})
        .exec((err, user) => {
            if (err || !user) {
                return res.status(400).json({
                    error: 'User not found'
                })
            }

            req.profile = user
            next()
        })
}

exports.read = (req, res) => {
    req.profile.hashed_password = undefined
    req.profile.salt = undefined
    return res.json(req.profile)
}

exports.update = (req, res) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true,
        form.parse(req, (err, fields) => {
            let _id = req.user._id
            let user = req.user
            user = _.extend(user, fields)

            user.save((err, result) => {
                if (err) {
                    return res.status(400).json({
                        error: errorHandler(err)
                    })
                }

                res.json(result)
            })
        })
}

exports.remove = (req, res) => {
    let user = req.user
    user.remove((err) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }

        res.json({
            message: 'Language deleted successfully'
        })
    })
}

exports.list = (req, res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 50

    User.find()
        .limit(limit)
        .exec((err, users) => {
            if (err) {
                return res.status(400).json({
                    message: 'users not found'
                })
            }

            res.send(users)
        })
}

exports.addOrderToUserHistory = (req, res, next) => {
    let history = []

    req.body.order.products.forEach(item => {
        history.push({
            _id: item._id,
            name: item.name,
            slug: item.slug,
            description: item.description,
            photo: item.photo,
            category: item.category,
            quantity: item.quantity,
            transactionId: req.body.order.transactionId,
            amount: req.body.order.amount
        })
    })

    if (!!req.body.order.user) {
        User.findOneAndUpdate({_id: req.body.order.user}, {$push: {history: history}}, {new: true}, (error, data) => {
            if (error) {
                return res.status(400).json({
                    error: 'Could not update User purchase history'
                })
            }
            next()
        })
    } else {
        next()
    }

}

exports.purchaseHistory = (req, res) => {
    Order.find({user: req.profile._id})
        .populate('user', '_id name')
        .sort('-createdAt')
        .exec((err, orders) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }
            res.json(orders)
        })
}


