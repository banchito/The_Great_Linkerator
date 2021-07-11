

// require and re-export all files in this db directory (users, activities...)

module.exports = {
   ...require('./links'),
   ...require('./tags'),
   ...require('./link_tags')

}