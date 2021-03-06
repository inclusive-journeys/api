const AdaptiveEquipment = require('../models/adaptiveEquipment')
const formidable = require('formidable')
const _ = require('lodash')
const fs = require('fs')
const {errorHandler} = require('../../../utils/helpers/dbErrorHandler')


exports.adaptiveEquipmentById = (req, res, next, id) => {
    const adaptiveEquipmentId = id.substr(id.lastIndexOf('-') + 1)

    AdaptiveEquipment.findById(id)
        .exec((err, adaptiveEquipment) => {
            if (err || !adaptiveEquipment) {
                return res.status(400).json({
                    status: 410,
                    error: 'adaptiveEquipment not found'
                })
            }
            req.adaptiveEquipment = adaptiveEquipment
            next()
        })
}

exports.adaptiveEquipmentBySlug = (req, res, next, slug) => {
    AdaptiveEquipment.findOne({slug: slug})
        .exec((err, adaptiveEquipment) => {
            if (err || !adaptiveEquipment) {
                return res.status(400).json({
                    error: 'adaptiveEquipment not found'
                })
            }
            req.adaptiveEquipment = adaptiveEquipment
            next()
        })
}

exports.create = (req, res) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true,
        form.parse(req, (err, fields, files) => {
            let adaptiveEquipment = new AdaptiveEquipment(fields)

            adaptiveEquipment.save((err, result) => {
                if (err) {
                    return res.status(400).json({
                        error: errorHandler(err)
                    })
                }

                res.json(result)
            })
        })
}

exports.read = (req, res) => {
    return res.json(req.adaptiveEquipment)
}

exports.update = (req, res) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true,
        form.parse(req, (err, fields) => {
            let _id = req.adaptiveEquipment._id
            let adaptiveEquipment = req.adaptiveEquipment
            adaptiveEquipment = _.extend(adaptiveEquipment, fields)


            adaptiveEquipment.save((err, result) => {
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
    let adaptiveEquipment = req.adaptiveEquipment
    adaptiveEquipment.remove((err) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }

        res.json({
            message: 'AdaptiveEquipment deleted successfully'
        })
    })
}

exports.list = (req, res) => {
    let sortBy = req.query.sortBy ? req.query.sortBy : '_id'
    let limit = req.query.limit ? parseInt(req.query.limit) : 6

    AdaptiveEquipment.find()
        .sort([[sortBy]])
        .limit(limit)
        .exec((err, adaptiveEquipments) => {
            if (err) {
                return res.status(400).json({
                    message: 'adaptiveEquipment not found'
                })
            }

            res.send(adaptiveEquipments)
        })
}

