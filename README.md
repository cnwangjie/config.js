config.js
======
[![Build Status](https://travis-ci.org/cnwangjie/config.js.svg?branch=master)](https://travis-ci.org/cnwangjie/config.js)
[![Coverage Status](https://coveralls.io/repos/github/cnwangjie/config.js/badge.svg?branch=master)](https://coveralls.io/github/cnwangjie/config.js?branch=master)
![](https://img.shields.io/npm/v/@cnwangjie/conf.svg)
![](https://img.shields.io/npm/l/@cnwangjie/conf.svg)

Lightweight Node.js configuration with enough feature.

### Installation

```
yarn add @cnwangjie/conf
```

### Usage

```javascript
const conf = require('@cnwangjie/conf')

// load config file in bootstrap
conf().load('config.json')
// you can use absolute path or path relative with current path

// besides, you can load any type file of JS, YAML, TOML, ENV and you just need
// install corresponding module

// then you can get the config in every file by require config.js
conf('server.port')
conf().get('server.port')
conf.server.port
// you can use any type of style above

// even you can set separator you like by following way
conf().separator = ':'
conf('server:port')
```

You need to install corresponding module if you want to use other suffix config file.

|suffix|module|
|:-:|:-:|
|.yml|js-yaml|
|.yaml|js-yaml|
|.env|dotenv|
|.toml|toml|
