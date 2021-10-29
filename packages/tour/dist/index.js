
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./tour.cjs.production.min.js')
} else {
  module.exports = require('./tour.cjs.development.js')
}
