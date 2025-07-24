import {
  REDIS_HOST,
  REDIS_PASSWORD,
  REDIS_PORT,
  REDIS_TCP_HOST,
} from '../config/env'
import Redis from 'ioredis'

class RedisProvider {
  client = new Redis()
  constructor() {
    if (REDIS_TCP_HOST) {
      this.client = new Redis(REDIS_TCP_HOST)
    } else {
      this.client = new Redis({
        host: REDIS_HOST,
        port: REDIS_PORT,
        password: REDIS_PASSWORD,
      })
    }
  }

  async set(key, data) {
    const stringData = JSON.stringify(data)
    await this.client.set(key, stringData)
  }

  async setEx(key, data, expiration) {
    const stringData = JSON.stringify(data)
    await this.client.setex(key, expiration, stringData)
  }

  async get(key) {
    const data = await this.client.get(key)
    if (!data) {
      return null
    }
    const parseData = JSON.parse(data)
    return parseData
  }

  async del(key) {
    await this.client.del(key)
  }
}

export default RedisProvider
