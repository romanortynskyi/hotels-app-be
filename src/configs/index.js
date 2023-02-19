const config = {
  DATABASE_NAME: process.env.DATABASE_NAME,
  DATABASE_USERNAME: process.env.DATABASE_USERNAME,
  DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
  DATABASE_HOST: process.env.DATABASE_HOST,
  DATABASE_DIALECT: process.env.DATABASE_DIALECT,
  
  PORT: process.env.PORT,

  JWT_SECRET: process.env.JWT_SECRET,
  BUCKET_URL: process.env.BUCKET_URL,
}

module.exports = config
