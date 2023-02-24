const mockFileResponse = {
  src: 'src',
  filename: 'filename',
}

const mockUploadFile = jest.fn(() => new Promise((resolve) => {
  resolve(mockFileResponse)
}))

const mockUploadFileError = jest.fn(() => new Promise((_, reject) => {
  reject()
}))

module.exports = {
  mockFileResponse,
  mockUploadFile,
  mockUploadFileError,
}
