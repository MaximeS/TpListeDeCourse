const request = require('supertest')
const chai = require('chai')
const expect = chai.expect
chai.should()


const { find } = require('lodash')

const db = require('../../data/db')
const app = require('../../app')

const courseListFixture = require('../fixtures/courseList')

describe('CourselistController', () => {
  beforeEach(() => { courseListFixture.up() })
  afterEach(() => { courseListFixture.down() })

  describe('When I create a courseList (POST /course-lists)', () => {
    it('should reject with a 400 when no name is given', () => {
      return request(app).post('/course-lists').then((res) => {
        res.status.should.equal(400)
        res.body.should.eql({
          error: {
            code: 'VALIDATION',
            message: 'Missing name'
          }
        })
      })
    })

    it('should reject when name is not unique', () => {
      return request(app)
        .post('/course-lists')
        .send({ name: 'Toto' })
        .then((res) => {
          res.status.should.equal(400)
          res.body.should.eql({
            error: {
              code: 'VALIDATION',
              message: 'Name should be unique'
            }
          })
      })
    })

    it('should succesfuly create a courseList', () => {
      const mockName = 'My New List'

      return request(app)
        .post('/course-lists')
        .send({ name: mockName })
        .then((res) => {
          res.status.should.equal(200)
          expect(res.body.data).to.be.an('object')
          res.body.data.name.should.equal(mockName)

          const result = find(db.courseList, { name: mockName } )
          result.should.not.be.empty
          result.should.eql({
            id: res.body.data.id,
            name: res.body.data.name
          })
        })
    })
  })
  describe('When I delete a list',()=>{
    it('should delete an item in a courseList',()=>{
      const myList = "My Test Item";
      return request(app)
        .post('/deletelist')
        .send({name: myList})
        .then((res)=>{
          res.status.should.equal(200)
          expect(res.body.data).to.be.an('object')
          res.body.data.should.eql({
            message: 'Deleted'
          })

          const result = find(db.courseList, {name: MockName})
          result.should.equal(undefined)
        })
    })
    it('should return an error inexistant',()=>{
      const myList = "Not Existant";
      return request(app)
        .post('/deletelist')
        .send({name: myList})
        .then((res)=>{
          res.status.should.equal(400)
          expect(res.body.data).to.be.an('object')
          res.body.data.should.eql({
            error:{
              code:'VALIDATION',
              message:'Not existant list can t be deleted'
            }
          })
        })
    })
    it('should reject when no name is given',()=>{
      return request(app)
        .post('/deletelist')
        .then((res)=>{
          res.status.should.equal(400)
          expect(res.body.data).to.be.an('object')
          res.body.data.should.eql({
            error:{
              code:'VALIDATION',
              message:'No name given'
            }
          })
        })
    })
  })
  describe('When I request all the lists',()=>{
    it('should return the itemlist',()=>{
      return request(app)
        .get('/lists')
        .then((res)=>{
          res.status.should.equal(200)
          expect(res.body.data).to.be.an('object')
        })
    })
  })
  describe('When I add something to a courselist',()=>{
    it('should push an item into a courselist',()=>{
      const item={name:"My Test Item 3",quantity:1}
      const myList="Toto"
      return request(app)
        .post('/pushitem')
        .send({name: myList,list:item})
        .then((res)=>{
          res.status.should.equal(200)
          expect(res.body.data).to.be.an('object')
          res.body.data.should.eql({
            
          })
        })
    })
  })
})
