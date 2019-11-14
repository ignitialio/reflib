#!/usr/bin/env node

const MongoClient = require('mongodb').MongoClient

const users = require('./lib/populate-mongo/populate_users.js').populate
const roles = require('./lib/populate-roles.js').populate

async function run() {
  try {
    console.log('will populate (IIOS_POPULATE_ALL= ' +
      process.env.IIOS_POPULATE_ALL + ') [reflib] db...')

    let url
    if (process.env.IIOS_MONGODB_USER &&
      process.env.IIOS_MONGODB_PASSWORD &&
      process.env.IIOS_MONGODB_OPTIONS &&
      process.env.IIOS_MONGODB_URI &&
      process.env.IIOS_DBNAME) {
      url = 'mongodb+srv://' + process.env.IIOS_MONGODB_USER + ':' +
        process.env.IIOS_MONGODB_PASSWORD + '@' + process.env.IIOS_MONGODB_URI + '/' +
        process.env.IIOS_DBNAME + '?' + process.env.IIOS_MONGODB_OPTIONS
    } else {
      url = (process.env.IIOS_MONGODB_URI || 'mongodb://127.0.0.1:40000') +
        '/' + (process.env.IIOS_DBNAME || 'reflib') +
        (process.env.IIOS_MONGODB_OPTIONS ? '?' + process.env.IIOS_MONGODB_OPTIONS : '')
    }

    let client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

    // console.log('connected to ' + url)

    let db = client.db()
    let userRoles
    if (process.env.IIOS_POPULATE_ALL) {
      console.log('will reset users...')
      userRoles = await users(db)
      console.log('users reset...')
    }

    await roles(userRoles)
    console.log('populate done.')
    client.close()
  } catch (err) {
    console.log('error connecting to db', err)
  }
}

if (require.main === module) {
  run()
}

module.exports = run
