const assert = require('assert')
const config = require('../src/config.js')
const fs = require('fs')
/* eslint-env mocha */
const __config = {
  nt: 'normal text',
  number: 100,
  boolean: true,
  array: ['one', 2, false],
  deep: {
    in: {
      text: 'deep varible',
    }
  }
}

before(() => {
  fs.writeFileSync(__dirname + '/__config.json', JSON.stringify(__config, null, 4))

})

after(() => {
  fs.unlinkSync(__dirname + '/__config.json')
})

describe('config.js basic assert', () => {

  describe('Config', () => {
    it('is a construct function', () => {
      assert.equal(typeof new config, 'object')
    })
    it('return an instance when it be applied', () => {
      assert(config() instanceof config)
    })
  })

  describe('config', () => {
    it('have correct methods', () => {
      const inst = config()
      assert.equal(typeof inst.load, 'function')
      assert.equal(typeof inst.set, 'function')
      assert.equal(typeof inst.get, 'function')
      assert.equal(typeof inst.env, 'function')
    })

    describe('#load()', () => {
      it('load json file', () => {
        assert(config().load('__config.json'))
      })

      it('assign resolver', () => {
        assert(config().load('__config.json', JSON.parse))
      })
    })

    describe('#get()', () => {
      it('get config correctly', () => {
        assert.equal(config().get('nt'), __config.nt)
        assert.equal(config().get('number'), __config.number)
        assert.equal(config().get('boolean'), __config.boolean)
        assert.equal(config().get('deep.in.text'), __config.deep.in.text)
        assert.equal(config().get('array.0'), __config.array[0])
      })
      it('return the default value when get a unset config', () => {
        assert.equal(config().get('unset', 'default value'), 'default value')
      })
      it('throw error when get a unset config and not set default value', () => {
        assert.throws(() => {
          config().get('unset')
        })
      })
    })

    describe('config()', () => {
      it('equal config#get()', () => {
        assert.equal(config('nt'), config().get('nt'))
      })
    })

    describe('#set()', () => {
      it('set config correctly', () => {
        config().set('a', 'a')
        config().set('b.c', 'b.c')
        assert.equal(config('a'), 'a')
        assert.equal(typeof config('b'), 'object')
        assert.equal(config('b.c'), 'b.c')
      })
    })

    describe('#separator', () => {
      it('exists', () => {
        const inst = config()
        assert.equal(inst.separator, '.')
      })

      it('will be changed when module be required again after it be modified', () => {
        config().separator = ':'
        assert.equal(require('../src/config.js')().separator, ':')
        config().separator = '.'
      })
    })

    describe('getter', () => {
      it('return the inside data storage when attribution not exists', () => {
        assert.equal(config.nt, __config.nt)
        assert.equal(config().nt, __config.nt)
      })
    })

    describe('#args()', () => {
      it('set cli args to storage', () => {
        const oriArgs = [].slice.call(process.argv)
        process.argv = ['script', '--arg1=1234', 'notarg', '--arg2=abcd']
        config().args()
        assert.equal(config('arg1'), 1234)
        assert.equal(config('arg2'), 'abcd')
        process.argv = oriArgs
      })
    })

    describe('#env()', () => {
      before(() => {
        Object.assign(process.env, {
          VARIBLE1: 'value of varible 1',
          VARIBLE2: 'true',
          VARIBLE3: '123',
          VAR_IBLE: 'value',
        })
        config().env()
      })
      it('set enviroment varible to storage and auto transform type', () => {
        assert.equal(config('varible1'), 'value of varible 1')
        assert.equal(config('varible2'), true)
        assert.equal(config('varible3'), 123)
      })
      it('default status will make key to lower case and split', () => {
        assert.equal(config('var.ible'), 'value')
      })
    })

  })


})
