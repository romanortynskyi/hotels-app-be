const fs = require('fs')
const path = require('path')

const image = fs.createReadStream(path.join(__dirname, 'test-image.png'))

const testImage = {
  promise: {
    createReadStream: () => image,
    stream: image,
    filename: 'test-image.png',
    mimetype: 'image/jpg',
  },
  file: {
    createReadStream: () => image,
    stream: image,
    filename: 'test-image.png',
    mimetype: 'image/jpg',
  },
}

module.exports = testImage
