import dotenv from 'dotenv'

dotenv.config()

// node env
export const NODE_ENV = process.env.NODE_ENV ?? 'development'

// app
export const API_KEY = process.env.API_KEY
export const APP_NAME = process.env.APP_NAME ?? 'sibaruv3'
export const APP_PORT = Number(process.env.APP_PORT) ?? 8000
export const APP_ENV = process.env.APP_ENV ?? 'development'

// axios
export const AXIOS_TIMEOUT = process.env.AXIOS_TIMEOUT ?? '5m'

// jwt access
export const JWT_SECRET_ACCESS_TOKEN = process.env.JWT_SECRET_ACCESS_TOKEN
// jwt refresh
export const JWT_SECRET_REFRESH_TOKEN = process.env.JWT_SECRET_REFRESH_TOKEN

export const JWT_SECRET_BANPER_OTP = process.env.JWT_SECRET_BANPER_OTP

// url sandbox
export const BASE_URL = process.env.BASE_URL
export const BASE_URL_CLIENT = process.env.BASE_URL_CLIENT

// database
export const DB_CONNECTION = process.env.DB_CONNECTION ?? 'postgres'
export const DB_HOST = process.env.DB_HOST ?? '127.0.0.1'
export const DB_PORT = Number(process.env.DB_PORT) ?? 5432
export const DB_DATABASE = process.env.DB_DATABASE ?? 'your_database'
export const DB_USERNAME = process.env.DB_USERNAME ?? 'postgres'
export const DB_PASSWORD = process.env.DB_PASSWORD ?? 'postgres'
export const DB_OPERATOR_ALIAS = process.env.DB_OPERATOR_ALIAS ?? undefined
export const DB_TIMEZONE = process.env.DB_TIMEZONE ?? '+07:00' // for mysql = +07:00, for postgres = Asia/Jakarta

// smtp
export const MAIL_DRIVER = process.env.MAIL_DRIVER ?? 'smtp'
export const MAIL_HOST = process.env.MAIL_HOST ?? 'smtp.mailtrap.io'
export const MAIL_PORT = Number(process.env.MAIL_PORT) ?? 2525
export const MAIL_AUTH_TYPE = process.env.MAIL_AUTH_TYPE ?? undefined
export const MAIL_USERNAME = process.env.MAIL_USERNAME ?? undefined
export const MAIL_PASSWORD = process.env.MAIL_PASSWORD ?? undefined
export const MAIL_ENCRYPTION = process.env.MAIL_ENCRYPTION ?? undefined

// smtp mailgun
export const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY ?? undefined
export const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN ?? undefined

// internal api
export const API_MASTER = process.env.API_MASTER
export const API_PENGUSULAN = process.env.API_PENGUSULAN

export const REDIS_HOST = process.env.REDIS_HOST ?? '127.0.0.1'
export const REDIS_PORT = process.env.REDIS_PORT ?? '6379'
export const REDIS_PASSWORD = process.env.REDIS_PASSWORD ?? ''
export const REDIS_TCP_HOST = process.env.REDIS_TCP_HOST ?? undefined

export const S3_ACCESS_KEY = process.env.S3_ACCESS_KEY ?? undefined
export const S3_SECRET_KEY = process.env.S3_SECRET_KEY ?? undefined
export const S3_REGION = process.env.S3_REGION ?? undefined
export const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME ?? undefined
export const S3_ENDPOINT = process.env.S3_ENDPOINT ?? undefined
export const S3_DIRECT_URL = process.env.S3_DIRECT_URL ?? undefined

export const SMTP_HOST = process.env.SMTP_HOST
export const SMTP_PORT = process.env.SMTP_PORT
export const SMTP_SECURE = process.env.SMTP_SECURE
export const SMTP_USER = process.env.SMTP_USER
export const SMTP_PASS = process.env.SMTP_PASS

export const TMP_PATH = process.env.TMP_PATH ?? undefined
