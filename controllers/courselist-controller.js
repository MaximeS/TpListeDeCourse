const express = require('express')
const router = express.Router()
const BadRequestError = require('../errors/bad-request')
const { find, remove, findAll} = require('lodash')
const uuid=require('../lib/guuid')

const db = require('../data/db')
const courseListCollection = db.courseList

router.post('/', (req, res, next) => {
  if (!req.body.name) {
    return next(new BadRequestError('VALIDATION', 'Missing name'))
  }

  const name = req.body.name

  // Check for name uniqueness
  const result = find(courseListCollection, { name })
  if (result) {
    return next(new BadRequestError('VALIDATION', 'Name should be unique'))
  }

  const newCourseList = {
    id: uuid.generateUuid(),
    name
  }

  courseListCollection.push(newCourseList)

  res.json({
    data: newCourseList
  })
})
router.delete('/',(req,res,next)=>{
  if(!req.body.name)
  {
    res.status(400)
    return res.json({
      error: {
        code: 'VALIDATION',
        message: 'No name given'
      }
    })
  }
  const name = req.body.name
  const result = find(courseListCollection,{name})
  if(!result)
  {
    
    return next(new BadRequestError('VALIDATION','Not existant list can t be deleted'))
  }
  remove (courseListCollection,{name})
  return res.json({message : 'Deleted'})
})

router.get('/',(req,res,next)=>{
  res.json({
    data: courseListCollection,
  })
})

module.exports = router