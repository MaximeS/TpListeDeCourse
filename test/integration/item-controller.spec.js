const request = require('supertest')
const chai = require('chai')
const expect = chai.expect
chai.should()


const { find } = require('lodash')

const db = require('../../data/db')
const app = require('../../app')

const courseListFixture = require('../fixtures/courseList')

describe('itemController', () => {
    beforeEach(() => { courseListFixture.up() })
    afterEach(() => { courseListFixture.down() })

    describe('When I add something to a courselist',()=>{
        it('should push an item into a courselist',()=>{
          const item={name:"My Test Item 3",quantity:1}
          const myList="Toto"
          return request(app)
            .post('/item-lists')
            .send({name: myList,list:item})
            .then((res)=>{
              res.status.should.equal(200)
              res.body.should.eql({
                message: 'Pushed'
              })
            })
        })
        it('should reject when there is no list name given',()=>{
            const item={name:"My Test Item 3",quantity:1}
            return request(app)
              .post('/item-lists')
              .send({list:item})
              .then((res)=>{
                res.status.should.equal(400)
                res.body.should.eql({
                    error: {
                        code: 'VALIDATION',
                        message: 'Missing list name'
                  }
                })
              })
        })
        it('should reject when there is no item name given',()=>{
            const item={quantity:1}
            const myList="Toto"
            return request(app)
              .post('/item-lists')
              .send({name:myList,list:item})
              .then((res)=>{
                res.status.should.equal(400)
                res.body.should.eql({
                    error: {
                        code: 'VALIDATION',
                        message: 'Missing item name'
                  }
                })
              })
        })
        it('should reject when there is no quantity given',()=>{
            const item={name:"My Test Item 3"}
            const myList="Toto"
            return request(app)
              .post('/item-lists')
              .send({name:myList,list:item})
              .then((res)=>{
                res.status.should.equal(400)
                res.body.should.eql({
                    error: {
                        code: 'VALIDATION',
                        message: 'Missing quantity'
                  }
                })
              })
        })
        it('should reject when the list doesn t exist',()=>{
            const item={name:"My Test Item 3",quantity:1}
            const myList="Not existant"
            return request(app)
              .post('/item-lists')
              .send({name:myList,list:item})
              .then((res)=>{
                res.status.should.equal(400)
                res.body.should.eql({
                    error: {
                        code: 'VALIDATION',
                        message: 'Not existant list'
                  }
                })
              })
        })
      })
      describe('When I want to know about my articles of a courselist',()=>{
          it('should return my items of a list',()=>{
            const myList="Toto"
            const itemlist=find(db.courseList,{name:myList}).list
            return request(app)
            .get('/item-lists')
            .send({name:myList})
            .then((res)=>{
              res.status.should.equal(200)
              expect(res.body.data).to.be.eql(itemlist)
            })
          })
          it('should reject when no itemlist is given',()=>{
            return request(app)
            .get('/item-lists')
            .then((res)=>{
              res.status.should.equal(400)
              res.body.should.eql({
                error: {
                    code: 'VALIDATION',
                    message: 'Missing list name'
              }
            })
            })
          })
          it('should reject when itemlist is not existant',()=>{
            const myList="Not existant"
            return request(app)
            .get('/item-lists')
            .send({name:myList})
            .then((res)=>{
              res.status.should.equal(400)
              res.body.should.eql({
                error: {
                    code: 'VALIDATION',
                    message: 'Not existant list'
                 }
                })
            })
          })
      })
      describe('When I want to flag my items as ok',()=>{
          it('should flag my item as bought',()=>{
            const item="My Test Item"
            const myList="Toto"
            return request(app)
              .put('/item-lists')
              .send({listname: myList ,itemname:item})
              .then((res)=>{
                res.status.should.equal(200)
                res.body.should.eql({
                  message: 'Item bought'
                })
              })
          })
          it('should reject when there is no item name given',()=>{
            const myList="Toto"
            return request(app)
              .put('/item-lists')
              .send({listname: myList})
              .then((res)=>{
                res.status.should.equal(400)
                res.body.should.eql({
                    error: {
                        code: 'VALIDATION',
                        message: 'No item name'
                     }
                    })
              })
          })
          it('should reject when there is no list name given',()=>{
            const item="My Test Item"
            return request(app)
              .put('/item-lists')
              .send({itemname:item})
              .then((res)=>{
                res.status.should.equal(400)
                res.body.should.eql({
                    error: {
                        code: 'VALIDATION',
                        message: 'No list name'
                     }
                    })
              })
          })
          it('should reject when there is a wrong item name given',()=>{
            const item="Not existant"
            const myList="Toto"
            return request(app)
              .put('/item-lists')
              .send({listname:myList,itemname:item})
              .then((res)=>{
                res.status.should.equal(400)
                res.body.should.eql({
                    error: {
                        code: 'VALIDATION',
                        message: 'Not existant item name'
                     }
                    })
              })
          })
          it('should reject when there is a wrong list name given',()=>{
            const item="My Test Item"
            const myList="Not existant"
            return request(app)
              .put('/item-lists')
              .send({listname:myList,itemname:item})
              .then((res)=>{
                res.status.should.equal(400)
                res.body.should.eql({
                    error: {
                        code: 'VALIDATION',
                        message: 'Not existant list name'
                     }
                    })
              })
          })
      })
})  