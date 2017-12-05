const { courseList } = require('../../data/db')

mockData = [
  { id: 1, name: 'Toto', list:[{name: "My Test Item",quantity: 1},{name: "My Test Item 2", quantity: 2}] },
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