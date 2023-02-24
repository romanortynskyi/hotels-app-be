const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const { User, Image } = require('~/models')
const createError = require('~/utils/create-error')
const {
  USER_ALREADY_EXISTS,
  BAD_TOKEN,
  INCORRECT_CREDENTIALS,
  USER_NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  USER_DOES_NOT_HAVE_AN_IMAGE,
} = require('~/consts/errors')
const { SALT_ROUNDS, USER_IMAGES } = require('~/consts')
const uploadService = require('~/modules/upload/upload.service')
const sequelize = require('~/sequelize')

const userService = {
	signUp: async (data, image) => {
		const {
      email,
      password,
      firstName,
      lastName,
    } = data

    const userByEmail = await User.findOne({
      where: {
        email,
      },
    })

    if (userByEmail) {
      throw createError(USER_ALREADY_EXISTS)
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)

    const transaction = await sequelize.transaction()

    try {
      let imageResponse, userImage

      if (image) {
        imageResponse = await uploadService.uploadFile(image.file, USER_IMAGES)
        userImage = await Image.create(imageResponse, { transaction })
      }

      const user = await User.create({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        ImageId: userImage?.id || null,
      }, { transaction })

      const userToSend = {
        id: user.id,
        firstName,
        lastName,
        role: user.role,
        email,
        image: userImage,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }

      const token = jwt.sign(userToSend, process.env.JWT_SECRET)

      await transaction.commit()

      return {
        ...userToSend,
        token,
      }
    }

    catch(error) {
      await transaction.rollback()
      throw createError(INTERNAL_SERVER_ERROR)
    }
	},

  login: async (data) => {
    const { email, password } = data

    const user = await User.findOne({
      where: {
        email,
      },
      attributes: [
        'id',
        'firstName',
        'lastName',
        'email',
        'password',
        'createdAt',
        'updatedAt',
      ], 
      include: {
        model: Image,
      },
    })

    if (!user) {
      throw createError(INCORRECT_CREDENTIALS)
    }

    const passwordIsCorrect = await bcrypt.compare(password, user.password)

    if (!passwordIsCorrect) {
      throw createError(INCORRECT_CREDENTIALS)
    }

    const {
      id,
      firstName,
      lastName,
      createdAt,
      updatedAt,
      Image: userImage,
    } = user

    const userToSend = {
      id,
      firstName,
      lastName,
      email,
      createdAt,
      updatedAt,
      image: userImage,
    }

    const token = jwt.sign(userToSend, process.env.JWT_SECRET)

    return {
      ...userToSend,
      token,
    }
  },

  getUserByToken: async (token) => {
    if (!token) {
      return null
    }

    let id

    try {
      ({ id } = jwt.verify(token, JWT_SECRET))
    }
    
    catch(err) {
      throw createError(BAD_TOKEN)
    }

    const user = await User.findOne({
      where: {
        id,
      },
      include: {
        model: Image,
      },
    })

    if (!user) {
      throw createError(BAD_TOKEN)
    }

    const userToSend = {
      ...user.dataValues,
      image: user.Image,
    }

    return userToSend
  },

  updateUser: async (id, data) => {
    const user = await User.findOne({
      where: {
        id,
      },
    })

    if (!user) {
      throw createError(USER_NOT_FOUND)
    }

    const { firstName, lastName } = data

    const updateResult = await User.update(
      {
        firstName,
        lastName,
      },
      {
        where: {
          id,
        },
        returning: true,
      }
    )

    const image = await Image.findOne({
      where: {
        id: user.ImageId,
      },
    })

    const updatedUser = {
      ...updateResult[1][0].dataValues,
      image,
    }

    return updatedUser
  },

  updateUserImage: async (id, image) => {
    const user = await User.findOne({
      where: {
        id,
      },
    })

    if (!user) {
      throw createError(USER_NOT_FOUND)
    }

    if (user.ImageId) {
      const oldImage = await Image.findOne({
        where: {
          id: user.ImageId,
        },
      })

      await uploadService.deleteFile(oldImage.filename)

      const imageResponse = await uploadService.uploadFile(image.file, USER_IMAGES)

      const updateResult = await Image.update(
        {
          src: imageResponse.src,
          filename: imageResponse.filename,
        },
        {
          where: {
            id: user.ImageId,
          },
          returning: true,
        }
      )

      const updatedImage = updateResult[1][0].dataValues

      const userToSend = {
        ...user.dataValues,
        image: updatedImage,
      }

      return userToSend
    }

    else {
      const imageResponse = await uploadService.uploadFile(image.file, USER_IMAGES)

      const transaction = await sequelize.transaction()

      try {
        const newImage = await Image.create(imageResponse, { transaction })

        await User.update(
          {
            ImageId: newImage.id,
          },
          {
            where: {
              id,
            },
            transaction,
          },
        )

        await transaction.commit()

        const userToSend = {
          ...user,
          image: newImage.dataValues,
        }

        return userToSend
      }

      catch(error) {
        await transaction.rollback()
        throw createError(INTERNAL_SERVER_ERROR)
      }
    }
  },

  deleteUserImage: async (id) => {
    const user = await User.findOne({
      where: {
        id,
      },
    })

    if (!user) {
      throw createError(USER_NOT_FOUND)
    }

    if (user.ImageId) {
      const transaction = await sequelize.transaction()

      const oldImage = await Image.findOne({
        where: {
          id: user.ImageId,
        },
      }, { transaction })

      await uploadService.deleteFile(oldImage.filename)

      await Image.destroy({
        where: {
          id: user.ImageId,
        },
      }, { transaction })

      const updateUserResult = await User.update(
        {
          ImageId: null,
        },
        {
          where: {
            id,
          },
          transaction,
          returning: true,
        },
      )

      const updatedUser = updateUserResult[1][0]

      const userToSend = {
        ...updatedUser.dataValues,
        image: null,
      }
  
      return userToSend
    }

    else {
      throw createError(USER_DOES_NOT_HAVE_AN_IMAGE)
    }
  },

  deleteUser: async (id) => {
    const user = await User.findOne({
      where: {
        id,
      },
    })

    if (!user) {
      throw createError(USER_NOT_FOUND)
    }

    const transaction = await sequelize.transaction()

    try {
      await Image.destroy({
        where: {
          id: user.ImageId,
        },
        transaction,
      })

      await User.destroy({
        where: {
          id,
        },
        transaction,
      })

      await transaction.commit()

      return null
    }

    catch(error) {
      await transaction.rollback()
      throw createError(INTERNAL_SERVER_ERROR)
    }
  },

}

module.exports = userService
