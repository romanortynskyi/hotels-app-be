const firebase = require('firebase-admin')
const path = require('path')
const { v4: uuid } = require('uuid')

const uploadService = {
  uploadFile: async (file, directory) => {
    const { createReadStream, filename: originalName } = file

    const bucket = firebase.storage().bucket(process.env.BUCKET_URL)

    const extension = path.extname(originalName)
    const filename = `${directory}/${uuid()}${extension}`

    return new Promise((resolve, reject) => {
      createReadStream().pipe(
        bucket
          .file(filename)
          .createWriteStream()
          .on('finish', async () => {
            await bucket.file(filename).makePublic() 
            
            const src = `https://storage.googleapis.com/${bucket.name}/${filename}`
            const result = {
              filename,
              src,
            }

            resolve(result)
          })
          .on('error', (error) => {
            reject(error)
          })
      )
    })
  },

  deleteFile: async (filename) => {
    const bucket = firebase.storage().bucket(process.env.BUCKET_URL)
    await bucket.file(filename).delete()
  },
}

module.exports = uploadService
