const { courseList } = require('../../data/db')

mockData = [
  { id: 1, name: 'Toto', list:[{id : 1, name: "My Test Item",quantity: 1,bought:false},{id : 2,name: "My Test Item 2", quantity: 2,bought:false}] },
  { id: 2, name: 'Ma liste', list: [] }
]

module.exports = {
  up: () => {
    courseList.splice(0)
    courseList.push.apply(courseList, mockData)
  },

  down: () => {
    courseList.splice(0)
  }
}