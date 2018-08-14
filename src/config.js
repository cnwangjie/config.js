const fs = require('fs')
const path = require('path')

const __data = {}
let __separator = '.'

function Config(key, defaultValue) {
  if (!(this instanceof Config)) {
    const inst = new Config(key, defaultValue)
    if (key)
      return inst.get(key, defaultValue)
    else
      return proxyAttributions(inst)
  }

  Object.defineProperties(this, {
    separator: {
      get() {
        return __separator
      },
      set(value) {
        __separator = value
      }
    }
  })
}

Config.prototype.load = function load(toLoadFilePath, resolver) {
  const filePath = path.isAbsolute(toLoadFilePath) ? toLoadFilePath :
    path.join(path.dirname(module.parent.filename), toLoadFilePath)

  const configFileContent = fs.readFileSync(filePath).toString()
  let resolvedData
  if (typeof resolver === 'function') {
    resolvedData = resolver(configFileContent)
  } else {
    const type = path.extname(filePath)
    switch (type) {
    case '.json':
      resolvedData = JSON.parse(configFileContent)
      break
    case '.js':
      resolvedData = require(filePath)
      break
    case '.yaml':
    case '.yml':
      resolvedData = require('js-yaml').safeLoad(configFileContent)
      break
    case '.env':
      resolvedData = require('dotenv').parse(configFileContent)
      break
    case '.toml':
      resolvedData = require('toml').parse(configFileContent)
      break
    default:
      throw new Error(`unsupported format: ${type}, please set resolver manually if you insist to use it`)
    }
  }
  Object.assign(__data, resolvedData)
  return this
}

function splitKey(key) {
  if (typeof __separator === 'string')
    return key.split(__separator).filter(i => i)
  else
    throw new Error('separator must be string')
}

Config.prototype.get = function get(key, defaultValue) {
  const props = splitKey(key)
  let obj = __data
  while (props.length > 0) {
    const tmpKey = props.shift()
    if (obj.hasOwnProperty(tmpKey) && obj[tmpKey] !== undefined)
      obj = obj[tmpKey]
    else if (defaultValue !== undefined)
      return defaultValue
    else
      throw new Error(`${key} not set and no default value`)
  }

  return obj
}

Config.prototype.set = function set(key, value) {
  const props = splitKey(key)
  let obj = __data
  while (props.length > 1) {
    const tmpKey = props.shift()
    if (!obj.hasOwnProperty(tmpKey) || typeof obj[tmpKey] !== 'object')
      obj[tmpKey] = {}

    obj = obj[tmpKey]
  }
  obj[props.shift()] = value
}

Config.prototype.args = function args(opt = {}) {
  const args = opt.args
  const transform = ('transfrom' in opt) ? opt.transform : true
  let argsList = process.argv
  argsList = argsList.filter(i => /--[^=]+=[^ ]+/.test(i)).reduce((r, i) => {
    const re = i.match(/--([^=]+)+=([^ ]+)+/)
    r[re[1]] = re[2]
    return r
  }, {})
  for (let key in argsList) {
    let value = argsList[key]
    value = transform ? autoTypeTransform(value) : value
    if (!Array.isArray(args) || args.indexOf(key) !== -1) {
      this.set(key, value)

    }
  }
  return this
}

Config.prototype.env = function env(opt = {}) {
  const tolower = ('tolower' in opt) ? opt.tolower : true
  const split = ('split' in opt) ? opt.split : true
  const transform = ('transform' in opt) ? opt.transform : true
  for (let key in process.env) {
    let value = process.env[key]
    value = transform ? autoTypeTransform(value) : value
    key = tolower ? key.toLowerCase() : key
    key = split ? key.split('_').join(__separator) : key
    this.set(key, value)
  }
  return this
}

function autoTypeTransform(value) {
  if (value === 'true') return true
  if (value === 'false') return false
  if (!isNaN(Number(value))) return Number(value)
  if (value === 'NaN') return NaN
  if (value === 'null') return null
  return value
}

function proxyAttributions(obj) {
  return new Proxy(obj, {
    get(target, prop) {
      if (__data.hasOwnProperty(prop))
        return Reflect.get(__data, prop)
      else
        return Reflect.get(target, prop)
    },
  })
}

module.exports = proxyAttributions(Config)
