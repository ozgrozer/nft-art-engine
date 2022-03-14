const withTM = require('next-transpile-modules')(['rfv'])

module.exports = withTM({
  images: {
    domains: ['res.cloudinary.com']
  }
})
