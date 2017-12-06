const express = require('express')
const router = express.Router()
const BadRequestError = require('../errors/bad-request')
const { find, remove, findAll} = require('lodash')

const db = require('../data/db')
const courseListCollection = db.courseList
const uuid=require('../lib/guuid')

router.post('/',(req,res,next)=>{
    if (!req.body.name) {
        return next(new BadRequestError('VALIDATION', 'Missing list name'))
    }
    if (!req.body.list.name) {
        return next(new BadRequestError('VALIDATION', 'Missing item name'))
    }
    if (!req.body.list.quantity) {
        return next(new BadRequestError('VALIDATION', 'Missing quantity'))
    }
    const name=req.body.name
    const result = find(courseListCollection, { name })
    const item={
        id: uuid.generateUuid(),
        name: req.body.list.name,
        quantity: req.body.list.quantity,
        bought:false
    }
    if (result) {
        result.list.push(item)
        return res.json({message : 'Pushed'})
    }
    return next(new BadRequestError('VALIDATION', 'Not existant list'))
})
router.get('/',(req,res,next)=>{
    if (!req.body.name) {
        return next(new BadRequestError('VALIDATION', 'Missing list name'))
    }
    const name=req.body.name
    const result = find(courseListCollection, { name })
    console.log(result)
    if(result){
        return res.json({
            data:result.list
        })
    }
    return next(new BadRequestError('VALIDATION', 'Not existant list'))
})
router.put('/',(req,res,next)=>{
    if (!req.body.listname) {
        return next(new BadRequestError('VALIDATION', 'No list name'))
    }
    if (!req.body.itemname) {
        return next(new BadRequestError('VALIDATION', 'No item name'))
    }
    const listname=req.body.listname
    const listresult = find(courseListCollection,{ listname })
    if(!listresult)
    {
        return next(new BadRequestError('VALIDATION', 'Not existant list name'))
    }
    const itemname=req.body.itemname
    const itemresult=find(listresult,{itemname})
    if(!itemresult)
    {
        return next(new BadRequestError('VALIDATION', 'Not existant item name'))
        
    }
    itemresult.bought=true
    res.json({
        message: 'Item bought'
      }
    )
})

module.exports = router