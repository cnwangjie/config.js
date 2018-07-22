config.js
======

Lightweight Node.js configuration with enough feature.

### Usage

```javascript
const config = require('config.js')

// load config file in bootstrap
config().load('config.json')
// you can use absolute path or path relative with current path

// besides, you can load any type file of JS, YAML, TOML, ENV and you just need
// install corresponding module

// then you can get the config in every file by require config.js
config('server.port')
config().get('server.port')
config.server.port
// you can use any type of style above

// even you can set separator you like by following way
config().separator = ':'
config('server:port')
```
