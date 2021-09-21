var __commonJS = (cb, mod) =>
  function __require() {
    return mod || (0, cb[Object.keys(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

// node_modules/@actions/core/lib/utils.js
var require_utils = __commonJS({
  'node_modules/@actions/core/lib/utils.js'(exports2) {
    'use strict';
    Object.defineProperty(exports2, '__esModule', { value: true });
    exports2.toCommandProperties = exports2.toCommandValue = void 0;
    function toCommandValue(input) {
      if (input === null || input === void 0) {
        return '';
      } else if (typeof input === 'string' || input instanceof String) {
        return input;
      }
      return JSON.stringify(input);
    }
    exports2.toCommandValue = toCommandValue;
    function toCommandProperties(annotationProperties) {
      if (!Object.keys(annotationProperties).length) {
        return {};
      }
      return {
        title: annotationProperties.title,
        line: annotationProperties.startLine,
        endLine: annotationProperties.endLine,
        col: annotationProperties.startColumn,
        endColumn: annotationProperties.endColumn
      };
    }
    exports2.toCommandProperties = toCommandProperties;
  }
});

// node_modules/@actions/core/lib/command.js
var require_command = __commonJS({
  'node_modules/@actions/core/lib/command.js'(exports2) {
    'use strict';
    var __createBinding =
      (exports2 && exports2.__createBinding) ||
      (Object.create
        ? function (o, m, k, k2) {
            if (k2 === void 0) k2 = k;
            Object.defineProperty(o, k2, {
              enumerable: true,
              get: function () {
                return m[k];
              }
            });
          }
        : function (o, m, k, k2) {
            if (k2 === void 0) k2 = k;
            o[k2] = m[k];
          });
    var __setModuleDefault =
      (exports2 && exports2.__setModuleDefault) ||
      (Object.create
        ? function (o, v) {
            Object.defineProperty(o, 'default', { enumerable: true, value: v });
          }
        : function (o, v) {
            o['default'] = v;
          });
    var __importStar =
      (exports2 && exports2.__importStar) ||
      function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) {
          for (var k in mod)
            if (k !== 'default' && Object.hasOwnProperty.call(mod, k))
              __createBinding(result, mod, k);
        }
        __setModuleDefault(result, mod);
        return result;
      };
    Object.defineProperty(exports2, '__esModule', { value: true });
    exports2.issue = exports2.issueCommand = void 0;
    var os = __importStar(require('os'));
    var utils_1 = require_utils();
    function issueCommand(command, properties, message) {
      const cmd = new Command(command, properties, message);
      process.stdout.write(cmd.toString() + os.EOL);
    }
    exports2.issueCommand = issueCommand;
    function issue(name, message = '') {
      issueCommand(name, {}, message);
    }
    exports2.issue = issue;
    var CMD_STRING = '::';
    var Command = class {
      constructor(command, properties, message) {
        if (!command) {
          command = 'missing.command';
        }
        this.command = command;
        this.properties = properties;
        this.message = message;
      }
      toString() {
        let cmdStr = CMD_STRING + this.command;
        if (this.properties && Object.keys(this.properties).length > 0) {
          cmdStr += ' ';
          let first = true;
          for (const key in this.properties) {
            if (this.properties.hasOwnProperty(key)) {
              const val = this.properties[key];
              if (val) {
                if (first) {
                  first = false;
                } else {
                  cmdStr += ',';
                }
                cmdStr += `${key}=${escapeProperty(val)}`;
              }
            }
          }
        }
        cmdStr += `${CMD_STRING}${escapeData(this.message)}`;
        return cmdStr;
      }
    };
    function escapeData(s) {
      return utils_1
        .toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A');
    }
    function escapeProperty(s) {
      return utils_1
        .toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A')
        .replace(/:/g, '%3A')
        .replace(/,/g, '%2C');
    }
  }
});

// node_modules/@actions/core/lib/file-command.js
var require_file_command = __commonJS({
  'node_modules/@actions/core/lib/file-command.js'(exports2) {
    'use strict';
    var __createBinding =
      (exports2 && exports2.__createBinding) ||
      (Object.create
        ? function (o, m, k, k2) {
            if (k2 === void 0) k2 = k;
            Object.defineProperty(o, k2, {
              enumerable: true,
              get: function () {
                return m[k];
              }
            });
          }
        : function (o, m, k, k2) {
            if (k2 === void 0) k2 = k;
            o[k2] = m[k];
          });
    var __setModuleDefault =
      (exports2 && exports2.__setModuleDefault) ||
      (Object.create
        ? function (o, v) {
            Object.defineProperty(o, 'default', { enumerable: true, value: v });
          }
        : function (o, v) {
            o['default'] = v;
          });
    var __importStar =
      (exports2 && exports2.__importStar) ||
      function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) {
          for (var k in mod)
            if (k !== 'default' && Object.hasOwnProperty.call(mod, k))
              __createBinding(result, mod, k);
        }
        __setModuleDefault(result, mod);
        return result;
      };
    Object.defineProperty(exports2, '__esModule', { value: true });
    exports2.issueCommand = void 0;
    var fs = __importStar(require('fs'));
    var os = __importStar(require('os'));
    var utils_1 = require_utils();
    function issueCommand(command, message) {
      const filePath = process.env[`GITHUB_${command}`];
      if (!filePath) {
        throw new Error(`Unable to find environment variable for file command ${command}`);
      }
      if (!fs.existsSync(filePath)) {
        throw new Error(`Missing file at path: ${filePath}`);
      }
      fs.appendFileSync(filePath, `${utils_1.toCommandValue(message)}${os.EOL}`, {
        encoding: 'utf8'
      });
    }
    exports2.issueCommand = issueCommand;
  }
});

// node_modules/@actions/core/lib/core.js
var require_core = __commonJS({
  'node_modules/@actions/core/lib/core.js'(exports2) {
    'use strict';
    var __createBinding =
      (exports2 && exports2.__createBinding) ||
      (Object.create
        ? function (o, m, k, k2) {
            if (k2 === void 0) k2 = k;
            Object.defineProperty(o, k2, {
              enumerable: true,
              get: function () {
                return m[k];
              }
            });
          }
        : function (o, m, k, k2) {
            if (k2 === void 0) k2 = k;
            o[k2] = m[k];
          });
    var __setModuleDefault =
      (exports2 && exports2.__setModuleDefault) ||
      (Object.create
        ? function (o, v) {
            Object.defineProperty(o, 'default', { enumerable: true, value: v });
          }
        : function (o, v) {
            o['default'] = v;
          });
    var __importStar =
      (exports2 && exports2.__importStar) ||
      function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) {
          for (var k in mod)
            if (k !== 'default' && Object.hasOwnProperty.call(mod, k))
              __createBinding(result, mod, k);
        }
        __setModuleDefault(result, mod);
        return result;
      };
    var __awaiter =
      (exports2 && exports2.__awaiter) ||
      function (thisArg, _arguments, P, generator) {
        function adopt(value) {
          return value instanceof P
            ? value
            : new P(function (resolve) {
                resolve(value);
              });
        }
        return new (P || (P = Promise))(function (resolve, reject) {
          function fulfilled(value) {
            try {
              step(generator.next(value));
            } catch (e) {
              reject(e);
            }
          }
          function rejected(value) {
            try {
              step(generator['throw'](value));
            } catch (e) {
              reject(e);
            }
          }
          function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
          }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
      };
    Object.defineProperty(exports2, '__esModule', { value: true });
    exports2.getState =
      exports2.saveState =
      exports2.group =
      exports2.endGroup =
      exports2.startGroup =
      exports2.info =
      exports2.notice =
      exports2.warning =
      exports2.error =
      exports2.debug =
      exports2.isDebug =
      exports2.setFailed =
      exports2.setCommandEcho =
      exports2.setOutput =
      exports2.getBooleanInput =
      exports2.getMultilineInput =
      exports2.getInput =
      exports2.addPath =
      exports2.setSecret =
      exports2.exportVariable =
      exports2.ExitCode =
        void 0;
    var command_1 = require_command();
    var file_command_1 = require_file_command();
    var utils_1 = require_utils();
    var os = __importStar(require('os'));
    var path = __importStar(require('path'));
    var ExitCode;
    (function (ExitCode2) {
      ExitCode2[(ExitCode2['Success'] = 0)] = 'Success';
      ExitCode2[(ExitCode2['Failure'] = 1)] = 'Failure';
    })((ExitCode = exports2.ExitCode || (exports2.ExitCode = {})));
    function exportVariable(name, val) {
      const convertedVal = utils_1.toCommandValue(val);
      process.env[name] = convertedVal;
      const filePath = process.env['GITHUB_ENV'] || '';
      if (filePath) {
        const delimiter = '_GitHubActionsFileCommandDelimeter_';
        const commandValue = `${name}<<${delimiter}${os.EOL}${convertedVal}${os.EOL}${delimiter}`;
        file_command_1.issueCommand('ENV', commandValue);
      } else {
        command_1.issueCommand('set-env', { name }, convertedVal);
      }
    }
    exports2.exportVariable = exportVariable;
    function setSecret(secret) {
      command_1.issueCommand('add-mask', {}, secret);
    }
    exports2.setSecret = setSecret;
    function addPath(inputPath) {
      const filePath = process.env['GITHUB_PATH'] || '';
      if (filePath) {
        file_command_1.issueCommand('PATH', inputPath);
      } else {
        command_1.issueCommand('add-path', {}, inputPath);
      }
      process.env['PATH'] = `${inputPath}${path.delimiter}${process.env['PATH']}`;
    }
    exports2.addPath = addPath;
    function getInput(name, options) {
      const val = process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '';
      if (options && options.required && !val) {
        throw new Error(`Input required and not supplied: ${name}`);
      }
      if (options && options.trimWhitespace === false) {
        return val;
      }
      return val.trim();
    }
    exports2.getInput = getInput;
    function getMultilineInput(name, options) {
      const inputs = getInput(name, options)
        .split('\n')
        .filter(x => x !== '');
      return inputs;
    }
    exports2.getMultilineInput = getMultilineInput;
    function getBooleanInput(name, options) {
      const trueValue = ['true', 'True', 'TRUE'];
      const falseValue = ['false', 'False', 'FALSE'];
      const val = getInput(name, options);
      if (trueValue.includes(val)) return true;
      if (falseValue.includes(val)) return false;
      throw new TypeError(`Input does not meet YAML 1.2 "Core Schema" specification: ${name}
Support boolean input list: \`true | True | TRUE | false | False | FALSE\``);
    }
    exports2.getBooleanInput = getBooleanInput;
    function setOutput(name, value) {
      process.stdout.write(os.EOL);
      command_1.issueCommand('set-output', { name }, value);
    }
    exports2.setOutput = setOutput;
    function setCommandEcho(enabled) {
      command_1.issue('echo', enabled ? 'on' : 'off');
    }
    exports2.setCommandEcho = setCommandEcho;
    function setFailed(message) {
      process.exitCode = ExitCode.Failure;
      error(message);
    }
    exports2.setFailed = setFailed;
    function isDebug() {
      return process.env['RUNNER_DEBUG'] === '1';
    }
    exports2.isDebug = isDebug;
    function debug(message) {
      command_1.issueCommand('debug', {}, message);
    }
    exports2.debug = debug;
    function error(message, properties = {}) {
      command_1.issueCommand(
        'error',
        utils_1.toCommandProperties(properties),
        message instanceof Error ? message.toString() : message
      );
    }
    exports2.error = error;
    function warning(message, properties = {}) {
      command_1.issueCommand(
        'warning',
        utils_1.toCommandProperties(properties),
        message instanceof Error ? message.toString() : message
      );
    }
    exports2.warning = warning;
    function notice(message, properties = {}) {
      command_1.issueCommand(
        'notice',
        utils_1.toCommandProperties(properties),
        message instanceof Error ? message.toString() : message
      );
    }
    exports2.notice = notice;
    function info(message) {
      process.stdout.write(message + os.EOL);
    }
    exports2.info = info;
    function startGroup(name) {
      command_1.issue('group', name);
    }
    exports2.startGroup = startGroup;
    function endGroup() {
      command_1.issue('endgroup');
    }
    exports2.endGroup = endGroup;
    function group(name, fn) {
      return __awaiter(this, void 0, void 0, function* () {
        startGroup(name);
        let result;
        try {
          result = yield fn();
        } finally {
          endGroup();
        }
        return result;
      });
    }
    exports2.group = group;
    function saveState(name, value) {
      command_1.issueCommand('save-state', { name }, value);
    }
    exports2.saveState = saveState;
    function getState(name) {
      return process.env[`STATE_${name}`] || '';
    }
    exports2.getState = getState;
  }
});

// node_modules/@actions/github/lib/context.js
var require_context = __commonJS({
  'node_modules/@actions/github/lib/context.js'(exports2) {
    'use strict';
    Object.defineProperty(exports2, '__esModule', { value: true });
    exports2.Context = void 0;
    var fs_1 = require('fs');
    var os_1 = require('os');
    var Context = class {
      constructor() {
        var _a, _b, _c;
        this.payload = {};
        if (process.env.GITHUB_EVENT_PATH) {
          if (fs_1.existsSync(process.env.GITHUB_EVENT_PATH)) {
            this.payload = JSON.parse(
              fs_1.readFileSync(process.env.GITHUB_EVENT_PATH, { encoding: 'utf8' })
            );
          } else {
            const path = process.env.GITHUB_EVENT_PATH;
            process.stdout.write(`GITHUB_EVENT_PATH ${path} does not exist${os_1.EOL}`);
          }
        }
        this.eventName = process.env.GITHUB_EVENT_NAME;
        this.sha = process.env.GITHUB_SHA;
        this.ref = process.env.GITHUB_REF;
        this.workflow = process.env.GITHUB_WORKFLOW;
        this.action = process.env.GITHUB_ACTION;
        this.actor = process.env.GITHUB_ACTOR;
        this.job = process.env.GITHUB_JOB;
        this.runNumber = parseInt(process.env.GITHUB_RUN_NUMBER, 10);
        this.runId = parseInt(process.env.GITHUB_RUN_ID, 10);
        this.apiUrl =
          (_a = process.env.GITHUB_API_URL) !== null && _a !== void 0
            ? _a
            : `https://api.github.com`;
        this.serverUrl =
          (_b = process.env.GITHUB_SERVER_URL) !== null && _b !== void 0
            ? _b
            : `https://github.com`;
        this.graphqlUrl =
          (_c = process.env.GITHUB_GRAPHQL_URL) !== null && _c !== void 0
            ? _c
            : `https://api.github.com/graphql`;
      }
      get issue() {
        const payload = this.payload;
        return Object.assign(Object.assign({}, this.repo), {
          number: (payload.issue || payload.pull_request || payload).number
        });
      }
      get repo() {
        if (process.env.GITHUB_REPOSITORY) {
          const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/');
          return { owner, repo };
        }
        if (this.payload.repository) {
          return {
            owner: this.payload.repository.owner.login,
            repo: this.payload.repository.name
          };
        }
        throw new Error(
          "context.repo requires a GITHUB_REPOSITORY environment variable like 'owner/repo'"
        );
      }
    };
    exports2.Context = Context;
  }
});

// node_modules/@actions/http-client/proxy.js
var require_proxy = __commonJS({
  'node_modules/@actions/http-client/proxy.js'(exports2) {
    'use strict';
    Object.defineProperty(exports2, '__esModule', { value: true });
    function getProxyUrl(reqUrl) {
      let usingSsl = reqUrl.protocol === 'https:';
      let proxyUrl;
      if (checkBypass(reqUrl)) {
        return proxyUrl;
      }
      let proxyVar;
      if (usingSsl) {
        proxyVar = process.env['https_proxy'] || process.env['HTTPS_PROXY'];
      } else {
        proxyVar = process.env['http_proxy'] || process.env['HTTP_PROXY'];
      }
      if (proxyVar) {
        proxyUrl = new URL(proxyVar);
      }
      return proxyUrl;
    }
    exports2.getProxyUrl = getProxyUrl;
    function checkBypass(reqUrl) {
      if (!reqUrl.hostname) {
        return false;
      }
      let noProxy = process.env['no_proxy'] || process.env['NO_PROXY'] || '';
      if (!noProxy) {
        return false;
      }
      let reqPort;
      if (reqUrl.port) {
        reqPort = Number(reqUrl.port);
      } else if (reqUrl.protocol === 'http:') {
        reqPort = 80;
      } else if (reqUrl.protocol === 'https:') {
        reqPort = 443;
      }
      let upperReqHosts = [reqUrl.hostname.toUpperCase()];
      if (typeof reqPort === 'number') {
        upperReqHosts.push(`${upperReqHosts[0]}:${reqPort}`);
      }
      for (let upperNoProxyItem of noProxy
        .split(',')
        .map(x => x.trim().toUpperCase())
        .filter(x => x)) {
        if (upperReqHosts.some(x => x === upperNoProxyItem)) {
          return true;
        }
      }
      return false;
    }
    exports2.checkBypass = checkBypass;
  }
});

// node_modules/tunnel/lib/tunnel.js
var require_tunnel = __commonJS({
  'node_modules/tunnel/lib/tunnel.js'(exports2) {
    'use strict';
    var net = require('net');
    var tls = require('tls');
    var http = require('http');
    var https = require('https');
    var events = require('events');
    var assert = require('assert');
    var util = require('util');
    exports2.httpOverHttp = httpOverHttp;
    exports2.httpsOverHttp = httpsOverHttp;
    exports2.httpOverHttps = httpOverHttps;
    exports2.httpsOverHttps = httpsOverHttps;
    function httpOverHttp(options) {
      var agent = new TunnelingAgent(options);
      agent.request = http.request;
      return agent;
    }
    function httpsOverHttp(options) {
      var agent = new TunnelingAgent(options);
      agent.request = http.request;
      agent.createSocket = createSecureSocket;
      agent.defaultPort = 443;
      return agent;
    }
    function httpOverHttps(options) {
      var agent = new TunnelingAgent(options);
      agent.request = https.request;
      return agent;
    }
    function httpsOverHttps(options) {
      var agent = new TunnelingAgent(options);
      agent.request = https.request;
      agent.createSocket = createSecureSocket;
      agent.defaultPort = 443;
      return agent;
    }
    function TunnelingAgent(options) {
      var self = this;
      self.options = options || {};
      self.proxyOptions = self.options.proxy || {};
      self.maxSockets = self.options.maxSockets || http.Agent.defaultMaxSockets;
      self.requests = [];
      self.sockets = [];
      self.on('free', function onFree(socket, host, port, localAddress) {
        var options2 = toOptions(host, port, localAddress);
        for (var i = 0, len = self.requests.length; i < len; ++i) {
          var pending = self.requests[i];
          if (pending.host === options2.host && pending.port === options2.port) {
            self.requests.splice(i, 1);
            pending.request.onSocket(socket);
            return;
          }
        }
        socket.destroy();
        self.removeSocket(socket);
      });
    }
    util.inherits(TunnelingAgent, events.EventEmitter);
    TunnelingAgent.prototype.addRequest = function addRequest(req, host, port, localAddress) {
      var self = this;
      var options = mergeOptions(
        { request: req },
        self.options,
        toOptions(host, port, localAddress)
      );
      if (self.sockets.length >= this.maxSockets) {
        self.requests.push(options);
        return;
      }
      self.createSocket(options, function (socket) {
        socket.on('free', onFree);
        socket.on('close', onCloseOrRemove);
        socket.on('agentRemove', onCloseOrRemove);
        req.onSocket(socket);
        function onFree() {
          self.emit('free', socket, options);
        }
        function onCloseOrRemove(err) {
          self.removeSocket(socket);
          socket.removeListener('free', onFree);
          socket.removeListener('close', onCloseOrRemove);
          socket.removeListener('agentRemove', onCloseOrRemove);
        }
      });
    };
    TunnelingAgent.prototype.createSocket = function createSocket(options, cb) {
      var self = this;
      var placeholder = {};
      self.sockets.push(placeholder);
      var connectOptions = mergeOptions({}, self.proxyOptions, {
        method: 'CONNECT',
        path: options.host + ':' + options.port,
        agent: false,
        headers: {
          host: options.host + ':' + options.port
        }
      });
      if (options.localAddress) {
        connectOptions.localAddress = options.localAddress;
      }
      if (connectOptions.proxyAuth) {
        connectOptions.headers = connectOptions.headers || {};
        connectOptions.headers['Proxy-Authorization'] =
          'Basic ' + new Buffer(connectOptions.proxyAuth).toString('base64');
      }
      debug('making CONNECT request');
      var connectReq = self.request(connectOptions);
      connectReq.useChunkedEncodingByDefault = false;
      connectReq.once('response', onResponse);
      connectReq.once('upgrade', onUpgrade);
      connectReq.once('connect', onConnect);
      connectReq.once('error', onError);
      connectReq.end();
      function onResponse(res) {
        res.upgrade = true;
      }
      function onUpgrade(res, socket, head) {
        process.nextTick(function () {
          onConnect(res, socket, head);
        });
      }
      function onConnect(res, socket, head) {
        connectReq.removeAllListeners();
        socket.removeAllListeners();
        if (res.statusCode !== 200) {
          debug('tunneling socket could not be established, statusCode=%d', res.statusCode);
          socket.destroy();
          var error = new Error(
            'tunneling socket could not be established, statusCode=' + res.statusCode
          );
          error.code = 'ECONNRESET';
          options.request.emit('error', error);
          self.removeSocket(placeholder);
          return;
        }
        if (head.length > 0) {
          debug('got illegal response body from proxy');
          socket.destroy();
          var error = new Error('got illegal response body from proxy');
          error.code = 'ECONNRESET';
          options.request.emit('error', error);
          self.removeSocket(placeholder);
          return;
        }
        debug('tunneling connection has established');
        self.sockets[self.sockets.indexOf(placeholder)] = socket;
        return cb(socket);
      }
      function onError(cause) {
        connectReq.removeAllListeners();
        debug('tunneling socket could not be established, cause=%s\n', cause.message, cause.stack);
        var error = new Error('tunneling socket could not be established, cause=' + cause.message);
        error.code = 'ECONNRESET';
        options.request.emit('error', error);
        self.removeSocket(placeholder);
      }
    };
    TunnelingAgent.prototype.removeSocket = function removeSocket(socket) {
      var pos = this.sockets.indexOf(socket);
      if (pos === -1) {
        return;
      }
      this.sockets.splice(pos, 1);
      var pending = this.requests.shift();
      if (pending) {
        this.createSocket(pending, function (socket2) {
          pending.request.onSocket(socket2);
        });
      }
    };
    function createSecureSocket(options, cb) {
      var self = this;
      TunnelingAgent.prototype.createSocket.call(self, options, function (socket) {
        var hostHeader = options.request.getHeader('host');
        var tlsOptions = mergeOptions({}, self.options, {
          socket,
          servername: hostHeader ? hostHeader.replace(/:.*$/, '') : options.host
        });
        var secureSocket = tls.connect(0, tlsOptions);
        self.sockets[self.sockets.indexOf(socket)] = secureSocket;
        cb(secureSocket);
      });
    }
    function toOptions(host, port, localAddress) {
      if (typeof host === 'string') {
        return {
          host,
          port,
          localAddress
        };
      }
      return host;
    }
    function mergeOptions(target) {
      for (var i = 1, len = arguments.length; i < len; ++i) {
        var overrides = arguments[i];
        if (typeof overrides === 'object') {
          var keys = Object.keys(overrides);
          for (var j = 0, keyLen = keys.length; j < keyLen; ++j) {
            var k = keys[j];
            if (overrides[k] !== void 0) {
              target[k] = overrides[k];
            }
          }
        }
      }
      return target;
    }
    var debug;
    if (process.env.NODE_DEBUG && /\btunnel\b/.test(process.env.NODE_DEBUG)) {
      debug = function () {
        var args = Array.prototype.slice.call(arguments);
        if (typeof args[0] === 'string') {
          args[0] = 'TUNNEL: ' + args[0];
        } else {
          args.unshift('TUNNEL:');
        }
        console.error.apply(console, args);
      };
    } else {
      debug = function () {};
    }
    exports2.debug = debug;
  }
});

// node_modules/tunnel/index.js
var require_tunnel2 = __commonJS({
  'node_modules/tunnel/index.js'(exports2, module2) {
    module2.exports = require_tunnel();
  }
});

// node_modules/@actions/http-client/index.js
var require_http_client = __commonJS({
  'node_modules/@actions/http-client/index.js'(exports2) {
    'use strict';
    Object.defineProperty(exports2, '__esModule', { value: true });
    var http = require('http');
    var https = require('https');
    var pm = require_proxy();
    var tunnel;
    var HttpCodes;
    (function (HttpCodes2) {
      HttpCodes2[(HttpCodes2['OK'] = 200)] = 'OK';
      HttpCodes2[(HttpCodes2['MultipleChoices'] = 300)] = 'MultipleChoices';
      HttpCodes2[(HttpCodes2['MovedPermanently'] = 301)] = 'MovedPermanently';
      HttpCodes2[(HttpCodes2['ResourceMoved'] = 302)] = 'ResourceMoved';
      HttpCodes2[(HttpCodes2['SeeOther'] = 303)] = 'SeeOther';
      HttpCodes2[(HttpCodes2['NotModified'] = 304)] = 'NotModified';
      HttpCodes2[(HttpCodes2['UseProxy'] = 305)] = 'UseProxy';
      HttpCodes2[(HttpCodes2['SwitchProxy'] = 306)] = 'SwitchProxy';
      HttpCodes2[(HttpCodes2['TemporaryRedirect'] = 307)] = 'TemporaryRedirect';
      HttpCodes2[(HttpCodes2['PermanentRedirect'] = 308)] = 'PermanentRedirect';
      HttpCodes2[(HttpCodes2['BadRequest'] = 400)] = 'BadRequest';
      HttpCodes2[(HttpCodes2['Unauthorized'] = 401)] = 'Unauthorized';
      HttpCodes2[(HttpCodes2['PaymentRequired'] = 402)] = 'PaymentRequired';
      HttpCodes2[(HttpCodes2['Forbidden'] = 403)] = 'Forbidden';
      HttpCodes2[(HttpCodes2['NotFound'] = 404)] = 'NotFound';
      HttpCodes2[(HttpCodes2['MethodNotAllowed'] = 405)] = 'MethodNotAllowed';
      HttpCodes2[(HttpCodes2['NotAcceptable'] = 406)] = 'NotAcceptable';
      HttpCodes2[(HttpCodes2['ProxyAuthenticationRequired'] = 407)] = 'ProxyAuthenticationRequired';
      HttpCodes2[(HttpCodes2['RequestTimeout'] = 408)] = 'RequestTimeout';
      HttpCodes2[(HttpCodes2['Conflict'] = 409)] = 'Conflict';
      HttpCodes2[(HttpCodes2['Gone'] = 410)] = 'Gone';
      HttpCodes2[(HttpCodes2['TooManyRequests'] = 429)] = 'TooManyRequests';
      HttpCodes2[(HttpCodes2['InternalServerError'] = 500)] = 'InternalServerError';
      HttpCodes2[(HttpCodes2['NotImplemented'] = 501)] = 'NotImplemented';
      HttpCodes2[(HttpCodes2['BadGateway'] = 502)] = 'BadGateway';
      HttpCodes2[(HttpCodes2['ServiceUnavailable'] = 503)] = 'ServiceUnavailable';
      HttpCodes2[(HttpCodes2['GatewayTimeout'] = 504)] = 'GatewayTimeout';
    })((HttpCodes = exports2.HttpCodes || (exports2.HttpCodes = {})));
    var Headers;
    (function (Headers2) {
      Headers2['Accept'] = 'accept';
      Headers2['ContentType'] = 'content-type';
    })((Headers = exports2.Headers || (exports2.Headers = {})));
    var MediaTypes;
    (function (MediaTypes2) {
      MediaTypes2['ApplicationJson'] = 'application/json';
    })((MediaTypes = exports2.MediaTypes || (exports2.MediaTypes = {})));
    function getProxyUrl(serverUrl) {
      let proxyUrl = pm.getProxyUrl(new URL(serverUrl));
      return proxyUrl ? proxyUrl.href : '';
    }
    exports2.getProxyUrl = getProxyUrl;
    var HttpRedirectCodes = [
      HttpCodes.MovedPermanently,
      HttpCodes.ResourceMoved,
      HttpCodes.SeeOther,
      HttpCodes.TemporaryRedirect,
      HttpCodes.PermanentRedirect
    ];
    var HttpResponseRetryCodes = [
      HttpCodes.BadGateway,
      HttpCodes.ServiceUnavailable,
      HttpCodes.GatewayTimeout
    ];
    var RetryableHttpVerbs = ['OPTIONS', 'GET', 'DELETE', 'HEAD'];
    var ExponentialBackoffCeiling = 10;
    var ExponentialBackoffTimeSlice = 5;
    var HttpClientError = class extends Error {
      constructor(message, statusCode) {
        super(message);
        this.name = 'HttpClientError';
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, HttpClientError.prototype);
      }
    };
    exports2.HttpClientError = HttpClientError;
    var HttpClientResponse = class {
      constructor(message) {
        this.message = message;
      }
      readBody() {
        return new Promise(async (resolve, reject) => {
          let output = Buffer.alloc(0);
          this.message.on('data', chunk => {
            output = Buffer.concat([output, chunk]);
          });
          this.message.on('end', () => {
            resolve(output.toString());
          });
        });
      }
    };
    exports2.HttpClientResponse = HttpClientResponse;
    function isHttps(requestUrl) {
      let parsedUrl = new URL(requestUrl);
      return parsedUrl.protocol === 'https:';
    }
    exports2.isHttps = isHttps;
    var HttpClient = class {
      constructor(userAgent, handlers, requestOptions) {
        this._ignoreSslError = false;
        this._allowRedirects = true;
        this._allowRedirectDowngrade = false;
        this._maxRedirects = 50;
        this._allowRetries = false;
        this._maxRetries = 1;
        this._keepAlive = false;
        this._disposed = false;
        this.userAgent = userAgent;
        this.handlers = handlers || [];
        this.requestOptions = requestOptions;
        if (requestOptions) {
          if (requestOptions.ignoreSslError != null) {
            this._ignoreSslError = requestOptions.ignoreSslError;
          }
          this._socketTimeout = requestOptions.socketTimeout;
          if (requestOptions.allowRedirects != null) {
            this._allowRedirects = requestOptions.allowRedirects;
          }
          if (requestOptions.allowRedirectDowngrade != null) {
            this._allowRedirectDowngrade = requestOptions.allowRedirectDowngrade;
          }
          if (requestOptions.maxRedirects != null) {
            this._maxRedirects = Math.max(requestOptions.maxRedirects, 0);
          }
          if (requestOptions.keepAlive != null) {
            this._keepAlive = requestOptions.keepAlive;
          }
          if (requestOptions.allowRetries != null) {
            this._allowRetries = requestOptions.allowRetries;
          }
          if (requestOptions.maxRetries != null) {
            this._maxRetries = requestOptions.maxRetries;
          }
        }
      }
      options(requestUrl, additionalHeaders) {
        return this.request('OPTIONS', requestUrl, null, additionalHeaders || {});
      }
      get(requestUrl, additionalHeaders) {
        return this.request('GET', requestUrl, null, additionalHeaders || {});
      }
      del(requestUrl, additionalHeaders) {
        return this.request('DELETE', requestUrl, null, additionalHeaders || {});
      }
      post(requestUrl, data, additionalHeaders) {
        return this.request('POST', requestUrl, data, additionalHeaders || {});
      }
      patch(requestUrl, data, additionalHeaders) {
        return this.request('PATCH', requestUrl, data, additionalHeaders || {});
      }
      put(requestUrl, data, additionalHeaders) {
        return this.request('PUT', requestUrl, data, additionalHeaders || {});
      }
      head(requestUrl, additionalHeaders) {
        return this.request('HEAD', requestUrl, null, additionalHeaders || {});
      }
      sendStream(verb, requestUrl, stream, additionalHeaders) {
        return this.request(verb, requestUrl, stream, additionalHeaders);
      }
      async getJson(requestUrl, additionalHeaders = {}) {
        additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(
          additionalHeaders,
          Headers.Accept,
          MediaTypes.ApplicationJson
        );
        let res = await this.get(requestUrl, additionalHeaders);
        return this._processResponse(res, this.requestOptions);
      }
      async postJson(requestUrl, obj, additionalHeaders = {}) {
        let data = JSON.stringify(obj, null, 2);
        additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(
          additionalHeaders,
          Headers.Accept,
          MediaTypes.ApplicationJson
        );
        additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(
          additionalHeaders,
          Headers.ContentType,
          MediaTypes.ApplicationJson
        );
        let res = await this.post(requestUrl, data, additionalHeaders);
        return this._processResponse(res, this.requestOptions);
      }
      async putJson(requestUrl, obj, additionalHeaders = {}) {
        let data = JSON.stringify(obj, null, 2);
        additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(
          additionalHeaders,
          Headers.Accept,
          MediaTypes.ApplicationJson
        );
        additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(
          additionalHeaders,
          Headers.ContentType,
          MediaTypes.ApplicationJson
        );
        let res = await this.put(requestUrl, data, additionalHeaders);
        return this._processResponse(res, this.requestOptions);
      }
      async patchJson(requestUrl, obj, additionalHeaders = {}) {
        let data = JSON.stringify(obj, null, 2);
        additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(
          additionalHeaders,
          Headers.Accept,
          MediaTypes.ApplicationJson
        );
        additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(
          additionalHeaders,
          Headers.ContentType,
          MediaTypes.ApplicationJson
        );
        let res = await this.patch(requestUrl, data, additionalHeaders);
        return this._processResponse(res, this.requestOptions);
      }
      async request(verb, requestUrl, data, headers) {
        if (this._disposed) {
          throw new Error('Client has already been disposed.');
        }
        let parsedUrl = new URL(requestUrl);
        let info = this._prepareRequest(verb, parsedUrl, headers);
        let maxTries =
          this._allowRetries && RetryableHttpVerbs.indexOf(verb) != -1 ? this._maxRetries + 1 : 1;
        let numTries = 0;
        let response;
        while (numTries < maxTries) {
          response = await this.requestRaw(info, data);
          if (
            response &&
            response.message &&
            response.message.statusCode === HttpCodes.Unauthorized
          ) {
            let authenticationHandler;
            for (let i = 0; i < this.handlers.length; i++) {
              if (this.handlers[i].canHandleAuthentication(response)) {
                authenticationHandler = this.handlers[i];
                break;
              }
            }
            if (authenticationHandler) {
              return authenticationHandler.handleAuthentication(this, info, data);
            } else {
              return response;
            }
          }
          let redirectsRemaining = this._maxRedirects;
          while (
            HttpRedirectCodes.indexOf(response.message.statusCode) != -1 &&
            this._allowRedirects &&
            redirectsRemaining > 0
          ) {
            const redirectUrl = response.message.headers['location'];
            if (!redirectUrl) {
              break;
            }
            let parsedRedirectUrl = new URL(redirectUrl);
            if (
              parsedUrl.protocol == 'https:' &&
              parsedUrl.protocol != parsedRedirectUrl.protocol &&
              !this._allowRedirectDowngrade
            ) {
              throw new Error(
                'Redirect from HTTPS to HTTP protocol. This downgrade is not allowed for security reasons. If you want to allow this behavior, set the allowRedirectDowngrade option to true.'
              );
            }
            await response.readBody();
            if (parsedRedirectUrl.hostname !== parsedUrl.hostname) {
              for (let header in headers) {
                if (header.toLowerCase() === 'authorization') {
                  delete headers[header];
                }
              }
            }
            info = this._prepareRequest(verb, parsedRedirectUrl, headers);
            response = await this.requestRaw(info, data);
            redirectsRemaining--;
          }
          if (HttpResponseRetryCodes.indexOf(response.message.statusCode) == -1) {
            return response;
          }
          numTries += 1;
          if (numTries < maxTries) {
            await response.readBody();
            await this._performExponentialBackoff(numTries);
          }
        }
        return response;
      }
      dispose() {
        if (this._agent) {
          this._agent.destroy();
        }
        this._disposed = true;
      }
      requestRaw(info, data) {
        return new Promise((resolve, reject) => {
          let callbackForResult = function (err, res) {
            if (err) {
              reject(err);
            }
            resolve(res);
          };
          this.requestRawWithCallback(info, data, callbackForResult);
        });
      }
      requestRawWithCallback(info, data, onResult) {
        let socket;
        if (typeof data === 'string') {
          info.options.headers['Content-Length'] = Buffer.byteLength(data, 'utf8');
        }
        let callbackCalled = false;
        let handleResult = (err, res) => {
          if (!callbackCalled) {
            callbackCalled = true;
            onResult(err, res);
          }
        };
        let req = info.httpModule.request(info.options, msg => {
          let res = new HttpClientResponse(msg);
          handleResult(null, res);
        });
        req.on('socket', sock => {
          socket = sock;
        });
        req.setTimeout(this._socketTimeout || 3 * 6e4, () => {
          if (socket) {
            socket.end();
          }
          handleResult(new Error('Request timeout: ' + info.options.path), null);
        });
        req.on('error', function (err) {
          handleResult(err, null);
        });
        if (data && typeof data === 'string') {
          req.write(data, 'utf8');
        }
        if (data && typeof data !== 'string') {
          data.on('close', function () {
            req.end();
          });
          data.pipe(req);
        } else {
          req.end();
        }
      }
      getAgent(serverUrl) {
        let parsedUrl = new URL(serverUrl);
        return this._getAgent(parsedUrl);
      }
      _prepareRequest(method, requestUrl, headers) {
        const info = {};
        info.parsedUrl = requestUrl;
        const usingSsl = info.parsedUrl.protocol === 'https:';
        info.httpModule = usingSsl ? https : http;
        const defaultPort = usingSsl ? 443 : 80;
        info.options = {};
        info.options.host = info.parsedUrl.hostname;
        info.options.port = info.parsedUrl.port ? parseInt(info.parsedUrl.port) : defaultPort;
        info.options.path = (info.parsedUrl.pathname || '') + (info.parsedUrl.search || '');
        info.options.method = method;
        info.options.headers = this._mergeHeaders(headers);
        if (this.userAgent != null) {
          info.options.headers['user-agent'] = this.userAgent;
        }
        info.options.agent = this._getAgent(info.parsedUrl);
        if (this.handlers) {
          this.handlers.forEach(handler => {
            handler.prepareRequest(info.options);
          });
        }
        return info;
      }
      _mergeHeaders(headers) {
        const lowercaseKeys = obj =>
          Object.keys(obj).reduce((c, k) => ((c[k.toLowerCase()] = obj[k]), c), {});
        if (this.requestOptions && this.requestOptions.headers) {
          return Object.assign(
            {},
            lowercaseKeys(this.requestOptions.headers),
            lowercaseKeys(headers)
          );
        }
        return lowercaseKeys(headers || {});
      }
      _getExistingOrDefaultHeader(additionalHeaders, header, _default) {
        const lowercaseKeys = obj =>
          Object.keys(obj).reduce((c, k) => ((c[k.toLowerCase()] = obj[k]), c), {});
        let clientHeader;
        if (this.requestOptions && this.requestOptions.headers) {
          clientHeader = lowercaseKeys(this.requestOptions.headers)[header];
        }
        return additionalHeaders[header] || clientHeader || _default;
      }
      _getAgent(parsedUrl) {
        let agent;
        let proxyUrl = pm.getProxyUrl(parsedUrl);
        let useProxy = proxyUrl && proxyUrl.hostname;
        if (this._keepAlive && useProxy) {
          agent = this._proxyAgent;
        }
        if (this._keepAlive && !useProxy) {
          agent = this._agent;
        }
        if (!!agent) {
          return agent;
        }
        const usingSsl = parsedUrl.protocol === 'https:';
        let maxSockets = 100;
        if (!!this.requestOptions) {
          maxSockets = this.requestOptions.maxSockets || http.globalAgent.maxSockets;
        }
        if (useProxy) {
          if (!tunnel) {
            tunnel = require_tunnel2();
          }
          const agentOptions = {
            maxSockets,
            keepAlive: this._keepAlive,
            proxy: {
              ...((proxyUrl.username || proxyUrl.password) && {
                proxyAuth: `${proxyUrl.username}:${proxyUrl.password}`
              }),
              host: proxyUrl.hostname,
              port: proxyUrl.port
            }
          };
          let tunnelAgent;
          const overHttps = proxyUrl.protocol === 'https:';
          if (usingSsl) {
            tunnelAgent = overHttps ? tunnel.httpsOverHttps : tunnel.httpsOverHttp;
          } else {
            tunnelAgent = overHttps ? tunnel.httpOverHttps : tunnel.httpOverHttp;
          }
          agent = tunnelAgent(agentOptions);
          this._proxyAgent = agent;
        }
        if (this._keepAlive && !agent) {
          const options = { keepAlive: this._keepAlive, maxSockets };
          agent = usingSsl ? new https.Agent(options) : new http.Agent(options);
          this._agent = agent;
        }
        if (!agent) {
          agent = usingSsl ? https.globalAgent : http.globalAgent;
        }
        if (usingSsl && this._ignoreSslError) {
          agent.options = Object.assign(agent.options || {}, {
            rejectUnauthorized: false
          });
        }
        return agent;
      }
      _performExponentialBackoff(retryNumber) {
        retryNumber = Math.min(ExponentialBackoffCeiling, retryNumber);
        const ms = ExponentialBackoffTimeSlice * Math.pow(2, retryNumber);
        return new Promise(resolve => setTimeout(() => resolve(), ms));
      }
      static dateTimeDeserializer(key, value) {
        if (typeof value === 'string') {
          let a = new Date(value);
          if (!isNaN(a.valueOf())) {
            return a;
          }
        }
        return value;
      }
      async _processResponse(res, options) {
        return new Promise(async (resolve, reject) => {
          const statusCode = res.message.statusCode;
          const response = {
            statusCode,
            result: null,
            headers: {}
          };
          if (statusCode == HttpCodes.NotFound) {
            resolve(response);
          }
          let obj;
          let contents;
          try {
            contents = await res.readBody();
            if (contents && contents.length > 0) {
              if (options && options.deserializeDates) {
                obj = JSON.parse(contents, HttpClient.dateTimeDeserializer);
              } else {
                obj = JSON.parse(contents);
              }
              response.result = obj;
            }
            response.headers = res.message.headers;
          } catch (err) {}
          if (statusCode > 299) {
            let msg;
            if (obj && obj.message) {
              msg = obj.message;
            } else if (contents && contents.length > 0) {
              msg = contents;
            } else {
              msg = 'Failed request: (' + statusCode + ')';
            }
            let err = new HttpClientError(msg, statusCode);
            err.result = response.result;
            reject(err);
          } else {
            resolve(response);
          }
        });
      }
    };
    exports2.HttpClient = HttpClient;
  }
});

// node_modules/@actions/github/lib/internal/utils.js
var require_utils2 = __commonJS({
  'node_modules/@actions/github/lib/internal/utils.js'(exports2) {
    'use strict';
    var __createBinding =
      (exports2 && exports2.__createBinding) ||
      (Object.create
        ? function (o, m, k, k2) {
            if (k2 === void 0) k2 = k;
            Object.defineProperty(o, k2, {
              enumerable: true,
              get: function () {
                return m[k];
              }
            });
          }
        : function (o, m, k, k2) {
            if (k2 === void 0) k2 = k;
            o[k2] = m[k];
          });
    var __setModuleDefault =
      (exports2 && exports2.__setModuleDefault) ||
      (Object.create
        ? function (o, v) {
            Object.defineProperty(o, 'default', { enumerable: true, value: v });
          }
        : function (o, v) {
            o['default'] = v;
          });
    var __importStar =
      (exports2 && exports2.__importStar) ||
      function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) {
          for (var k in mod)
            if (k !== 'default' && Object.hasOwnProperty.call(mod, k))
              __createBinding(result, mod, k);
        }
        __setModuleDefault(result, mod);
        return result;
      };
    Object.defineProperty(exports2, '__esModule', { value: true });
    exports2.getApiBaseUrl = exports2.getProxyAgent = exports2.getAuthString = void 0;
    var httpClient = __importStar(require_http_client());
    function getAuthString(token2, options) {
      if (!token2 && !options.auth) {
        throw new Error('Parameter token or opts.auth is required');
      } else if (token2 && options.auth) {
        throw new Error('Parameters token and opts.auth may not both be specified');
      }
      return typeof options.auth === 'string' ? options.auth : `token ${token2}`;
    }
    exports2.getAuthString = getAuthString;
    function getProxyAgent(destinationUrl) {
      const hc = new httpClient.HttpClient();
      return hc.getAgent(destinationUrl);
    }
    exports2.getProxyAgent = getProxyAgent;
    function getApiBaseUrl() {
      return process.env['GITHUB_API_URL'] || 'https://api.github.com';
    }
    exports2.getApiBaseUrl = getApiBaseUrl;
  }
});

// node_modules/universal-user-agent/dist-node/index.js
var require_dist_node = __commonJS({
  'node_modules/universal-user-agent/dist-node/index.js'(exports2) {
    'use strict';
    Object.defineProperty(exports2, '__esModule', { value: true });
    function getUserAgent() {
      if (typeof navigator === 'object' && 'userAgent' in navigator) {
        return navigator.userAgent;
      }
      if (typeof process === 'object' && 'version' in process) {
        return `Node.js/${process.version.substr(1)} (${process.platform}; ${process.arch})`;
      }
      return '<environment undetectable>';
    }
    exports2.getUserAgent = getUserAgent;
  }
});

// node_modules/before-after-hook/lib/register.js
var require_register = __commonJS({
  'node_modules/before-after-hook/lib/register.js'(exports2, module2) {
    module2.exports = register;
    function register(state, name, method, options) {
      if (typeof method !== 'function') {
        throw new Error('method for before hook must be a function');
      }
      if (!options) {
        options = {};
      }
      if (Array.isArray(name)) {
        return name.reverse().reduce(function (callback, name2) {
          return register.bind(null, state, name2, callback, options);
        }, method)();
      }
      return Promise.resolve().then(function () {
        if (!state.registry[name]) {
          return method(options);
        }
        return state.registry[name].reduce(function (method2, registered) {
          return registered.hook.bind(null, method2, options);
        }, method)();
      });
    }
  }
});

// node_modules/before-after-hook/lib/add.js
var require_add = __commonJS({
  'node_modules/before-after-hook/lib/add.js'(exports2, module2) {
    module2.exports = addHook;
    function addHook(state, kind, name, hook) {
      var orig = hook;
      if (!state.registry[name]) {
        state.registry[name] = [];
      }
      if (kind === 'before') {
        hook = function (method, options) {
          return Promise.resolve().then(orig.bind(null, options)).then(method.bind(null, options));
        };
      }
      if (kind === 'after') {
        hook = function (method, options) {
          var result;
          return Promise.resolve()
            .then(method.bind(null, options))
            .then(function (result_) {
              result = result_;
              return orig(result, options);
            })
            .then(function () {
              return result;
            });
        };
      }
      if (kind === 'error') {
        hook = function (method, options) {
          return Promise.resolve()
            .then(method.bind(null, options))
            .catch(function (error) {
              return orig(error, options);
            });
        };
      }
      state.registry[name].push({
        hook,
        orig
      });
    }
  }
});

// node_modules/before-after-hook/lib/remove.js
var require_remove = __commonJS({
  'node_modules/before-after-hook/lib/remove.js'(exports2, module2) {
    module2.exports = removeHook;
    function removeHook(state, name, method) {
      if (!state.registry[name]) {
        return;
      }
      var index = state.registry[name]
        .map(function (registered) {
          return registered.orig;
        })
        .indexOf(method);
      if (index === -1) {
        return;
      }
      state.registry[name].splice(index, 1);
    }
  }
});

// node_modules/before-after-hook/index.js
var require_before_after_hook = __commonJS({
  'node_modules/before-after-hook/index.js'(exports2, module2) {
    var register = require_register();
    var addHook = require_add();
    var removeHook = require_remove();
    var bind = Function.bind;
    var bindable = bind.bind(bind);
    function bindApi(hook, state, name) {
      var removeHookRef = bindable(removeHook, null).apply(null, name ? [state, name] : [state]);
      hook.api = { remove: removeHookRef };
      hook.remove = removeHookRef;
      ['before', 'error', 'after', 'wrap'].forEach(function (kind) {
        var args = name ? [state, kind, name] : [state, kind];
        hook[kind] = hook.api[kind] = bindable(addHook, null).apply(null, args);
      });
    }
    function HookSingular() {
      var singularHookName = 'h';
      var singularHookState = {
        registry: {}
      };
      var singularHook = register.bind(null, singularHookState, singularHookName);
      bindApi(singularHook, singularHookState, singularHookName);
      return singularHook;
    }
    function HookCollection() {
      var state = {
        registry: {}
      };
      var hook = register.bind(null, state);
      bindApi(hook, state);
      return hook;
    }
    var collectionHookDeprecationMessageDisplayed = false;
    function Hook() {
      if (!collectionHookDeprecationMessageDisplayed) {
        console.warn(
          '[before-after-hook]: "Hook()" repurposing warning, use "Hook.Collection()". Read more: https://git.io/upgrade-before-after-hook-to-1.4'
        );
        collectionHookDeprecationMessageDisplayed = true;
      }
      return HookCollection();
    }
    Hook.Singular = HookSingular.bind();
    Hook.Collection = HookCollection.bind();
    module2.exports = Hook;
    module2.exports.Hook = Hook;
    module2.exports.Singular = Hook.Singular;
    module2.exports.Collection = Hook.Collection;
  }
});

// node_modules/is-plain-object/dist/is-plain-object.js
var require_is_plain_object = __commonJS({
  'node_modules/is-plain-object/dist/is-plain-object.js'(exports2) {
    'use strict';
    Object.defineProperty(exports2, '__esModule', { value: true });
    function isObject(o) {
      return Object.prototype.toString.call(o) === '[object Object]';
    }
    function isPlainObject(o) {
      var ctor, prot;
      if (isObject(o) === false) return false;
      ctor = o.constructor;
      if (ctor === void 0) return true;
      prot = ctor.prototype;
      if (isObject(prot) === false) return false;
      if (prot.hasOwnProperty('isPrototypeOf') === false) {
        return false;
      }
      return true;
    }
    exports2.isPlainObject = isPlainObject;
  }
});

// node_modules/@octokit/endpoint/dist-node/index.js
var require_dist_node2 = __commonJS({
  'node_modules/@octokit/endpoint/dist-node/index.js'(exports2) {
    'use strict';
    Object.defineProperty(exports2, '__esModule', { value: true });
    var isPlainObject = require_is_plain_object();
    var universalUserAgent = require_dist_node();
    function lowercaseKeys(object) {
      if (!object) {
        return {};
      }
      return Object.keys(object).reduce((newObj, key) => {
        newObj[key.toLowerCase()] = object[key];
        return newObj;
      }, {});
    }
    function mergeDeep(defaults, options) {
      const result = Object.assign({}, defaults);
      Object.keys(options).forEach(key => {
        if (isPlainObject.isPlainObject(options[key])) {
          if (!(key in defaults))
            Object.assign(result, {
              [key]: options[key]
            });
          else result[key] = mergeDeep(defaults[key], options[key]);
        } else {
          Object.assign(result, {
            [key]: options[key]
          });
        }
      });
      return result;
    }
    function removeUndefinedProperties(obj) {
      for (const key in obj) {
        if (obj[key] === void 0) {
          delete obj[key];
        }
      }
      return obj;
    }
    function merge(defaults, route, options) {
      if (typeof route === 'string') {
        let [method, url] = route.split(' ');
        options = Object.assign(
          url
            ? {
                method,
                url
              }
            : {
                url: method
              },
          options
        );
      } else {
        options = Object.assign({}, route);
      }
      options.headers = lowercaseKeys(options.headers);
      removeUndefinedProperties(options);
      removeUndefinedProperties(options.headers);
      const mergedOptions = mergeDeep(defaults || {}, options);
      if (defaults && defaults.mediaType.previews.length) {
        mergedOptions.mediaType.previews = defaults.mediaType.previews
          .filter(preview => !mergedOptions.mediaType.previews.includes(preview))
          .concat(mergedOptions.mediaType.previews);
      }
      mergedOptions.mediaType.previews = mergedOptions.mediaType.previews.map(preview =>
        preview.replace(/-preview/, '')
      );
      return mergedOptions;
    }
    function addQueryParameters(url, parameters) {
      const separator = /\?/.test(url) ? '&' : '?';
      const names = Object.keys(parameters);
      if (names.length === 0) {
        return url;
      }
      return (
        url +
        separator +
        names
          .map(name => {
            if (name === 'q') {
              return 'q=' + parameters.q.split('+').map(encodeURIComponent).join('+');
            }
            return `${name}=${encodeURIComponent(parameters[name])}`;
          })
          .join('&')
      );
    }
    var urlVariableRegex = /\{[^}]+\}/g;
    function removeNonChars(variableName) {
      return variableName.replace(/^\W+|\W+$/g, '').split(/,/);
    }
    function extractUrlVariableNames(url) {
      const matches = url.match(urlVariableRegex);
      if (!matches) {
        return [];
      }
      return matches.map(removeNonChars).reduce((a, b) => a.concat(b), []);
    }
    function omit(object, keysToOmit) {
      return Object.keys(object)
        .filter(option => !keysToOmit.includes(option))
        .reduce((obj, key) => {
          obj[key] = object[key];
          return obj;
        }, {});
    }
    function encodeReserved(str) {
      return str
        .split(/(%[0-9A-Fa-f]{2})/g)
        .map(function (part) {
          if (!/%[0-9A-Fa-f]/.test(part)) {
            part = encodeURI(part).replace(/%5B/g, '[').replace(/%5D/g, ']');
          }
          return part;
        })
        .join('');
    }
    function encodeUnreserved(str) {
      return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
        return '%' + c.charCodeAt(0).toString(16).toUpperCase();
      });
    }
    function encodeValue(operator, value, key) {
      value =
        operator === '+' || operator === '#' ? encodeReserved(value) : encodeUnreserved(value);
      if (key) {
        return encodeUnreserved(key) + '=' + value;
      } else {
        return value;
      }
    }
    function isDefined(value) {
      return value !== void 0 && value !== null;
    }
    function isKeyOperator(operator) {
      return operator === ';' || operator === '&' || operator === '?';
    }
    function getValues(context, operator, key, modifier) {
      var value = context[key],
        result = [];
      if (isDefined(value) && value !== '') {
        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
          value = value.toString();
          if (modifier && modifier !== '*') {
            value = value.substring(0, parseInt(modifier, 10));
          }
          result.push(encodeValue(operator, value, isKeyOperator(operator) ? key : ''));
        } else {
          if (modifier === '*') {
            if (Array.isArray(value)) {
              value.filter(isDefined).forEach(function (value2) {
                result.push(encodeValue(operator, value2, isKeyOperator(operator) ? key : ''));
              });
            } else {
              Object.keys(value).forEach(function (k) {
                if (isDefined(value[k])) {
                  result.push(encodeValue(operator, value[k], k));
                }
              });
            }
          } else {
            const tmp = [];
            if (Array.isArray(value)) {
              value.filter(isDefined).forEach(function (value2) {
                tmp.push(encodeValue(operator, value2));
              });
            } else {
              Object.keys(value).forEach(function (k) {
                if (isDefined(value[k])) {
                  tmp.push(encodeUnreserved(k));
                  tmp.push(encodeValue(operator, value[k].toString()));
                }
              });
            }
            if (isKeyOperator(operator)) {
              result.push(encodeUnreserved(key) + '=' + tmp.join(','));
            } else if (tmp.length !== 0) {
              result.push(tmp.join(','));
            }
          }
        }
      } else {
        if (operator === ';') {
          if (isDefined(value)) {
            result.push(encodeUnreserved(key));
          }
        } else if (value === '' && (operator === '&' || operator === '?')) {
          result.push(encodeUnreserved(key) + '=');
        } else if (value === '') {
          result.push('');
        }
      }
      return result;
    }
    function parseUrl(template) {
      return {
        expand: expand.bind(null, template)
      };
    }
    function expand(template, context) {
      var operators = ['+', '#', '.', '/', ';', '?', '&'];
      return template.replace(/\{([^\{\}]+)\}|([^\{\}]+)/g, function (_, expression, literal) {
        if (expression) {
          let operator = '';
          const values = [];
          if (operators.indexOf(expression.charAt(0)) !== -1) {
            operator = expression.charAt(0);
            expression = expression.substr(1);
          }
          expression.split(/,/g).forEach(function (variable) {
            var tmp = /([^:\*]*)(?::(\d+)|(\*))?/.exec(variable);
            values.push(getValues(context, operator, tmp[1], tmp[2] || tmp[3]));
          });
          if (operator && operator !== '+') {
            var separator = ',';
            if (operator === '?') {
              separator = '&';
            } else if (operator !== '#') {
              separator = operator;
            }
            return (values.length !== 0 ? operator : '') + values.join(separator);
          } else {
            return values.join(',');
          }
        } else {
          return encodeReserved(literal);
        }
      });
    }
    function parse(options) {
      let method = options.method.toUpperCase();
      let url = (options.url || '/').replace(/:([a-z]\w+)/g, '{$1}');
      let headers = Object.assign({}, options.headers);
      let body;
      let parameters = omit(options, [
        'method',
        'baseUrl',
        'url',
        'headers',
        'request',
        'mediaType'
      ]);
      const urlVariableNames = extractUrlVariableNames(url);
      url = parseUrl(url).expand(parameters);
      if (!/^http/.test(url)) {
        url = options.baseUrl + url;
      }
      const omittedParameters = Object.keys(options)
        .filter(option => urlVariableNames.includes(option))
        .concat('baseUrl');
      const remainingParameters = omit(parameters, omittedParameters);
      const isBinaryRequest = /application\/octet-stream/i.test(headers.accept);
      if (!isBinaryRequest) {
        if (options.mediaType.format) {
          headers.accept = headers.accept
            .split(/,/)
            .map(preview =>
              preview.replace(
                /application\/vnd(\.\w+)(\.v3)?(\.\w+)?(\+json)?$/,
                `application/vnd$1$2.${options.mediaType.format}`
              )
            )
            .join(',');
        }
        if (options.mediaType.previews.length) {
          const previewsFromAcceptHeader = headers.accept.match(/[\w-]+(?=-preview)/g) || [];
          headers.accept = previewsFromAcceptHeader
            .concat(options.mediaType.previews)
            .map(preview => {
              const format = options.mediaType.format ? `.${options.mediaType.format}` : '+json';
              return `application/vnd.github.${preview}-preview${format}`;
            })
            .join(',');
        }
      }
      if (['GET', 'HEAD'].includes(method)) {
        url = addQueryParameters(url, remainingParameters);
      } else {
        if ('data' in remainingParameters) {
          body = remainingParameters.data;
        } else {
          if (Object.keys(remainingParameters).length) {
            body = remainingParameters;
          } else {
            headers['content-length'] = 0;
          }
        }
      }
      if (!headers['content-type'] && typeof body !== 'undefined') {
        headers['content-type'] = 'application/json; charset=utf-8';
      }
      if (['PATCH', 'PUT'].includes(method) && typeof body === 'undefined') {
        body = '';
      }
      return Object.assign(
        {
          method,
          url,
          headers
        },
        typeof body !== 'undefined'
          ? {
              body
            }
          : null,
        options.request
          ? {
              request: options.request
            }
          : null
      );
    }
    function endpointWithDefaults(defaults, route, options) {
      return parse(merge(defaults, route, options));
    }
    function withDefaults(oldDefaults, newDefaults) {
      const DEFAULTS2 = merge(oldDefaults, newDefaults);
      const endpoint2 = endpointWithDefaults.bind(null, DEFAULTS2);
      return Object.assign(endpoint2, {
        DEFAULTS: DEFAULTS2,
        defaults: withDefaults.bind(null, DEFAULTS2),
        merge: merge.bind(null, DEFAULTS2),
        parse
      });
    }
    var VERSION = '6.0.12';
    var userAgent = `octokit-endpoint.js/${VERSION} ${universalUserAgent.getUserAgent()}`;
    var DEFAULTS = {
      method: 'GET',
      baseUrl: 'https://api.github.com',
      headers: {
        accept: 'application/vnd.github.v3+json',
        'user-agent': userAgent
      },
      mediaType: {
        format: '',
        previews: []
      }
    };
    var endpoint = withDefaults(null, DEFAULTS);
    exports2.endpoint = endpoint;
  }
});

// node_modules/node-fetch/lib/index.js
var require_lib = __commonJS({
  'node_modules/node-fetch/lib/index.js'(exports2, module2) {
    'use strict';
    Object.defineProperty(exports2, '__esModule', { value: true });
    function _interopDefault(ex) {
      return ex && typeof ex === 'object' && 'default' in ex ? ex['default'] : ex;
    }
    var Stream = _interopDefault(require('stream'));
    var http = _interopDefault(require('http'));
    var Url = _interopDefault(require('url'));
    var https = _interopDefault(require('https'));
    var zlib = _interopDefault(require('zlib'));
    var Readable = Stream.Readable;
    var BUFFER = Symbol('buffer');
    var TYPE = Symbol('type');
    var Blob = class {
      constructor() {
        this[TYPE] = '';
        const blobParts = arguments[0];
        const options = arguments[1];
        const buffers = [];
        let size = 0;
        if (blobParts) {
          const a = blobParts;
          const length = Number(a.length);
          for (let i = 0; i < length; i++) {
            const element = a[i];
            let buffer;
            if (element instanceof Buffer) {
              buffer = element;
            } else if (ArrayBuffer.isView(element)) {
              buffer = Buffer.from(element.buffer, element.byteOffset, element.byteLength);
            } else if (element instanceof ArrayBuffer) {
              buffer = Buffer.from(element);
            } else if (element instanceof Blob) {
              buffer = element[BUFFER];
            } else {
              buffer = Buffer.from(typeof element === 'string' ? element : String(element));
            }
            size += buffer.length;
            buffers.push(buffer);
          }
        }
        this[BUFFER] = Buffer.concat(buffers);
        let type = options && options.type !== void 0 && String(options.type).toLowerCase();
        if (type && !/[^\u0020-\u007E]/.test(type)) {
          this[TYPE] = type;
        }
      }
      get size() {
        return this[BUFFER].length;
      }
      get type() {
        return this[TYPE];
      }
      text() {
        return Promise.resolve(this[BUFFER].toString());
      }
      arrayBuffer() {
        const buf = this[BUFFER];
        const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
        return Promise.resolve(ab);
      }
      stream() {
        const readable = new Readable();
        readable._read = function () {};
        readable.push(this[BUFFER]);
        readable.push(null);
        return readable;
      }
      toString() {
        return '[object Blob]';
      }
      slice() {
        const size = this.size;
        const start = arguments[0];
        const end = arguments[1];
        let relativeStart, relativeEnd;
        if (start === void 0) {
          relativeStart = 0;
        } else if (start < 0) {
          relativeStart = Math.max(size + start, 0);
        } else {
          relativeStart = Math.min(start, size);
        }
        if (end === void 0) {
          relativeEnd = size;
        } else if (end < 0) {
          relativeEnd = Math.max(size + end, 0);
        } else {
          relativeEnd = Math.min(end, size);
        }
        const span = Math.max(relativeEnd - relativeStart, 0);
        const buffer = this[BUFFER];
        const slicedBuffer = buffer.slice(relativeStart, relativeStart + span);
        const blob = new Blob([], { type: arguments[2] });
        blob[BUFFER] = slicedBuffer;
        return blob;
      }
    };
    Object.defineProperties(Blob.prototype, {
      size: { enumerable: true },
      type: { enumerable: true },
      slice: { enumerable: true }
    });
    Object.defineProperty(Blob.prototype, Symbol.toStringTag, {
      value: 'Blob',
      writable: false,
      enumerable: false,
      configurable: true
    });
    function FetchError(message, type, systemError) {
      Error.call(this, message);
      this.message = message;
      this.type = type;
      if (systemError) {
        this.code = this.errno = systemError.code;
      }
      Error.captureStackTrace(this, this.constructor);
    }
    FetchError.prototype = Object.create(Error.prototype);
    FetchError.prototype.constructor = FetchError;
    FetchError.prototype.name = 'FetchError';
    var convert;
    try {
      convert = require('encoding').convert;
    } catch (e) {}
    var INTERNALS = Symbol('Body internals');
    var PassThrough = Stream.PassThrough;
    function Body(body) {
      var _this = this;
      var _ref = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {},
        _ref$size = _ref.size;
      let size = _ref$size === void 0 ? 0 : _ref$size;
      var _ref$timeout = _ref.timeout;
      let timeout = _ref$timeout === void 0 ? 0 : _ref$timeout;
      if (body == null) {
        body = null;
      } else if (isURLSearchParams(body)) {
        body = Buffer.from(body.toString());
      } else if (isBlob(body));
      else if (Buffer.isBuffer(body));
      else if (Object.prototype.toString.call(body) === '[object ArrayBuffer]') {
        body = Buffer.from(body);
      } else if (ArrayBuffer.isView(body)) {
        body = Buffer.from(body.buffer, body.byteOffset, body.byteLength);
      } else if (body instanceof Stream);
      else {
        body = Buffer.from(String(body));
      }
      this[INTERNALS] = {
        body,
        disturbed: false,
        error: null
      };
      this.size = size;
      this.timeout = timeout;
      if (body instanceof Stream) {
        body.on('error', function (err) {
          const error =
            err.name === 'AbortError'
              ? err
              : new FetchError(
                  `Invalid response body while trying to fetch ${_this.url}: ${err.message}`,
                  'system',
                  err
                );
          _this[INTERNALS].error = error;
        });
      }
    }
    Body.prototype = {
      get body() {
        return this[INTERNALS].body;
      },
      get bodyUsed() {
        return this[INTERNALS].disturbed;
      },
      arrayBuffer() {
        return consumeBody.call(this).then(function (buf) {
          return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
        });
      },
      blob() {
        let ct = (this.headers && this.headers.get('content-type')) || '';
        return consumeBody.call(this).then(function (buf) {
          return Object.assign(
            new Blob([], {
              type: ct.toLowerCase()
            }),
            {
              [BUFFER]: buf
            }
          );
        });
      },
      json() {
        var _this2 = this;
        return consumeBody.call(this).then(function (buffer) {
          try {
            return JSON.parse(buffer.toString());
          } catch (err) {
            return Body.Promise.reject(
              new FetchError(
                `invalid json response body at ${_this2.url} reason: ${err.message}`,
                'invalid-json'
              )
            );
          }
        });
      },
      text() {
        return consumeBody.call(this).then(function (buffer) {
          return buffer.toString();
        });
      },
      buffer() {
        return consumeBody.call(this);
      },
      textConverted() {
        var _this3 = this;
        return consumeBody.call(this).then(function (buffer) {
          return convertBody(buffer, _this3.headers);
        });
      }
    };
    Object.defineProperties(Body.prototype, {
      body: { enumerable: true },
      bodyUsed: { enumerable: true },
      arrayBuffer: { enumerable: true },
      blob: { enumerable: true },
      json: { enumerable: true },
      text: { enumerable: true }
    });
    Body.mixIn = function (proto) {
      for (const name of Object.getOwnPropertyNames(Body.prototype)) {
        if (!(name in proto)) {
          const desc = Object.getOwnPropertyDescriptor(Body.prototype, name);
          Object.defineProperty(proto, name, desc);
        }
      }
    };
    function consumeBody() {
      var _this4 = this;
      if (this[INTERNALS].disturbed) {
        return Body.Promise.reject(new TypeError(`body used already for: ${this.url}`));
      }
      this[INTERNALS].disturbed = true;
      if (this[INTERNALS].error) {
        return Body.Promise.reject(this[INTERNALS].error);
      }
      let body = this.body;
      if (body === null) {
        return Body.Promise.resolve(Buffer.alloc(0));
      }
      if (isBlob(body)) {
        body = body.stream();
      }
      if (Buffer.isBuffer(body)) {
        return Body.Promise.resolve(body);
      }
      if (!(body instanceof Stream)) {
        return Body.Promise.resolve(Buffer.alloc(0));
      }
      let accum = [];
      let accumBytes = 0;
      let abort = false;
      return new Body.Promise(function (resolve, reject) {
        let resTimeout;
        if (_this4.timeout) {
          resTimeout = setTimeout(function () {
            abort = true;
            reject(
              new FetchError(
                `Response timeout while trying to fetch ${_this4.url} (over ${_this4.timeout}ms)`,
                'body-timeout'
              )
            );
          }, _this4.timeout);
        }
        body.on('error', function (err) {
          if (err.name === 'AbortError') {
            abort = true;
            reject(err);
          } else {
            reject(
              new FetchError(
                `Invalid response body while trying to fetch ${_this4.url}: ${err.message}`,
                'system',
                err
              )
            );
          }
        });
        body.on('data', function (chunk) {
          if (abort || chunk === null) {
            return;
          }
          if (_this4.size && accumBytes + chunk.length > _this4.size) {
            abort = true;
            reject(
              new FetchError(`content size at ${_this4.url} over limit: ${_this4.size}`, 'max-size')
            );
            return;
          }
          accumBytes += chunk.length;
          accum.push(chunk);
        });
        body.on('end', function () {
          if (abort) {
            return;
          }
          clearTimeout(resTimeout);
          try {
            resolve(Buffer.concat(accum, accumBytes));
          } catch (err) {
            reject(
              new FetchError(
                `Could not create Buffer from response body for ${_this4.url}: ${err.message}`,
                'system',
                err
              )
            );
          }
        });
      });
    }
    function convertBody(buffer, headers) {
      if (typeof convert !== 'function') {
        throw new Error(
          'The package `encoding` must be installed to use the textConverted() function'
        );
      }
      const ct = headers.get('content-type');
      let charset = 'utf-8';
      let res, str;
      if (ct) {
        res = /charset=([^;]*)/i.exec(ct);
      }
      str = buffer.slice(0, 1024).toString();
      if (!res && str) {
        res = /<meta.+?charset=(['"])(.+?)\1/i.exec(str);
      }
      if (!res && str) {
        res = /<meta[\s]+?http-equiv=(['"])content-type\1[\s]+?content=(['"])(.+?)\2/i.exec(str);
        if (!res) {
          res = /<meta[\s]+?content=(['"])(.+?)\1[\s]+?http-equiv=(['"])content-type\3/i.exec(str);
          if (res) {
            res.pop();
          }
        }
        if (res) {
          res = /charset=(.*)/i.exec(res.pop());
        }
      }
      if (!res && str) {
        res = /<\?xml.+?encoding=(['"])(.+?)\1/i.exec(str);
      }
      if (res) {
        charset = res.pop();
        if (charset === 'gb2312' || charset === 'gbk') {
          charset = 'gb18030';
        }
      }
      return convert(buffer, 'UTF-8', charset).toString();
    }
    function isURLSearchParams(obj) {
      if (
        typeof obj !== 'object' ||
        typeof obj.append !== 'function' ||
        typeof obj.delete !== 'function' ||
        typeof obj.get !== 'function' ||
        typeof obj.getAll !== 'function' ||
        typeof obj.has !== 'function' ||
        typeof obj.set !== 'function'
      ) {
        return false;
      }
      return (
        obj.constructor.name === 'URLSearchParams' ||
        Object.prototype.toString.call(obj) === '[object URLSearchParams]' ||
        typeof obj.sort === 'function'
      );
    }
    function isBlob(obj) {
      return (
        typeof obj === 'object' &&
        typeof obj.arrayBuffer === 'function' &&
        typeof obj.type === 'string' &&
        typeof obj.stream === 'function' &&
        typeof obj.constructor === 'function' &&
        typeof obj.constructor.name === 'string' &&
        /^(Blob|File)$/.test(obj.constructor.name) &&
        /^(Blob|File)$/.test(obj[Symbol.toStringTag])
      );
    }
    function clone(instance) {
      let p1, p2;
      let body = instance.body;
      if (instance.bodyUsed) {
        throw new Error('cannot clone body after it is used');
      }
      if (body instanceof Stream && typeof body.getBoundary !== 'function') {
        p1 = new PassThrough();
        p2 = new PassThrough();
        body.pipe(p1);
        body.pipe(p2);
        instance[INTERNALS].body = p1;
        body = p2;
      }
      return body;
    }
    function extractContentType(body) {
      if (body === null) {
        return null;
      } else if (typeof body === 'string') {
        return 'text/plain;charset=UTF-8';
      } else if (isURLSearchParams(body)) {
        return 'application/x-www-form-urlencoded;charset=UTF-8';
      } else if (isBlob(body)) {
        return body.type || null;
      } else if (Buffer.isBuffer(body)) {
        return null;
      } else if (Object.prototype.toString.call(body) === '[object ArrayBuffer]') {
        return null;
      } else if (ArrayBuffer.isView(body)) {
        return null;
      } else if (typeof body.getBoundary === 'function') {
        return `multipart/form-data;boundary=${body.getBoundary()}`;
      } else if (body instanceof Stream) {
        return null;
      } else {
        return 'text/plain;charset=UTF-8';
      }
    }
    function getTotalBytes(instance) {
      const body = instance.body;
      if (body === null) {
        return 0;
      } else if (isBlob(body)) {
        return body.size;
      } else if (Buffer.isBuffer(body)) {
        return body.length;
      } else if (body && typeof body.getLengthSync === 'function') {
        if (
          (body._lengthRetrievers && body._lengthRetrievers.length == 0) ||
          (body.hasKnownLength && body.hasKnownLength())
        ) {
          return body.getLengthSync();
        }
        return null;
      } else {
        return null;
      }
    }
    function writeToStream(dest, instance) {
      const body = instance.body;
      if (body === null) {
        dest.end();
      } else if (isBlob(body)) {
        body.stream().pipe(dest);
      } else if (Buffer.isBuffer(body)) {
        dest.write(body);
        dest.end();
      } else {
        body.pipe(dest);
      }
    }
    Body.Promise = global.Promise;
    var invalidTokenRegex = /[^\^_`a-zA-Z\-0-9!#$%&'*+.|~]/;
    var invalidHeaderCharRegex = /[^\t\x20-\x7e\x80-\xff]/;
    function validateName(name) {
      name = `${name}`;
      if (invalidTokenRegex.test(name) || name === '') {
        throw new TypeError(`${name} is not a legal HTTP header name`);
      }
    }
    function validateValue(value) {
      value = `${value}`;
      if (invalidHeaderCharRegex.test(value)) {
        throw new TypeError(`${value} is not a legal HTTP header value`);
      }
    }
    function find(map, name) {
      name = name.toLowerCase();
      for (const key in map) {
        if (key.toLowerCase() === name) {
          return key;
        }
      }
      return void 0;
    }
    var MAP = Symbol('map');
    var Headers = class {
      constructor() {
        let init = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : void 0;
        this[MAP] = Object.create(null);
        if (init instanceof Headers) {
          const rawHeaders = init.raw();
          const headerNames = Object.keys(rawHeaders);
          for (const headerName of headerNames) {
            for (const value of rawHeaders[headerName]) {
              this.append(headerName, value);
            }
          }
          return;
        }
        if (init == null);
        else if (typeof init === 'object') {
          const method = init[Symbol.iterator];
          if (method != null) {
            if (typeof method !== 'function') {
              throw new TypeError('Header pairs must be iterable');
            }
            const pairs = [];
            for (const pair of init) {
              if (typeof pair !== 'object' || typeof pair[Symbol.iterator] !== 'function') {
                throw new TypeError('Each header pair must be iterable');
              }
              pairs.push(Array.from(pair));
            }
            for (const pair of pairs) {
              if (pair.length !== 2) {
                throw new TypeError('Each header pair must be a name/value tuple');
              }
              this.append(pair[0], pair[1]);
            }
          } else {
            for (const key of Object.keys(init)) {
              const value = init[key];
              this.append(key, value);
            }
          }
        } else {
          throw new TypeError('Provided initializer must be an object');
        }
      }
      get(name) {
        name = `${name}`;
        validateName(name);
        const key = find(this[MAP], name);
        if (key === void 0) {
          return null;
        }
        return this[MAP][key].join(', ');
      }
      forEach(callback) {
        let thisArg = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : void 0;
        let pairs = getHeaders(this);
        let i = 0;
        while (i < pairs.length) {
          var _pairs$i = pairs[i];
          const name = _pairs$i[0],
            value = _pairs$i[1];
          callback.call(thisArg, value, name, this);
          pairs = getHeaders(this);
          i++;
        }
      }
      set(name, value) {
        name = `${name}`;
        value = `${value}`;
        validateName(name);
        validateValue(value);
        const key = find(this[MAP], name);
        this[MAP][key !== void 0 ? key : name] = [value];
      }
      append(name, value) {
        name = `${name}`;
        value = `${value}`;
        validateName(name);
        validateValue(value);
        const key = find(this[MAP], name);
        if (key !== void 0) {
          this[MAP][key].push(value);
        } else {
          this[MAP][name] = [value];
        }
      }
      has(name) {
        name = `${name}`;
        validateName(name);
        return find(this[MAP], name) !== void 0;
      }
      delete(name) {
        name = `${name}`;
        validateName(name);
        const key = find(this[MAP], name);
        if (key !== void 0) {
          delete this[MAP][key];
        }
      }
      raw() {
        return this[MAP];
      }
      keys() {
        return createHeadersIterator(this, 'key');
      }
      values() {
        return createHeadersIterator(this, 'value');
      }
      [Symbol.iterator]() {
        return createHeadersIterator(this, 'key+value');
      }
    };
    Headers.prototype.entries = Headers.prototype[Symbol.iterator];
    Object.defineProperty(Headers.prototype, Symbol.toStringTag, {
      value: 'Headers',
      writable: false,
      enumerable: false,
      configurable: true
    });
    Object.defineProperties(Headers.prototype, {
      get: { enumerable: true },
      forEach: { enumerable: true },
      set: { enumerable: true },
      append: { enumerable: true },
      has: { enumerable: true },
      delete: { enumerable: true },
      keys: { enumerable: true },
      values: { enumerable: true },
      entries: { enumerable: true }
    });
    function getHeaders(headers) {
      let kind = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 'key+value';
      const keys = Object.keys(headers[MAP]).sort();
      return keys.map(
        kind === 'key'
          ? function (k) {
              return k.toLowerCase();
            }
          : kind === 'value'
          ? function (k) {
              return headers[MAP][k].join(', ');
            }
          : function (k) {
              return [k.toLowerCase(), headers[MAP][k].join(', ')];
            }
      );
    }
    var INTERNAL = Symbol('internal');
    function createHeadersIterator(target, kind) {
      const iterator = Object.create(HeadersIteratorPrototype);
      iterator[INTERNAL] = {
        target,
        kind,
        index: 0
      };
      return iterator;
    }
    var HeadersIteratorPrototype = Object.setPrototypeOf(
      {
        next() {
          if (!this || Object.getPrototypeOf(this) !== HeadersIteratorPrototype) {
            throw new TypeError('Value of `this` is not a HeadersIterator');
          }
          var _INTERNAL = this[INTERNAL];
          const target = _INTERNAL.target,
            kind = _INTERNAL.kind,
            index = _INTERNAL.index;
          const values = getHeaders(target, kind);
          const len = values.length;
          if (index >= len) {
            return {
              value: void 0,
              done: true
            };
          }
          this[INTERNAL].index = index + 1;
          return {
            value: values[index],
            done: false
          };
        }
      },
      Object.getPrototypeOf(Object.getPrototypeOf([][Symbol.iterator]()))
    );
    Object.defineProperty(HeadersIteratorPrototype, Symbol.toStringTag, {
      value: 'HeadersIterator',
      writable: false,
      enumerable: false,
      configurable: true
    });
    function exportNodeCompatibleHeaders(headers) {
      const obj = Object.assign({ __proto__: null }, headers[MAP]);
      const hostHeaderKey = find(headers[MAP], 'Host');
      if (hostHeaderKey !== void 0) {
        obj[hostHeaderKey] = obj[hostHeaderKey][0];
      }
      return obj;
    }
    function createHeadersLenient(obj) {
      const headers = new Headers();
      for (const name of Object.keys(obj)) {
        if (invalidTokenRegex.test(name)) {
          continue;
        }
        if (Array.isArray(obj[name])) {
          for (const val of obj[name]) {
            if (invalidHeaderCharRegex.test(val)) {
              continue;
            }
            if (headers[MAP][name] === void 0) {
              headers[MAP][name] = [val];
            } else {
              headers[MAP][name].push(val);
            }
          }
        } else if (!invalidHeaderCharRegex.test(obj[name])) {
          headers[MAP][name] = [obj[name]];
        }
      }
      return headers;
    }
    var INTERNALS$1 = Symbol('Response internals');
    var STATUS_CODES = http.STATUS_CODES;
    var Response = class {
      constructor() {
        let body = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : null;
        let opts = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        Body.call(this, body, opts);
        const status = opts.status || 200;
        const headers = new Headers(opts.headers);
        if (body != null && !headers.has('Content-Type')) {
          const contentType = extractContentType(body);
          if (contentType) {
            headers.append('Content-Type', contentType);
          }
        }
        this[INTERNALS$1] = {
          url: opts.url,
          status,
          statusText: opts.statusText || STATUS_CODES[status],
          headers,
          counter: opts.counter
        };
      }
      get url() {
        return this[INTERNALS$1].url || '';
      }
      get status() {
        return this[INTERNALS$1].status;
      }
      get ok() {
        return this[INTERNALS$1].status >= 200 && this[INTERNALS$1].status < 300;
      }
      get redirected() {
        return this[INTERNALS$1].counter > 0;
      }
      get statusText() {
        return this[INTERNALS$1].statusText;
      }
      get headers() {
        return this[INTERNALS$1].headers;
      }
      clone() {
        return new Response(clone(this), {
          url: this.url,
          status: this.status,
          statusText: this.statusText,
          headers: this.headers,
          ok: this.ok,
          redirected: this.redirected
        });
      }
    };
    Body.mixIn(Response.prototype);
    Object.defineProperties(Response.prototype, {
      url: { enumerable: true },
      status: { enumerable: true },
      ok: { enumerable: true },
      redirected: { enumerable: true },
      statusText: { enumerable: true },
      headers: { enumerable: true },
      clone: { enumerable: true }
    });
    Object.defineProperty(Response.prototype, Symbol.toStringTag, {
      value: 'Response',
      writable: false,
      enumerable: false,
      configurable: true
    });
    var INTERNALS$2 = Symbol('Request internals');
    var parse_url = Url.parse;
    var format_url = Url.format;
    var streamDestructionSupported = 'destroy' in Stream.Readable.prototype;
    function isRequest(input) {
      return typeof input === 'object' && typeof input[INTERNALS$2] === 'object';
    }
    function isAbortSignal(signal) {
      const proto = signal && typeof signal === 'object' && Object.getPrototypeOf(signal);
      return !!(proto && proto.constructor.name === 'AbortSignal');
    }
    var Request = class {
      constructor(input) {
        let init = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        let parsedURL;
        if (!isRequest(input)) {
          if (input && input.href) {
            parsedURL = parse_url(input.href);
          } else {
            parsedURL = parse_url(`${input}`);
          }
          input = {};
        } else {
          parsedURL = parse_url(input.url);
        }
        let method = init.method || input.method || 'GET';
        method = method.toUpperCase();
        if (
          (init.body != null || (isRequest(input) && input.body !== null)) &&
          (method === 'GET' || method === 'HEAD')
        ) {
          throw new TypeError('Request with GET/HEAD method cannot have body');
        }
        let inputBody =
          init.body != null
            ? init.body
            : isRequest(input) && input.body !== null
            ? clone(input)
            : null;
        Body.call(this, inputBody, {
          timeout: init.timeout || input.timeout || 0,
          size: init.size || input.size || 0
        });
        const headers = new Headers(init.headers || input.headers || {});
        if (inputBody != null && !headers.has('Content-Type')) {
          const contentType = extractContentType(inputBody);
          if (contentType) {
            headers.append('Content-Type', contentType);
          }
        }
        let signal = isRequest(input) ? input.signal : null;
        if ('signal' in init) signal = init.signal;
        if (signal != null && !isAbortSignal(signal)) {
          throw new TypeError('Expected signal to be an instanceof AbortSignal');
        }
        this[INTERNALS$2] = {
          method,
          redirect: init.redirect || input.redirect || 'follow',
          headers,
          parsedURL,
          signal
        };
        this.follow =
          init.follow !== void 0 ? init.follow : input.follow !== void 0 ? input.follow : 20;
        this.compress =
          init.compress !== void 0
            ? init.compress
            : input.compress !== void 0
            ? input.compress
            : true;
        this.counter = init.counter || input.counter || 0;
        this.agent = init.agent || input.agent;
      }
      get method() {
        return this[INTERNALS$2].method;
      }
      get url() {
        return format_url(this[INTERNALS$2].parsedURL);
      }
      get headers() {
        return this[INTERNALS$2].headers;
      }
      get redirect() {
        return this[INTERNALS$2].redirect;
      }
      get signal() {
        return this[INTERNALS$2].signal;
      }
      clone() {
        return new Request(this);
      }
    };
    Body.mixIn(Request.prototype);
    Object.defineProperty(Request.prototype, Symbol.toStringTag, {
      value: 'Request',
      writable: false,
      enumerable: false,
      configurable: true
    });
    Object.defineProperties(Request.prototype, {
      method: { enumerable: true },
      url: { enumerable: true },
      headers: { enumerable: true },
      redirect: { enumerable: true },
      clone: { enumerable: true },
      signal: { enumerable: true }
    });
    function getNodeRequestOptions(request) {
      const parsedURL = request[INTERNALS$2].parsedURL;
      const headers = new Headers(request[INTERNALS$2].headers);
      if (!headers.has('Accept')) {
        headers.set('Accept', '*/*');
      }
      if (!parsedURL.protocol || !parsedURL.hostname) {
        throw new TypeError('Only absolute URLs are supported');
      }
      if (!/^https?:$/.test(parsedURL.protocol)) {
        throw new TypeError('Only HTTP(S) protocols are supported');
      }
      if (
        request.signal &&
        request.body instanceof Stream.Readable &&
        !streamDestructionSupported
      ) {
        throw new Error(
          'Cancellation of streamed requests with AbortSignal is not supported in node < 8'
        );
      }
      let contentLengthValue = null;
      if (request.body == null && /^(POST|PUT)$/i.test(request.method)) {
        contentLengthValue = '0';
      }
      if (request.body != null) {
        const totalBytes = getTotalBytes(request);
        if (typeof totalBytes === 'number') {
          contentLengthValue = String(totalBytes);
        }
      }
      if (contentLengthValue) {
        headers.set('Content-Length', contentLengthValue);
      }
      if (!headers.has('User-Agent')) {
        headers.set('User-Agent', 'node-fetch/1.0 (+https://github.com/bitinn/node-fetch)');
      }
      if (request.compress && !headers.has('Accept-Encoding')) {
        headers.set('Accept-Encoding', 'gzip,deflate');
      }
      let agent = request.agent;
      if (typeof agent === 'function') {
        agent = agent(parsedURL);
      }
      if (!headers.has('Connection') && !agent) {
        headers.set('Connection', 'close');
      }
      return Object.assign({}, parsedURL, {
        method: request.method,
        headers: exportNodeCompatibleHeaders(headers),
        agent
      });
    }
    function AbortError(message) {
      Error.call(this, message);
      this.type = 'aborted';
      this.message = message;
      Error.captureStackTrace(this, this.constructor);
    }
    AbortError.prototype = Object.create(Error.prototype);
    AbortError.prototype.constructor = AbortError;
    AbortError.prototype.name = 'AbortError';
    var PassThrough$1 = Stream.PassThrough;
    var resolve_url = Url.resolve;
    function fetch(url, opts) {
      if (!fetch.Promise) {
        throw new Error('native promise missing, set fetch.Promise to your favorite alternative');
      }
      Body.Promise = fetch.Promise;
      return new fetch.Promise(function (resolve, reject) {
        const request = new Request(url, opts);
        const options = getNodeRequestOptions(request);
        const send = (options.protocol === 'https:' ? https : http).request;
        const signal = request.signal;
        let response = null;
        const abort = function abort2() {
          let error = new AbortError('The user aborted a request.');
          reject(error);
          if (request.body && request.body instanceof Stream.Readable) {
            request.body.destroy(error);
          }
          if (!response || !response.body) return;
          response.body.emit('error', error);
        };
        if (signal && signal.aborted) {
          abort();
          return;
        }
        const abortAndFinalize = function abortAndFinalize2() {
          abort();
          finalize();
        };
        const req = send(options);
        let reqTimeout;
        if (signal) {
          signal.addEventListener('abort', abortAndFinalize);
        }
        function finalize() {
          req.abort();
          if (signal) signal.removeEventListener('abort', abortAndFinalize);
          clearTimeout(reqTimeout);
        }
        if (request.timeout) {
          req.once('socket', function (socket) {
            reqTimeout = setTimeout(function () {
              reject(new FetchError(`network timeout at: ${request.url}`, 'request-timeout'));
              finalize();
            }, request.timeout);
          });
        }
        req.on('error', function (err) {
          reject(
            new FetchError(
              `request to ${request.url} failed, reason: ${err.message}`,
              'system',
              err
            )
          );
          finalize();
        });
        req.on('response', function (res) {
          clearTimeout(reqTimeout);
          const headers = createHeadersLenient(res.headers);
          if (fetch.isRedirect(res.statusCode)) {
            const location = headers.get('Location');
            const locationURL = location === null ? null : resolve_url(request.url, location);
            switch (request.redirect) {
              case 'error':
                reject(
                  new FetchError(
                    `uri requested responds with a redirect, redirect mode is set to error: ${request.url}`,
                    'no-redirect'
                  )
                );
                finalize();
                return;
              case 'manual':
                if (locationURL !== null) {
                  try {
                    headers.set('Location', locationURL);
                  } catch (err) {
                    reject(err);
                  }
                }
                break;
              case 'follow':
                if (locationURL === null) {
                  break;
                }
                if (request.counter >= request.follow) {
                  reject(
                    new FetchError(`maximum redirect reached at: ${request.url}`, 'max-redirect')
                  );
                  finalize();
                  return;
                }
                const requestOpts = {
                  headers: new Headers(request.headers),
                  follow: request.follow,
                  counter: request.counter + 1,
                  agent: request.agent,
                  compress: request.compress,
                  method: request.method,
                  body: request.body,
                  signal: request.signal,
                  timeout: request.timeout,
                  size: request.size
                };
                if (res.statusCode !== 303 && request.body && getTotalBytes(request) === null) {
                  reject(
                    new FetchError(
                      'Cannot follow redirect with body being a readable stream',
                      'unsupported-redirect'
                    )
                  );
                  finalize();
                  return;
                }
                if (
                  res.statusCode === 303 ||
                  ((res.statusCode === 301 || res.statusCode === 302) && request.method === 'POST')
                ) {
                  requestOpts.method = 'GET';
                  requestOpts.body = void 0;
                  requestOpts.headers.delete('content-length');
                }
                resolve(fetch(new Request(locationURL, requestOpts)));
                finalize();
                return;
            }
          }
          res.once('end', function () {
            if (signal) signal.removeEventListener('abort', abortAndFinalize);
          });
          let body = res.pipe(new PassThrough$1());
          const response_options = {
            url: request.url,
            status: res.statusCode,
            statusText: res.statusMessage,
            headers,
            size: request.size,
            timeout: request.timeout,
            counter: request.counter
          };
          const codings = headers.get('Content-Encoding');
          if (
            !request.compress ||
            request.method === 'HEAD' ||
            codings === null ||
            res.statusCode === 204 ||
            res.statusCode === 304
          ) {
            response = new Response(body, response_options);
            resolve(response);
            return;
          }
          const zlibOptions = {
            flush: zlib.Z_SYNC_FLUSH,
            finishFlush: zlib.Z_SYNC_FLUSH
          };
          if (codings == 'gzip' || codings == 'x-gzip') {
            body = body.pipe(zlib.createGunzip(zlibOptions));
            response = new Response(body, response_options);
            resolve(response);
            return;
          }
          if (codings == 'deflate' || codings == 'x-deflate') {
            const raw = res.pipe(new PassThrough$1());
            raw.once('data', function (chunk) {
              if ((chunk[0] & 15) === 8) {
                body = body.pipe(zlib.createInflate());
              } else {
                body = body.pipe(zlib.createInflateRaw());
              }
              response = new Response(body, response_options);
              resolve(response);
            });
            return;
          }
          if (codings == 'br' && typeof zlib.createBrotliDecompress === 'function') {
            body = body.pipe(zlib.createBrotliDecompress());
            response = new Response(body, response_options);
            resolve(response);
            return;
          }
          response = new Response(body, response_options);
          resolve(response);
        });
        writeToStream(req, request);
      });
    }
    fetch.isRedirect = function (code) {
      return code === 301 || code === 302 || code === 303 || code === 307 || code === 308;
    };
    fetch.Promise = global.Promise;
    module2.exports = exports2 = fetch;
    Object.defineProperty(exports2, '__esModule', { value: true });
    exports2.default = exports2;
    exports2.Headers = Headers;
    exports2.Request = Request;
    exports2.Response = Response;
    exports2.FetchError = FetchError;
  }
});

// node_modules/deprecation/dist-node/index.js
var require_dist_node3 = __commonJS({
  'node_modules/deprecation/dist-node/index.js'(exports2) {
    'use strict';
    Object.defineProperty(exports2, '__esModule', { value: true });
    var Deprecation = class extends Error {
      constructor(message) {
        super(message);
        if (Error.captureStackTrace) {
          Error.captureStackTrace(this, this.constructor);
        }
        this.name = 'Deprecation';
      }
    };
    exports2.Deprecation = Deprecation;
  }
});

// node_modules/wrappy/wrappy.js
var require_wrappy = __commonJS({
  'node_modules/wrappy/wrappy.js'(exports2, module2) {
    module2.exports = wrappy;
    function wrappy(fn, cb) {
      if (fn && cb) return wrappy(fn)(cb);
      if (typeof fn !== 'function') throw new TypeError('need wrapper function');
      Object.keys(fn).forEach(function (k) {
        wrapper[k] = fn[k];
      });
      return wrapper;
      function wrapper() {
        var args = new Array(arguments.length);
        for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i];
        }
        var ret = fn.apply(this, args);
        var cb2 = args[args.length - 1];
        if (typeof ret === 'function' && ret !== cb2) {
          Object.keys(cb2).forEach(function (k) {
            ret[k] = cb2[k];
          });
        }
        return ret;
      }
    }
  }
});

// node_modules/once/once.js
var require_once = __commonJS({
  'node_modules/once/once.js'(exports2, module2) {
    var wrappy = require_wrappy();
    module2.exports = wrappy(once);
    module2.exports.strict = wrappy(onceStrict);
    once.proto = once(function () {
      Object.defineProperty(Function.prototype, 'once', {
        value: function () {
          return once(this);
        },
        configurable: true
      });
      Object.defineProperty(Function.prototype, 'onceStrict', {
        value: function () {
          return onceStrict(this);
        },
        configurable: true
      });
    });
    function once(fn) {
      var f = function () {
        if (f.called) return f.value;
        f.called = true;
        return (f.value = fn.apply(this, arguments));
      };
      f.called = false;
      return f;
    }
    function onceStrict(fn) {
      var f = function () {
        if (f.called) throw new Error(f.onceError);
        f.called = true;
        return (f.value = fn.apply(this, arguments));
      };
      var name = fn.name || 'Function wrapped with `once`';
      f.onceError = name + " shouldn't be called more than once";
      f.called = false;
      return f;
    }
  }
});

// node_modules/@octokit/request-error/dist-node/index.js
var require_dist_node4 = __commonJS({
  'node_modules/@octokit/request-error/dist-node/index.js'(exports2) {
    'use strict';
    Object.defineProperty(exports2, '__esModule', { value: true });
    function _interopDefault(ex) {
      return ex && typeof ex === 'object' && 'default' in ex ? ex['default'] : ex;
    }
    var deprecation = require_dist_node3();
    var once = _interopDefault(require_once());
    var logOnceCode = once(deprecation2 => console.warn(deprecation2));
    var logOnceHeaders = once(deprecation2 => console.warn(deprecation2));
    var RequestError = class extends Error {
      constructor(message, statusCode, options) {
        super(message);
        if (Error.captureStackTrace) {
          Error.captureStackTrace(this, this.constructor);
        }
        this.name = 'HttpError';
        this.status = statusCode;
        let headers;
        if ('headers' in options && typeof options.headers !== 'undefined') {
          headers = options.headers;
        }
        if ('response' in options) {
          this.response = options.response;
          headers = options.response.headers;
        }
        const requestCopy = Object.assign({}, options.request);
        if (options.request.headers.authorization) {
          requestCopy.headers = Object.assign({}, options.request.headers, {
            authorization: options.request.headers.authorization.replace(/ .*$/, ' [REDACTED]')
          });
        }
        requestCopy.url = requestCopy.url
          .replace(/\bclient_secret=\w+/g, 'client_secret=[REDACTED]')
          .replace(/\baccess_token=\w+/g, 'access_token=[REDACTED]');
        this.request = requestCopy;
        Object.defineProperty(this, 'code', {
          get() {
            logOnceCode(
              new deprecation.Deprecation(
                '[@octokit/request-error] `error.code` is deprecated, use `error.status`.'
              )
            );
            return statusCode;
          }
        });
        Object.defineProperty(this, 'headers', {
          get() {
            logOnceHeaders(
              new deprecation.Deprecation(
                '[@octokit/request-error] `error.headers` is deprecated, use `error.response.headers`.'
              )
            );
            return headers || {};
          }
        });
      }
    };
    exports2.RequestError = RequestError;
  }
});

// node_modules/@octokit/request/dist-node/index.js
var require_dist_node5 = __commonJS({
  'node_modules/@octokit/request/dist-node/index.js'(exports2) {
    'use strict';
    Object.defineProperty(exports2, '__esModule', { value: true });
    function _interopDefault(ex) {
      return ex && typeof ex === 'object' && 'default' in ex ? ex['default'] : ex;
    }
    var endpoint = require_dist_node2();
    var universalUserAgent = require_dist_node();
    var isPlainObject = require_is_plain_object();
    var nodeFetch = _interopDefault(require_lib());
    var requestError = require_dist_node4();
    var VERSION = '5.6.1';
    function getBufferResponse(response) {
      return response.arrayBuffer();
    }
    function fetchWrapper(requestOptions) {
      const log =
        requestOptions.request && requestOptions.request.log ? requestOptions.request.log : console;
      if (isPlainObject.isPlainObject(requestOptions.body) || Array.isArray(requestOptions.body)) {
        requestOptions.body = JSON.stringify(requestOptions.body);
      }
      let headers = {};
      let status;
      let url;
      const fetch = (requestOptions.request && requestOptions.request.fetch) || nodeFetch;
      return fetch(
        requestOptions.url,
        Object.assign(
          {
            method: requestOptions.method,
            body: requestOptions.body,
            headers: requestOptions.headers,
            redirect: requestOptions.redirect
          },
          requestOptions.request
        )
      )
        .then(async response => {
          url = response.url;
          status = response.status;
          for (const keyAndValue of response.headers) {
            headers[keyAndValue[0]] = keyAndValue[1];
          }
          if ('deprecation' in headers) {
            const matches = headers.link && headers.link.match(/<([^>]+)>; rel="deprecation"/);
            const deprecationLink = matches && matches.pop();
            log.warn(
              `[@octokit/request] "${requestOptions.method} ${
                requestOptions.url
              }" is deprecated. It is scheduled to be removed on ${headers.sunset}${
                deprecationLink ? `. See ${deprecationLink}` : ''
              }`
            );
          }
          if (status === 204 || status === 205) {
            return;
          }
          if (requestOptions.method === 'HEAD') {
            if (status < 400) {
              return;
            }
            throw new requestError.RequestError(response.statusText, status, {
              response: {
                url,
                status,
                headers,
                data: void 0
              },
              request: requestOptions
            });
          }
          if (status === 304) {
            throw new requestError.RequestError('Not modified', status, {
              response: {
                url,
                status,
                headers,
                data: await getResponseData(response)
              },
              request: requestOptions
            });
          }
          if (status >= 400) {
            const data = await getResponseData(response);
            const error = new requestError.RequestError(toErrorMessage(data), status, {
              response: {
                url,
                status,
                headers,
                data
              },
              request: requestOptions
            });
            throw error;
          }
          return getResponseData(response);
        })
        .then(data => {
          return {
            status,
            url,
            headers,
            data
          };
        })
        .catch(error => {
          if (error instanceof requestError.RequestError) throw error;
          throw new requestError.RequestError(error.message, 500, {
            request: requestOptions
          });
        });
    }
    async function getResponseData(response) {
      const contentType = response.headers.get('content-type');
      if (/application\/json/.test(contentType)) {
        return response.json();
      }
      if (!contentType || /^text\/|charset=utf-8$/.test(contentType)) {
        return response.text();
      }
      return getBufferResponse(response);
    }
    function toErrorMessage(data) {
      if (typeof data === 'string') return data;
      if ('message' in data) {
        if (Array.isArray(data.errors)) {
          return `${data.message}: ${data.errors.map(JSON.stringify).join(', ')}`;
        }
        return data.message;
      }
      return `Unknown error: ${JSON.stringify(data)}`;
    }
    function withDefaults(oldEndpoint, newDefaults) {
      const endpoint2 = oldEndpoint.defaults(newDefaults);
      const newApi = function (route, parameters) {
        const endpointOptions = endpoint2.merge(route, parameters);
        if (!endpointOptions.request || !endpointOptions.request.hook) {
          return fetchWrapper(endpoint2.parse(endpointOptions));
        }
        const request2 = (route2, parameters2) => {
          return fetchWrapper(endpoint2.parse(endpoint2.merge(route2, parameters2)));
        };
        Object.assign(request2, {
          endpoint: endpoint2,
          defaults: withDefaults.bind(null, endpoint2)
        });
        return endpointOptions.request.hook(request2, endpointOptions);
      };
      return Object.assign(newApi, {
        endpoint: endpoint2,
        defaults: withDefaults.bind(null, endpoint2)
      });
    }
    var request = withDefaults(endpoint.endpoint, {
      headers: {
        'user-agent': `octokit-request.js/${VERSION} ${universalUserAgent.getUserAgent()}`
      }
    });
    exports2.request = request;
  }
});

// node_modules/@octokit/graphql/dist-node/index.js
var require_dist_node6 = __commonJS({
  'node_modules/@octokit/graphql/dist-node/index.js'(exports2) {
    'use strict';
    Object.defineProperty(exports2, '__esModule', { value: true });
    var request = require_dist_node5();
    var universalUserAgent = require_dist_node();
    var VERSION = '4.8.0';
    function _buildMessageForResponseErrors(data) {
      return (
        `Request failed due to following response errors:
` + data.errors.map(e => ` - ${e.message}`).join('\n')
      );
    }
    var GraphqlResponseError = class extends Error {
      constructor(request2, headers, response) {
        super(_buildMessageForResponseErrors(response));
        this.request = request2;
        this.headers = headers;
        this.response = response;
        this.name = 'GraphqlResponseError';
        this.errors = response.errors;
        this.data = response.data;
        if (Error.captureStackTrace) {
          Error.captureStackTrace(this, this.constructor);
        }
      }
    };
    var NON_VARIABLE_OPTIONS = [
      'method',
      'baseUrl',
      'url',
      'headers',
      'request',
      'query',
      'mediaType'
    ];
    var FORBIDDEN_VARIABLE_OPTIONS = ['query', 'method', 'url'];
    var GHES_V3_SUFFIX_REGEX = /\/api\/v3\/?$/;
    function graphql(request2, query, options) {
      if (options) {
        if (typeof query === 'string' && 'query' in options) {
          return Promise.reject(
            new Error(`[@octokit/graphql] "query" cannot be used as variable name`)
          );
        }
        for (const key in options) {
          if (!FORBIDDEN_VARIABLE_OPTIONS.includes(key)) continue;
          return Promise.reject(
            new Error(`[@octokit/graphql] "${key}" cannot be used as variable name`)
          );
        }
      }
      const parsedOptions =
        typeof query === 'string'
          ? Object.assign(
              {
                query
              },
              options
            )
          : query;
      const requestOptions = Object.keys(parsedOptions).reduce((result, key) => {
        if (NON_VARIABLE_OPTIONS.includes(key)) {
          result[key] = parsedOptions[key];
          return result;
        }
        if (!result.variables) {
          result.variables = {};
        }
        result.variables[key] = parsedOptions[key];
        return result;
      }, {});
      const baseUrl = parsedOptions.baseUrl || request2.endpoint.DEFAULTS.baseUrl;
      if (GHES_V3_SUFFIX_REGEX.test(baseUrl)) {
        requestOptions.url = baseUrl.replace(GHES_V3_SUFFIX_REGEX, '/api/graphql');
      }
      return request2(requestOptions).then(response => {
        if (response.data.errors) {
          const headers = {};
          for (const key of Object.keys(response.headers)) {
            headers[key] = response.headers[key];
          }
          throw new GraphqlResponseError(requestOptions, headers, response.data);
        }
        return response.data.data;
      });
    }
    function withDefaults(request$1, newDefaults) {
      const newRequest = request$1.defaults(newDefaults);
      const newApi = (query, options) => {
        return graphql(newRequest, query, options);
      };
      return Object.assign(newApi, {
        defaults: withDefaults.bind(null, newRequest),
        endpoint: request.request.endpoint
      });
    }
    var graphql$1 = withDefaults(request.request, {
      headers: {
        'user-agent': `octokit-graphql.js/${VERSION} ${universalUserAgent.getUserAgent()}`
      },
      method: 'POST',
      url: '/graphql'
    });
    function withCustomRequest(customRequest) {
      return withDefaults(customRequest, {
        method: 'POST',
        url: '/graphql'
      });
    }
    exports2.GraphqlResponseError = GraphqlResponseError;
    exports2.graphql = graphql$1;
    exports2.withCustomRequest = withCustomRequest;
  }
});

// node_modules/@octokit/auth-token/dist-node/index.js
var require_dist_node7 = __commonJS({
  'node_modules/@octokit/auth-token/dist-node/index.js'(exports2) {
    'use strict';
    Object.defineProperty(exports2, '__esModule', { value: true });
    async function auth(token2) {
      const tokenType =
        token2.split(/\./).length === 3 ? 'app' : /^v\d+\./.test(token2) ? 'installation' : 'oauth';
      return {
        type: 'token',
        token: token2,
        tokenType
      };
    }
    function withAuthorizationPrefix(token2) {
      if (token2.split(/\./).length === 3) {
        return `bearer ${token2}`;
      }
      return `token ${token2}`;
    }
    async function hook(token2, request, route, parameters) {
      const endpoint = request.endpoint.merge(route, parameters);
      endpoint.headers.authorization = withAuthorizationPrefix(token2);
      return request(endpoint);
    }
    var createTokenAuth = function createTokenAuth2(token2) {
      if (!token2) {
        throw new Error('[@octokit/auth-token] No token passed to createTokenAuth');
      }
      if (typeof token2 !== 'string') {
        throw new Error('[@octokit/auth-token] Token passed to createTokenAuth is not a string');
      }
      token2 = token2.replace(/^(token|bearer) +/i, '');
      return Object.assign(auth.bind(null, token2), {
        hook: hook.bind(null, token2)
      });
    };
    exports2.createTokenAuth = createTokenAuth;
  }
});

// node_modules/@octokit/core/dist-node/index.js
var require_dist_node8 = __commonJS({
  'node_modules/@octokit/core/dist-node/index.js'(exports2) {
    'use strict';
    Object.defineProperty(exports2, '__esModule', { value: true });
    var universalUserAgent = require_dist_node();
    var beforeAfterHook = require_before_after_hook();
    var request = require_dist_node5();
    var graphql = require_dist_node6();
    var authToken = require_dist_node7();
    function _objectWithoutPropertiesLoose(source, excluded) {
      if (source == null) return {};
      var target = {};
      var sourceKeys = Object.keys(source);
      var key, i;
      for (i = 0; i < sourceKeys.length; i++) {
        key = sourceKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        target[key] = source[key];
      }
      return target;
    }
    function _objectWithoutProperties(source, excluded) {
      if (source == null) return {};
      var target = _objectWithoutPropertiesLoose(source, excluded);
      var key, i;
      if (Object.getOwnPropertySymbols) {
        var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
        for (i = 0; i < sourceSymbolKeys.length; i++) {
          key = sourceSymbolKeys[i];
          if (excluded.indexOf(key) >= 0) continue;
          if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
          target[key] = source[key];
        }
      }
      return target;
    }
    var VERSION = '3.5.1';
    var _excluded = ['authStrategy'];
    var Octokit = class {
      constructor(options = {}) {
        const hook = new beforeAfterHook.Collection();
        const requestDefaults = {
          baseUrl: request.request.endpoint.DEFAULTS.baseUrl,
          headers: {},
          request: Object.assign({}, options.request, {
            hook: hook.bind(null, 'request')
          }),
          mediaType: {
            previews: [],
            format: ''
          }
        };
        requestDefaults.headers['user-agent'] = [
          options.userAgent,
          `octokit-core.js/${VERSION} ${universalUserAgent.getUserAgent()}`
        ]
          .filter(Boolean)
          .join(' ');
        if (options.baseUrl) {
          requestDefaults.baseUrl = options.baseUrl;
        }
        if (options.previews) {
          requestDefaults.mediaType.previews = options.previews;
        }
        if (options.timeZone) {
          requestDefaults.headers['time-zone'] = options.timeZone;
        }
        this.request = request.request.defaults(requestDefaults);
        this.graphql = graphql.withCustomRequest(this.request).defaults(requestDefaults);
        this.log = Object.assign(
          {
            debug: () => {},
            info: () => {},
            warn: console.warn.bind(console),
            error: console.error.bind(console)
          },
          options.log
        );
        this.hook = hook;
        if (!options.authStrategy) {
          if (!options.auth) {
            this.auth = async () => ({
              type: 'unauthenticated'
            });
          } else {
            const auth = authToken.createTokenAuth(options.auth);
            hook.wrap('request', auth.hook);
            this.auth = auth;
          }
        } else {
          const { authStrategy } = options,
            otherOptions = _objectWithoutProperties(options, _excluded);
          const auth = authStrategy(
            Object.assign(
              {
                request: this.request,
                log: this.log,
                octokit: this,
                octokitOptions: otherOptions
              },
              options.auth
            )
          );
          hook.wrap('request', auth.hook);
          this.auth = auth;
        }
        const classConstructor = this.constructor;
        classConstructor.plugins.forEach(plugin => {
          Object.assign(this, plugin(this, options));
        });
      }
      static defaults(defaults) {
        const OctokitWithDefaults = class extends this {
          constructor(...args) {
            const options = args[0] || {};
            if (typeof defaults === 'function') {
              super(defaults(options));
              return;
            }
            super(
              Object.assign(
                {},
                defaults,
                options,
                options.userAgent && defaults.userAgent
                  ? {
                      userAgent: `${options.userAgent} ${defaults.userAgent}`
                    }
                  : null
              )
            );
          }
        };
        return OctokitWithDefaults;
      }
      static plugin(...newPlugins) {
        var _a;
        const currentPlugins = this.plugins;
        const NewOctokit =
          ((_a = class extends this {}),
          (_a.plugins = currentPlugins.concat(
            newPlugins.filter(plugin => !currentPlugins.includes(plugin))
          )),
          _a);
        return NewOctokit;
      }
    };
    Octokit.VERSION = VERSION;
    Octokit.plugins = [];
    exports2.Octokit = Octokit;
  }
});

// node_modules/@octokit/plugin-rest-endpoint-methods/dist-node/index.js
var require_dist_node9 = __commonJS({
  'node_modules/@octokit/plugin-rest-endpoint-methods/dist-node/index.js'(exports2) {
    'use strict';
    Object.defineProperty(exports2, '__esModule', { value: true });
    function ownKeys(object, enumerableOnly) {
      var keys = Object.keys(object);
      if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly) {
          symbols = symbols.filter(function (sym) {
            return Object.getOwnPropertyDescriptor(object, sym).enumerable;
          });
        }
        keys.push.apply(keys, symbols);
      }
      return keys;
    }
    function _objectSpread2(target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i] != null ? arguments[i] : {};
        if (i % 2) {
          ownKeys(Object(source), true).forEach(function (key) {
            _defineProperty(target, key, source[key]);
          });
        } else if (Object.getOwnPropertyDescriptors) {
          Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
        } else {
          ownKeys(Object(source)).forEach(function (key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
          });
        }
      }
      return target;
    }
    function _defineProperty(obj, key, value) {
      if (key in obj) {
        Object.defineProperty(obj, key, {
          value,
          enumerable: true,
          configurable: true,
          writable: true
        });
      } else {
        obj[key] = value;
      }
      return obj;
    }
    var Endpoints = {
      actions: {
        addSelectedRepoToOrgSecret: [
          'PUT /orgs/{org}/actions/secrets/{secret_name}/repositories/{repository_id}'
        ],
        approveWorkflowRun: ['POST /repos/{owner}/{repo}/actions/runs/{run_id}/approve'],
        cancelWorkflowRun: ['POST /repos/{owner}/{repo}/actions/runs/{run_id}/cancel'],
        createOrUpdateEnvironmentSecret: [
          'PUT /repositories/{repository_id}/environments/{environment_name}/secrets/{secret_name}'
        ],
        createOrUpdateOrgSecret: ['PUT /orgs/{org}/actions/secrets/{secret_name}'],
        createOrUpdateRepoSecret: ['PUT /repos/{owner}/{repo}/actions/secrets/{secret_name}'],
        createRegistrationTokenForOrg: ['POST /orgs/{org}/actions/runners/registration-token'],
        createRegistrationTokenForRepo: [
          'POST /repos/{owner}/{repo}/actions/runners/registration-token'
        ],
        createRemoveTokenForOrg: ['POST /orgs/{org}/actions/runners/remove-token'],
        createRemoveTokenForRepo: ['POST /repos/{owner}/{repo}/actions/runners/remove-token'],
        createWorkflowDispatch: [
          'POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches'
        ],
        deleteArtifact: ['DELETE /repos/{owner}/{repo}/actions/artifacts/{artifact_id}'],
        deleteEnvironmentSecret: [
          'DELETE /repositories/{repository_id}/environments/{environment_name}/secrets/{secret_name}'
        ],
        deleteOrgSecret: ['DELETE /orgs/{org}/actions/secrets/{secret_name}'],
        deleteRepoSecret: ['DELETE /repos/{owner}/{repo}/actions/secrets/{secret_name}'],
        deleteSelfHostedRunnerFromOrg: ['DELETE /orgs/{org}/actions/runners/{runner_id}'],
        deleteSelfHostedRunnerFromRepo: [
          'DELETE /repos/{owner}/{repo}/actions/runners/{runner_id}'
        ],
        deleteWorkflowRun: ['DELETE /repos/{owner}/{repo}/actions/runs/{run_id}'],
        deleteWorkflowRunLogs: ['DELETE /repos/{owner}/{repo}/actions/runs/{run_id}/logs'],
        disableSelectedRepositoryGithubActionsOrganization: [
          'DELETE /orgs/{org}/actions/permissions/repositories/{repository_id}'
        ],
        disableWorkflow: ['PUT /repos/{owner}/{repo}/actions/workflows/{workflow_id}/disable'],
        downloadArtifact: [
          'GET /repos/{owner}/{repo}/actions/artifacts/{artifact_id}/{archive_format}'
        ],
        downloadJobLogsForWorkflowRun: ['GET /repos/{owner}/{repo}/actions/jobs/{job_id}/logs'],
        downloadWorkflowRunLogs: ['GET /repos/{owner}/{repo}/actions/runs/{run_id}/logs'],
        enableSelectedRepositoryGithubActionsOrganization: [
          'PUT /orgs/{org}/actions/permissions/repositories/{repository_id}'
        ],
        enableWorkflow: ['PUT /repos/{owner}/{repo}/actions/workflows/{workflow_id}/enable'],
        getAllowedActionsOrganization: ['GET /orgs/{org}/actions/permissions/selected-actions'],
        getAllowedActionsRepository: [
          'GET /repos/{owner}/{repo}/actions/permissions/selected-actions'
        ],
        getArtifact: ['GET /repos/{owner}/{repo}/actions/artifacts/{artifact_id}'],
        getEnvironmentPublicKey: [
          'GET /repositories/{repository_id}/environments/{environment_name}/secrets/public-key'
        ],
        getEnvironmentSecret: [
          'GET /repositories/{repository_id}/environments/{environment_name}/secrets/{secret_name}'
        ],
        getGithubActionsPermissionsOrganization: ['GET /orgs/{org}/actions/permissions'],
        getGithubActionsPermissionsRepository: ['GET /repos/{owner}/{repo}/actions/permissions'],
        getJobForWorkflowRun: ['GET /repos/{owner}/{repo}/actions/jobs/{job_id}'],
        getOrgPublicKey: ['GET /orgs/{org}/actions/secrets/public-key'],
        getOrgSecret: ['GET /orgs/{org}/actions/secrets/{secret_name}'],
        getPendingDeploymentsForRun: [
          'GET /repos/{owner}/{repo}/actions/runs/{run_id}/pending_deployments'
        ],
        getRepoPermissions: [
          'GET /repos/{owner}/{repo}/actions/permissions',
          {},
          {
            renamed: ['actions', 'getGithubActionsPermissionsRepository']
          }
        ],
        getRepoPublicKey: ['GET /repos/{owner}/{repo}/actions/secrets/public-key'],
        getRepoSecret: ['GET /repos/{owner}/{repo}/actions/secrets/{secret_name}'],
        getReviewsForRun: ['GET /repos/{owner}/{repo}/actions/runs/{run_id}/approvals'],
        getSelfHostedRunnerForOrg: ['GET /orgs/{org}/actions/runners/{runner_id}'],
        getSelfHostedRunnerForRepo: ['GET /repos/{owner}/{repo}/actions/runners/{runner_id}'],
        getWorkflow: ['GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}'],
        getWorkflowRun: ['GET /repos/{owner}/{repo}/actions/runs/{run_id}'],
        getWorkflowRunUsage: ['GET /repos/{owner}/{repo}/actions/runs/{run_id}/timing'],
        getWorkflowUsage: ['GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/timing'],
        listArtifactsForRepo: ['GET /repos/{owner}/{repo}/actions/artifacts'],
        listEnvironmentSecrets: [
          'GET /repositories/{repository_id}/environments/{environment_name}/secrets'
        ],
        listJobsForWorkflowRun: ['GET /repos/{owner}/{repo}/actions/runs/{run_id}/jobs'],
        listOrgSecrets: ['GET /orgs/{org}/actions/secrets'],
        listRepoSecrets: ['GET /repos/{owner}/{repo}/actions/secrets'],
        listRepoWorkflows: ['GET /repos/{owner}/{repo}/actions/workflows'],
        listRunnerApplicationsForOrg: ['GET /orgs/{org}/actions/runners/downloads'],
        listRunnerApplicationsForRepo: ['GET /repos/{owner}/{repo}/actions/runners/downloads'],
        listSelectedReposForOrgSecret: [
          'GET /orgs/{org}/actions/secrets/{secret_name}/repositories'
        ],
        listSelectedRepositoriesEnabledGithubActionsOrganization: [
          'GET /orgs/{org}/actions/permissions/repositories'
        ],
        listSelfHostedRunnersForOrg: ['GET /orgs/{org}/actions/runners'],
        listSelfHostedRunnersForRepo: ['GET /repos/{owner}/{repo}/actions/runners'],
        listWorkflowRunArtifacts: ['GET /repos/{owner}/{repo}/actions/runs/{run_id}/artifacts'],
        listWorkflowRuns: ['GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/runs'],
        listWorkflowRunsForRepo: ['GET /repos/{owner}/{repo}/actions/runs'],
        reRunWorkflow: ['POST /repos/{owner}/{repo}/actions/runs/{run_id}/rerun'],
        removeSelectedRepoFromOrgSecret: [
          'DELETE /orgs/{org}/actions/secrets/{secret_name}/repositories/{repository_id}'
        ],
        reviewPendingDeploymentsForRun: [
          'POST /repos/{owner}/{repo}/actions/runs/{run_id}/pending_deployments'
        ],
        setAllowedActionsOrganization: ['PUT /orgs/{org}/actions/permissions/selected-actions'],
        setAllowedActionsRepository: [
          'PUT /repos/{owner}/{repo}/actions/permissions/selected-actions'
        ],
        setGithubActionsPermissionsOrganization: ['PUT /orgs/{org}/actions/permissions'],
        setGithubActionsPermissionsRepository: ['PUT /repos/{owner}/{repo}/actions/permissions'],
        setSelectedReposForOrgSecret: [
          'PUT /orgs/{org}/actions/secrets/{secret_name}/repositories'
        ],
        setSelectedRepositoriesEnabledGithubActionsOrganization: [
          'PUT /orgs/{org}/actions/permissions/repositories'
        ]
      },
      activity: {
        checkRepoIsStarredByAuthenticatedUser: ['GET /user/starred/{owner}/{repo}'],
        deleteRepoSubscription: ['DELETE /repos/{owner}/{repo}/subscription'],
        deleteThreadSubscription: ['DELETE /notifications/threads/{thread_id}/subscription'],
        getFeeds: ['GET /feeds'],
        getRepoSubscription: ['GET /repos/{owner}/{repo}/subscription'],
        getThread: ['GET /notifications/threads/{thread_id}'],
        getThreadSubscriptionForAuthenticatedUser: [
          'GET /notifications/threads/{thread_id}/subscription'
        ],
        listEventsForAuthenticatedUser: ['GET /users/{username}/events'],
        listNotificationsForAuthenticatedUser: ['GET /notifications'],
        listOrgEventsForAuthenticatedUser: ['GET /users/{username}/events/orgs/{org}'],
        listPublicEvents: ['GET /events'],
        listPublicEventsForRepoNetwork: ['GET /networks/{owner}/{repo}/events'],
        listPublicEventsForUser: ['GET /users/{username}/events/public'],
        listPublicOrgEvents: ['GET /orgs/{org}/events'],
        listReceivedEventsForUser: ['GET /users/{username}/received_events'],
        listReceivedPublicEventsForUser: ['GET /users/{username}/received_events/public'],
        listRepoEvents: ['GET /repos/{owner}/{repo}/events'],
        listRepoNotificationsForAuthenticatedUser: ['GET /repos/{owner}/{repo}/notifications'],
        listReposStarredByAuthenticatedUser: ['GET /user/starred'],
        listReposStarredByUser: ['GET /users/{username}/starred'],
        listReposWatchedByUser: ['GET /users/{username}/subscriptions'],
        listStargazersForRepo: ['GET /repos/{owner}/{repo}/stargazers'],
        listWatchedReposForAuthenticatedUser: ['GET /user/subscriptions'],
        listWatchersForRepo: ['GET /repos/{owner}/{repo}/subscribers'],
        markNotificationsAsRead: ['PUT /notifications'],
        markRepoNotificationsAsRead: ['PUT /repos/{owner}/{repo}/notifications'],
        markThreadAsRead: ['PATCH /notifications/threads/{thread_id}'],
        setRepoSubscription: ['PUT /repos/{owner}/{repo}/subscription'],
        setThreadSubscription: ['PUT /notifications/threads/{thread_id}/subscription'],
        starRepoForAuthenticatedUser: ['PUT /user/starred/{owner}/{repo}'],
        unstarRepoForAuthenticatedUser: ['DELETE /user/starred/{owner}/{repo}']
      },
      apps: {
        addRepoToInstallation: [
          'PUT /user/installations/{installation_id}/repositories/{repository_id}'
        ],
        checkToken: ['POST /applications/{client_id}/token'],
        createContentAttachment: [
          'POST /content_references/{content_reference_id}/attachments',
          {
            mediaType: {
              previews: ['corsair']
            }
          }
        ],
        createContentAttachmentForRepo: [
          'POST /repos/{owner}/{repo}/content_references/{content_reference_id}/attachments',
          {
            mediaType: {
              previews: ['corsair']
            }
          }
        ],
        createFromManifest: ['POST /app-manifests/{code}/conversions'],
        createInstallationAccessToken: ['POST /app/installations/{installation_id}/access_tokens'],
        deleteAuthorization: ['DELETE /applications/{client_id}/grant'],
        deleteInstallation: ['DELETE /app/installations/{installation_id}'],
        deleteToken: ['DELETE /applications/{client_id}/token'],
        getAuthenticated: ['GET /app'],
        getBySlug: ['GET /apps/{app_slug}'],
        getInstallation: ['GET /app/installations/{installation_id}'],
        getOrgInstallation: ['GET /orgs/{org}/installation'],
        getRepoInstallation: ['GET /repos/{owner}/{repo}/installation'],
        getSubscriptionPlanForAccount: ['GET /marketplace_listing/accounts/{account_id}'],
        getSubscriptionPlanForAccountStubbed: [
          'GET /marketplace_listing/stubbed/accounts/{account_id}'
        ],
        getUserInstallation: ['GET /users/{username}/installation'],
        getWebhookConfigForApp: ['GET /app/hook/config'],
        getWebhookDelivery: ['GET /app/hook/deliveries/{delivery_id}'],
        listAccountsForPlan: ['GET /marketplace_listing/plans/{plan_id}/accounts'],
        listAccountsForPlanStubbed: ['GET /marketplace_listing/stubbed/plans/{plan_id}/accounts'],
        listInstallationReposForAuthenticatedUser: [
          'GET /user/installations/{installation_id}/repositories'
        ],
        listInstallations: ['GET /app/installations'],
        listInstallationsForAuthenticatedUser: ['GET /user/installations'],
        listPlans: ['GET /marketplace_listing/plans'],
        listPlansStubbed: ['GET /marketplace_listing/stubbed/plans'],
        listReposAccessibleToInstallation: ['GET /installation/repositories'],
        listSubscriptionsForAuthenticatedUser: ['GET /user/marketplace_purchases'],
        listSubscriptionsForAuthenticatedUserStubbed: ['GET /user/marketplace_purchases/stubbed'],
        listWebhookDeliveries: ['GET /app/hook/deliveries'],
        redeliverWebhookDelivery: ['POST /app/hook/deliveries/{delivery_id}/attempts'],
        removeRepoFromInstallation: [
          'DELETE /user/installations/{installation_id}/repositories/{repository_id}'
        ],
        resetToken: ['PATCH /applications/{client_id}/token'],
        revokeInstallationAccessToken: ['DELETE /installation/token'],
        scopeToken: ['POST /applications/{client_id}/token/scoped'],
        suspendInstallation: ['PUT /app/installations/{installation_id}/suspended'],
        unsuspendInstallation: ['DELETE /app/installations/{installation_id}/suspended'],
        updateWebhookConfigForApp: ['PATCH /app/hook/config']
      },
      billing: {
        getGithubActionsBillingOrg: ['GET /orgs/{org}/settings/billing/actions'],
        getGithubActionsBillingUser: ['GET /users/{username}/settings/billing/actions'],
        getGithubPackagesBillingOrg: ['GET /orgs/{org}/settings/billing/packages'],
        getGithubPackagesBillingUser: ['GET /users/{username}/settings/billing/packages'],
        getSharedStorageBillingOrg: ['GET /orgs/{org}/settings/billing/shared-storage'],
        getSharedStorageBillingUser: ['GET /users/{username}/settings/billing/shared-storage']
      },
      checks: {
        create: ['POST /repos/{owner}/{repo}/check-runs'],
        createSuite: ['POST /repos/{owner}/{repo}/check-suites'],
        get: ['GET /repos/{owner}/{repo}/check-runs/{check_run_id}'],
        getSuite: ['GET /repos/{owner}/{repo}/check-suites/{check_suite_id}'],
        listAnnotations: ['GET /repos/{owner}/{repo}/check-runs/{check_run_id}/annotations'],
        listForRef: ['GET /repos/{owner}/{repo}/commits/{ref}/check-runs'],
        listForSuite: ['GET /repos/{owner}/{repo}/check-suites/{check_suite_id}/check-runs'],
        listSuitesForRef: ['GET /repos/{owner}/{repo}/commits/{ref}/check-suites'],
        rerequestSuite: ['POST /repos/{owner}/{repo}/check-suites/{check_suite_id}/rerequest'],
        setSuitesPreferences: ['PATCH /repos/{owner}/{repo}/check-suites/preferences'],
        update: ['PATCH /repos/{owner}/{repo}/check-runs/{check_run_id}']
      },
      codeScanning: {
        deleteAnalysis: [
          'DELETE /repos/{owner}/{repo}/code-scanning/analyses/{analysis_id}{?confirm_delete}'
        ],
        getAlert: [
          'GET /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}',
          {},
          {
            renamedParameters: {
              alert_id: 'alert_number'
            }
          }
        ],
        getAnalysis: ['GET /repos/{owner}/{repo}/code-scanning/analyses/{analysis_id}'],
        getSarif: ['GET /repos/{owner}/{repo}/code-scanning/sarifs/{sarif_id}'],
        listAlertInstances: [
          'GET /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}/instances'
        ],
        listAlertsForRepo: ['GET /repos/{owner}/{repo}/code-scanning/alerts'],
        listAlertsInstances: [
          'GET /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}/instances',
          {},
          {
            renamed: ['codeScanning', 'listAlertInstances']
          }
        ],
        listRecentAnalyses: ['GET /repos/{owner}/{repo}/code-scanning/analyses'],
        updateAlert: ['PATCH /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}'],
        uploadSarif: ['POST /repos/{owner}/{repo}/code-scanning/sarifs']
      },
      codesOfConduct: {
        getAllCodesOfConduct: ['GET /codes_of_conduct'],
        getConductCode: ['GET /codes_of_conduct/{key}'],
        getForRepo: [
          'GET /repos/{owner}/{repo}/community/code_of_conduct',
          {
            mediaType: {
              previews: ['scarlet-witch']
            }
          }
        ]
      },
      emojis: {
        get: ['GET /emojis']
      },
      enterpriseAdmin: {
        disableSelectedOrganizationGithubActionsEnterprise: [
          'DELETE /enterprises/{enterprise}/actions/permissions/organizations/{org_id}'
        ],
        enableSelectedOrganizationGithubActionsEnterprise: [
          'PUT /enterprises/{enterprise}/actions/permissions/organizations/{org_id}'
        ],
        getAllowedActionsEnterprise: [
          'GET /enterprises/{enterprise}/actions/permissions/selected-actions'
        ],
        getGithubActionsPermissionsEnterprise: [
          'GET /enterprises/{enterprise}/actions/permissions'
        ],
        listSelectedOrganizationsEnabledGithubActionsEnterprise: [
          'GET /enterprises/{enterprise}/actions/permissions/organizations'
        ],
        setAllowedActionsEnterprise: [
          'PUT /enterprises/{enterprise}/actions/permissions/selected-actions'
        ],
        setGithubActionsPermissionsEnterprise: [
          'PUT /enterprises/{enterprise}/actions/permissions'
        ],
        setSelectedOrganizationsEnabledGithubActionsEnterprise: [
          'PUT /enterprises/{enterprise}/actions/permissions/organizations'
        ]
      },
      gists: {
        checkIsStarred: ['GET /gists/{gist_id}/star'],
        create: ['POST /gists'],
        createComment: ['POST /gists/{gist_id}/comments'],
        delete: ['DELETE /gists/{gist_id}'],
        deleteComment: ['DELETE /gists/{gist_id}/comments/{comment_id}'],
        fork: ['POST /gists/{gist_id}/forks'],
        get: ['GET /gists/{gist_id}'],
        getComment: ['GET /gists/{gist_id}/comments/{comment_id}'],
        getRevision: ['GET /gists/{gist_id}/{sha}'],
        list: ['GET /gists'],
        listComments: ['GET /gists/{gist_id}/comments'],
        listCommits: ['GET /gists/{gist_id}/commits'],
        listForUser: ['GET /users/{username}/gists'],
        listForks: ['GET /gists/{gist_id}/forks'],
        listPublic: ['GET /gists/public'],
        listStarred: ['GET /gists/starred'],
        star: ['PUT /gists/{gist_id}/star'],
        unstar: ['DELETE /gists/{gist_id}/star'],
        update: ['PATCH /gists/{gist_id}'],
        updateComment: ['PATCH /gists/{gist_id}/comments/{comment_id}']
      },
      git: {
        createBlob: ['POST /repos/{owner}/{repo}/git/blobs'],
        createCommit: ['POST /repos/{owner}/{repo}/git/commits'],
        createRef: ['POST /repos/{owner}/{repo}/git/refs'],
        createTag: ['POST /repos/{owner}/{repo}/git/tags'],
        createTree: ['POST /repos/{owner}/{repo}/git/trees'],
        deleteRef: ['DELETE /repos/{owner}/{repo}/git/refs/{ref}'],
        getBlob: ['GET /repos/{owner}/{repo}/git/blobs/{file_sha}'],
        getCommit: ['GET /repos/{owner}/{repo}/git/commits/{commit_sha}'],
        getRef: ['GET /repos/{owner}/{repo}/git/ref/{ref}'],
        getTag: ['GET /repos/{owner}/{repo}/git/tags/{tag_sha}'],
        getTree: ['GET /repos/{owner}/{repo}/git/trees/{tree_sha}'],
        listMatchingRefs: ['GET /repos/{owner}/{repo}/git/matching-refs/{ref}'],
        updateRef: ['PATCH /repos/{owner}/{repo}/git/refs/{ref}']
      },
      gitignore: {
        getAllTemplates: ['GET /gitignore/templates'],
        getTemplate: ['GET /gitignore/templates/{name}']
      },
      interactions: {
        getRestrictionsForAuthenticatedUser: ['GET /user/interaction-limits'],
        getRestrictionsForOrg: ['GET /orgs/{org}/interaction-limits'],
        getRestrictionsForRepo: ['GET /repos/{owner}/{repo}/interaction-limits'],
        getRestrictionsForYourPublicRepos: [
          'GET /user/interaction-limits',
          {},
          {
            renamed: ['interactions', 'getRestrictionsForAuthenticatedUser']
          }
        ],
        removeRestrictionsForAuthenticatedUser: ['DELETE /user/interaction-limits'],
        removeRestrictionsForOrg: ['DELETE /orgs/{org}/interaction-limits'],
        removeRestrictionsForRepo: ['DELETE /repos/{owner}/{repo}/interaction-limits'],
        removeRestrictionsForYourPublicRepos: [
          'DELETE /user/interaction-limits',
          {},
          {
            renamed: ['interactions', 'removeRestrictionsForAuthenticatedUser']
          }
        ],
        setRestrictionsForAuthenticatedUser: ['PUT /user/interaction-limits'],
        setRestrictionsForOrg: ['PUT /orgs/{org}/interaction-limits'],
        setRestrictionsForRepo: ['PUT /repos/{owner}/{repo}/interaction-limits'],
        setRestrictionsForYourPublicRepos: [
          'PUT /user/interaction-limits',
          {},
          {
            renamed: ['interactions', 'setRestrictionsForAuthenticatedUser']
          }
        ]
      },
      issues: {
        addAssignees: ['POST /repos/{owner}/{repo}/issues/{issue_number}/assignees'],
        addLabels: ['POST /repos/{owner}/{repo}/issues/{issue_number}/labels'],
        checkUserCanBeAssigned: ['GET /repos/{owner}/{repo}/assignees/{assignee}'],
        create: ['POST /repos/{owner}/{repo}/issues'],
        createComment: ['POST /repos/{owner}/{repo}/issues/{issue_number}/comments'],
        createLabel: ['POST /repos/{owner}/{repo}/labels'],
        createMilestone: ['POST /repos/{owner}/{repo}/milestones'],
        deleteComment: ['DELETE /repos/{owner}/{repo}/issues/comments/{comment_id}'],
        deleteLabel: ['DELETE /repos/{owner}/{repo}/labels/{name}'],
        deleteMilestone: ['DELETE /repos/{owner}/{repo}/milestones/{milestone_number}'],
        get: ['GET /repos/{owner}/{repo}/issues/{issue_number}'],
        getComment: ['GET /repos/{owner}/{repo}/issues/comments/{comment_id}'],
        getEvent: ['GET /repos/{owner}/{repo}/issues/events/{event_id}'],
        getLabel: ['GET /repos/{owner}/{repo}/labels/{name}'],
        getMilestone: ['GET /repos/{owner}/{repo}/milestones/{milestone_number}'],
        list: ['GET /issues'],
        listAssignees: ['GET /repos/{owner}/{repo}/assignees'],
        listComments: ['GET /repos/{owner}/{repo}/issues/{issue_number}/comments'],
        listCommentsForRepo: ['GET /repos/{owner}/{repo}/issues/comments'],
        listEvents: ['GET /repos/{owner}/{repo}/issues/{issue_number}/events'],
        listEventsForRepo: ['GET /repos/{owner}/{repo}/issues/events'],
        listEventsForTimeline: [
          'GET /repos/{owner}/{repo}/issues/{issue_number}/timeline',
          {
            mediaType: {
              previews: ['mockingbird']
            }
          }
        ],
        listForAuthenticatedUser: ['GET /user/issues'],
        listForOrg: ['GET /orgs/{org}/issues'],
        listForRepo: ['GET /repos/{owner}/{repo}/issues'],
        listLabelsForMilestone: ['GET /repos/{owner}/{repo}/milestones/{milestone_number}/labels'],
        listLabelsForRepo: ['GET /repos/{owner}/{repo}/labels'],
        listLabelsOnIssue: ['GET /repos/{owner}/{repo}/issues/{issue_number}/labels'],
        listMilestones: ['GET /repos/{owner}/{repo}/milestones'],
        lock: ['PUT /repos/{owner}/{repo}/issues/{issue_number}/lock'],
        removeAllLabels: ['DELETE /repos/{owner}/{repo}/issues/{issue_number}/labels'],
        removeAssignees: ['DELETE /repos/{owner}/{repo}/issues/{issue_number}/assignees'],
        removeLabel: ['DELETE /repos/{owner}/{repo}/issues/{issue_number}/labels/{name}'],
        setLabels: ['PUT /repos/{owner}/{repo}/issues/{issue_number}/labels'],
        unlock: ['DELETE /repos/{owner}/{repo}/issues/{issue_number}/lock'],
        update: ['PATCH /repos/{owner}/{repo}/issues/{issue_number}'],
        updateComment: ['PATCH /repos/{owner}/{repo}/issues/comments/{comment_id}'],
        updateLabel: ['PATCH /repos/{owner}/{repo}/labels/{name}'],
        updateMilestone: ['PATCH /repos/{owner}/{repo}/milestones/{milestone_number}']
      },
      licenses: {
        get: ['GET /licenses/{license}'],
        getAllCommonlyUsed: ['GET /licenses'],
        getForRepo: ['GET /repos/{owner}/{repo}/license']
      },
      markdown: {
        render: ['POST /markdown'],
        renderRaw: [
          'POST /markdown/raw',
          {
            headers: {
              'content-type': 'text/plain; charset=utf-8'
            }
          }
        ]
      },
      meta: {
        get: ['GET /meta'],
        getOctocat: ['GET /octocat'],
        getZen: ['GET /zen'],
        root: ['GET /']
      },
      migrations: {
        cancelImport: ['DELETE /repos/{owner}/{repo}/import'],
        deleteArchiveForAuthenticatedUser: [
          'DELETE /user/migrations/{migration_id}/archive',
          {
            mediaType: {
              previews: ['wyandotte']
            }
          }
        ],
        deleteArchiveForOrg: [
          'DELETE /orgs/{org}/migrations/{migration_id}/archive',
          {
            mediaType: {
              previews: ['wyandotte']
            }
          }
        ],
        downloadArchiveForOrg: [
          'GET /orgs/{org}/migrations/{migration_id}/archive',
          {
            mediaType: {
              previews: ['wyandotte']
            }
          }
        ],
        getArchiveForAuthenticatedUser: [
          'GET /user/migrations/{migration_id}/archive',
          {
            mediaType: {
              previews: ['wyandotte']
            }
          }
        ],
        getCommitAuthors: ['GET /repos/{owner}/{repo}/import/authors'],
        getImportStatus: ['GET /repos/{owner}/{repo}/import'],
        getLargeFiles: ['GET /repos/{owner}/{repo}/import/large_files'],
        getStatusForAuthenticatedUser: [
          'GET /user/migrations/{migration_id}',
          {
            mediaType: {
              previews: ['wyandotte']
            }
          }
        ],
        getStatusForOrg: [
          'GET /orgs/{org}/migrations/{migration_id}',
          {
            mediaType: {
              previews: ['wyandotte']
            }
          }
        ],
        listForAuthenticatedUser: [
          'GET /user/migrations',
          {
            mediaType: {
              previews: ['wyandotte']
            }
          }
        ],
        listForOrg: [
          'GET /orgs/{org}/migrations',
          {
            mediaType: {
              previews: ['wyandotte']
            }
          }
        ],
        listReposForOrg: [
          'GET /orgs/{org}/migrations/{migration_id}/repositories',
          {
            mediaType: {
              previews: ['wyandotte']
            }
          }
        ],
        listReposForUser: [
          'GET /user/migrations/{migration_id}/repositories',
          {
            mediaType: {
              previews: ['wyandotte']
            }
          }
        ],
        mapCommitAuthor: ['PATCH /repos/{owner}/{repo}/import/authors/{author_id}'],
        setLfsPreference: ['PATCH /repos/{owner}/{repo}/import/lfs'],
        startForAuthenticatedUser: ['POST /user/migrations'],
        startForOrg: ['POST /orgs/{org}/migrations'],
        startImport: ['PUT /repos/{owner}/{repo}/import'],
        unlockRepoForAuthenticatedUser: [
          'DELETE /user/migrations/{migration_id}/repos/{repo_name}/lock',
          {
            mediaType: {
              previews: ['wyandotte']
            }
          }
        ],
        unlockRepoForOrg: [
          'DELETE /orgs/{org}/migrations/{migration_id}/repos/{repo_name}/lock',
          {
            mediaType: {
              previews: ['wyandotte']
            }
          }
        ],
        updateImport: ['PATCH /repos/{owner}/{repo}/import']
      },
      orgs: {
        blockUser: ['PUT /orgs/{org}/blocks/{username}'],
        cancelInvitation: ['DELETE /orgs/{org}/invitations/{invitation_id}'],
        checkBlockedUser: ['GET /orgs/{org}/blocks/{username}'],
        checkMembershipForUser: ['GET /orgs/{org}/members/{username}'],
        checkPublicMembershipForUser: ['GET /orgs/{org}/public_members/{username}'],
        convertMemberToOutsideCollaborator: ['PUT /orgs/{org}/outside_collaborators/{username}'],
        createInvitation: ['POST /orgs/{org}/invitations'],
        createWebhook: ['POST /orgs/{org}/hooks'],
        deleteWebhook: ['DELETE /orgs/{org}/hooks/{hook_id}'],
        get: ['GET /orgs/{org}'],
        getMembershipForAuthenticatedUser: ['GET /user/memberships/orgs/{org}'],
        getMembershipForUser: ['GET /orgs/{org}/memberships/{username}'],
        getWebhook: ['GET /orgs/{org}/hooks/{hook_id}'],
        getWebhookConfigForOrg: ['GET /orgs/{org}/hooks/{hook_id}/config'],
        getWebhookDelivery: ['GET /orgs/{org}/hooks/{hook_id}/deliveries/{delivery_id}'],
        list: ['GET /organizations'],
        listAppInstallations: ['GET /orgs/{org}/installations'],
        listBlockedUsers: ['GET /orgs/{org}/blocks'],
        listFailedInvitations: ['GET /orgs/{org}/failed_invitations'],
        listForAuthenticatedUser: ['GET /user/orgs'],
        listForUser: ['GET /users/{username}/orgs'],
        listInvitationTeams: ['GET /orgs/{org}/invitations/{invitation_id}/teams'],
        listMembers: ['GET /orgs/{org}/members'],
        listMembershipsForAuthenticatedUser: ['GET /user/memberships/orgs'],
        listOutsideCollaborators: ['GET /orgs/{org}/outside_collaborators'],
        listPendingInvitations: ['GET /orgs/{org}/invitations'],
        listPublicMembers: ['GET /orgs/{org}/public_members'],
        listWebhookDeliveries: ['GET /orgs/{org}/hooks/{hook_id}/deliveries'],
        listWebhooks: ['GET /orgs/{org}/hooks'],
        pingWebhook: ['POST /orgs/{org}/hooks/{hook_id}/pings'],
        redeliverWebhookDelivery: [
          'POST /orgs/{org}/hooks/{hook_id}/deliveries/{delivery_id}/attempts'
        ],
        removeMember: ['DELETE /orgs/{org}/members/{username}'],
        removeMembershipForUser: ['DELETE /orgs/{org}/memberships/{username}'],
        removeOutsideCollaborator: ['DELETE /orgs/{org}/outside_collaborators/{username}'],
        removePublicMembershipForAuthenticatedUser: [
          'DELETE /orgs/{org}/public_members/{username}'
        ],
        setMembershipForUser: ['PUT /orgs/{org}/memberships/{username}'],
        setPublicMembershipForAuthenticatedUser: ['PUT /orgs/{org}/public_members/{username}'],
        unblockUser: ['DELETE /orgs/{org}/blocks/{username}'],
        update: ['PATCH /orgs/{org}'],
        updateMembershipForAuthenticatedUser: ['PATCH /user/memberships/orgs/{org}'],
        updateWebhook: ['PATCH /orgs/{org}/hooks/{hook_id}'],
        updateWebhookConfigForOrg: ['PATCH /orgs/{org}/hooks/{hook_id}/config']
      },
      packages: {
        deletePackageForAuthenticatedUser: ['DELETE /user/packages/{package_type}/{package_name}'],
        deletePackageForOrg: ['DELETE /orgs/{org}/packages/{package_type}/{package_name}'],
        deletePackageForUser: ['DELETE /users/{username}/packages/{package_type}/{package_name}'],
        deletePackageVersionForAuthenticatedUser: [
          'DELETE /user/packages/{package_type}/{package_name}/versions/{package_version_id}'
        ],
        deletePackageVersionForOrg: [
          'DELETE /orgs/{org}/packages/{package_type}/{package_name}/versions/{package_version_id}'
        ],
        deletePackageVersionForUser: [
          'DELETE /users/{username}/packages/{package_type}/{package_name}/versions/{package_version_id}'
        ],
        getAllPackageVersionsForAPackageOwnedByAnOrg: [
          'GET /orgs/{org}/packages/{package_type}/{package_name}/versions',
          {},
          {
            renamed: ['packages', 'getAllPackageVersionsForPackageOwnedByOrg']
          }
        ],
        getAllPackageVersionsForAPackageOwnedByTheAuthenticatedUser: [
          'GET /user/packages/{package_type}/{package_name}/versions',
          {},
          {
            renamed: ['packages', 'getAllPackageVersionsForPackageOwnedByAuthenticatedUser']
          }
        ],
        getAllPackageVersionsForPackageOwnedByAuthenticatedUser: [
          'GET /user/packages/{package_type}/{package_name}/versions'
        ],
        getAllPackageVersionsForPackageOwnedByOrg: [
          'GET /orgs/{org}/packages/{package_type}/{package_name}/versions'
        ],
        getAllPackageVersionsForPackageOwnedByUser: [
          'GET /users/{username}/packages/{package_type}/{package_name}/versions'
        ],
        getPackageForAuthenticatedUser: ['GET /user/packages/{package_type}/{package_name}'],
        getPackageForOrganization: ['GET /orgs/{org}/packages/{package_type}/{package_name}'],
        getPackageForUser: ['GET /users/{username}/packages/{package_type}/{package_name}'],
        getPackageVersionForAuthenticatedUser: [
          'GET /user/packages/{package_type}/{package_name}/versions/{package_version_id}'
        ],
        getPackageVersionForOrganization: [
          'GET /orgs/{org}/packages/{package_type}/{package_name}/versions/{package_version_id}'
        ],
        getPackageVersionForUser: [
          'GET /users/{username}/packages/{package_type}/{package_name}/versions/{package_version_id}'
        ],
        listPackagesForAuthenticatedUser: ['GET /user/packages'],
        listPackagesForOrganization: ['GET /orgs/{org}/packages'],
        listPackagesForUser: ['GET /user/{username}/packages'],
        restorePackageForAuthenticatedUser: [
          'POST /user/packages/{package_type}/{package_name}/restore{?token}'
        ],
        restorePackageForOrg: [
          'POST /orgs/{org}/packages/{package_type}/{package_name}/restore{?token}'
        ],
        restorePackageForUser: [
          'POST /users/{username}/packages/{package_type}/{package_name}/restore{?token}'
        ],
        restorePackageVersionForAuthenticatedUser: [
          'POST /user/packages/{package_type}/{package_name}/versions/{package_version_id}/restore'
        ],
        restorePackageVersionForOrg: [
          'POST /orgs/{org}/packages/{package_type}/{package_name}/versions/{package_version_id}/restore'
        ],
        restorePackageVersionForUser: [
          'POST /users/{username}/packages/{package_type}/{package_name}/versions/{package_version_id}/restore'
        ]
      },
      projects: {
        addCollaborator: [
          'PUT /projects/{project_id}/collaborators/{username}',
          {
            mediaType: {
              previews: ['inertia']
            }
          }
        ],
        createCard: [
          'POST /projects/columns/{column_id}/cards',
          {
            mediaType: {
              previews: ['inertia']
            }
          }
        ],
        createColumn: [
          'POST /projects/{project_id}/columns',
          {
            mediaType: {
              previews: ['inertia']
            }
          }
        ],
        createForAuthenticatedUser: [
          'POST /user/projects',
          {
            mediaType: {
              previews: ['inertia']
            }
          }
        ],
        createForOrg: [
          'POST /orgs/{org}/projects',
          {
            mediaType: {
              previews: ['inertia']
            }
          }
        ],
        createForRepo: [
          'POST /repos/{owner}/{repo}/projects',
          {
            mediaType: {
              previews: ['inertia']
            }
          }
        ],
        delete: [
          'DELETE /projects/{project_id}',
          {
            mediaType: {
              previews: ['inertia']
            }
          }
        ],
        deleteCard: [
          'DELETE /projects/columns/cards/{card_id}',
          {
            mediaType: {
              previews: ['inertia']
            }
          }
        ],
        deleteColumn: [
          'DELETE /projects/columns/{column_id}',
          {
            mediaType: {
              previews: ['inertia']
            }
          }
        ],
        get: [
          'GET /projects/{project_id}',
          {
            mediaType: {
              previews: ['inertia']
            }
          }
        ],
        getCard: [
          'GET /projects/columns/cards/{card_id}',
          {
            mediaType: {
              previews: ['inertia']
            }
          }
        ],
        getColumn: [
          'GET /projects/columns/{column_id}',
          {
            mediaType: {
              previews: ['inertia']
            }
          }
        ],
        getPermissionForUser: [
          'GET /projects/{project_id}/collaborators/{username}/permission',
          {
            mediaType: {
              previews: ['inertia']
            }
          }
        ],
        listCards: [
          'GET /projects/columns/{column_id}/cards',
          {
            mediaType: {
              previews: ['inertia']
            }
          }
        ],
        listCollaborators: [
          'GET /projects/{project_id}/collaborators',
          {
            mediaType: {
              previews: ['inertia']
            }
          }
        ],
        listColumns: [
          'GET /projects/{project_id}/columns',
          {
            mediaType: {
              previews: ['inertia']
            }
          }
        ],
        listForOrg: [
          'GET /orgs/{org}/projects',
          {
            mediaType: {
              previews: ['inertia']
            }
          }
        ],
        listForRepo: [
          'GET /repos/{owner}/{repo}/projects',
          {
            mediaType: {
              previews: ['inertia']
            }
          }
        ],
        listForUser: [
          'GET /users/{username}/projects',
          {
            mediaType: {
              previews: ['inertia']
            }
          }
        ],
        moveCard: [
          'POST /projects/columns/cards/{card_id}/moves',
          {
            mediaType: {
              previews: ['inertia']
            }
          }
        ],
        moveColumn: [
          'POST /projects/columns/{column_id}/moves',
          {
            mediaType: {
              previews: ['inertia']
            }
          }
        ],
        removeCollaborator: [
          'DELETE /projects/{project_id}/collaborators/{username}',
          {
            mediaType: {
              previews: ['inertia']
            }
          }
        ],
        update: [
          'PATCH /projects/{project_id}',
          {
            mediaType: {
              previews: ['inertia']
            }
          }
        ],
        updateCard: [
          'PATCH /projects/columns/cards/{card_id}',
          {
            mediaType: {
              previews: ['inertia']
            }
          }
        ],
        updateColumn: [
          'PATCH /projects/columns/{column_id}',
          {
            mediaType: {
              previews: ['inertia']
            }
          }
        ]
      },
      pulls: {
        checkIfMerged: ['GET /repos/{owner}/{repo}/pulls/{pull_number}/merge'],
        create: ['POST /repos/{owner}/{repo}/pulls'],
        createReplyForReviewComment: [
          'POST /repos/{owner}/{repo}/pulls/{pull_number}/comments/{comment_id}/replies'
        ],
        createReview: ['POST /repos/{owner}/{repo}/pulls/{pull_number}/reviews'],
        createReviewComment: ['POST /repos/{owner}/{repo}/pulls/{pull_number}/comments'],
        deletePendingReview: [
          'DELETE /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}'
        ],
        deleteReviewComment: ['DELETE /repos/{owner}/{repo}/pulls/comments/{comment_id}'],
        dismissReview: [
          'PUT /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/dismissals'
        ],
        get: ['GET /repos/{owner}/{repo}/pulls/{pull_number}'],
        getReview: ['GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}'],
        getReviewComment: ['GET /repos/{owner}/{repo}/pulls/comments/{comment_id}'],
        list: ['GET /repos/{owner}/{repo}/pulls'],
        listCommentsForReview: [
          'GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/comments'
        ],
        listCommits: ['GET /repos/{owner}/{repo}/pulls/{pull_number}/commits'],
        listFiles: ['GET /repos/{owner}/{repo}/pulls/{pull_number}/files'],
        listRequestedReviewers: [
          'GET /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers'
        ],
        listReviewComments: ['GET /repos/{owner}/{repo}/pulls/{pull_number}/comments'],
        listReviewCommentsForRepo: ['GET /repos/{owner}/{repo}/pulls/comments'],
        listReviews: ['GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews'],
        merge: ['PUT /repos/{owner}/{repo}/pulls/{pull_number}/merge'],
        removeRequestedReviewers: [
          'DELETE /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers'
        ],
        requestReviewers: ['POST /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers'],
        submitReview: ['POST /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/events'],
        update: ['PATCH /repos/{owner}/{repo}/pulls/{pull_number}'],
        updateBranch: [
          'PUT /repos/{owner}/{repo}/pulls/{pull_number}/update-branch',
          {
            mediaType: {
              previews: ['lydian']
            }
          }
        ],
        updateReview: ['PUT /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}'],
        updateReviewComment: ['PATCH /repos/{owner}/{repo}/pulls/comments/{comment_id}']
      },
      rateLimit: {
        get: ['GET /rate_limit']
      },
      reactions: {
        createForCommitComment: [
          'POST /repos/{owner}/{repo}/comments/{comment_id}/reactions',
          {
            mediaType: {
              previews: ['squirrel-girl']
            }
          }
        ],
        createForIssue: [
          'POST /repos/{owner}/{repo}/issues/{issue_number}/reactions',
          {
            mediaType: {
              previews: ['squirrel-girl']
            }
          }
        ],
        createForIssueComment: [
          'POST /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions',
          {
            mediaType: {
              previews: ['squirrel-girl']
            }
          }
        ],
        createForPullRequestReviewComment: [
          'POST /repos/{owner}/{repo}/pulls/comments/{comment_id}/reactions',
          {
            mediaType: {
              previews: ['squirrel-girl']
            }
          }
        ],
        createForRelease: [
          'POST /repos/{owner}/{repo}/releases/{release_id}/reactions',
          {
            mediaType: {
              previews: ['squirrel-girl']
            }
          }
        ],
        createForTeamDiscussionCommentInOrg: [
          'POST /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}/reactions',
          {
            mediaType: {
              previews: ['squirrel-girl']
            }
          }
        ],
        createForTeamDiscussionInOrg: [
          'POST /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/reactions',
          {
            mediaType: {
              previews: ['squirrel-girl']
            }
          }
        ],
        deleteForCommitComment: [
          'DELETE /repos/{owner}/{repo}/comments/{comment_id}/reactions/{reaction_id}',
          {
            mediaType: {
              previews: ['squirrel-girl']
            }
          }
        ],
        deleteForIssue: [
          'DELETE /repos/{owner}/{repo}/issues/{issue_number}/reactions/{reaction_id}',
          {
            mediaType: {
              previews: ['squirrel-girl']
            }
          }
        ],
        deleteForIssueComment: [
          'DELETE /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions/{reaction_id}',
          {
            mediaType: {
              previews: ['squirrel-girl']
            }
          }
        ],
        deleteForPullRequestComment: [
          'DELETE /repos/{owner}/{repo}/pulls/comments/{comment_id}/reactions/{reaction_id}',
          {
            mediaType: {
              previews: ['squirrel-girl']
            }
          }
        ],
        deleteForTeamDiscussion: [
          'DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/reactions/{reaction_id}',
          {
            mediaType: {
              previews: ['squirrel-girl']
            }
          }
        ],
        deleteForTeamDiscussionComment: [
          'DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}/reactions/{reaction_id}',
          {
            mediaType: {
              previews: ['squirrel-girl']
            }
          }
        ],
        deleteLegacy: [
          'DELETE /reactions/{reaction_id}',
          {
            mediaType: {
              previews: ['squirrel-girl']
            }
          },
          {
            deprecated:
              'octokit.rest.reactions.deleteLegacy() is deprecated, see https://docs.github.com/rest/reference/reactions/#delete-a-reaction-legacy'
          }
        ],
        listForCommitComment: [
          'GET /repos/{owner}/{repo}/comments/{comment_id}/reactions',
          {
            mediaType: {
              previews: ['squirrel-girl']
            }
          }
        ],
        listForIssue: [
          'GET /repos/{owner}/{repo}/issues/{issue_number}/reactions',
          {
            mediaType: {
              previews: ['squirrel-girl']
            }
          }
        ],
        listForIssueComment: [
          'GET /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions',
          {
            mediaType: {
              previews: ['squirrel-girl']
            }
          }
        ],
        listForPullRequestReviewComment: [
          'GET /repos/{owner}/{repo}/pulls/comments/{comment_id}/reactions',
          {
            mediaType: {
              previews: ['squirrel-girl']
            }
          }
        ],
        listForTeamDiscussionCommentInOrg: [
          'GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}/reactions',
          {
            mediaType: {
              previews: ['squirrel-girl']
            }
          }
        ],
        listForTeamDiscussionInOrg: [
          'GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/reactions',
          {
            mediaType: {
              previews: ['squirrel-girl']
            }
          }
        ]
      },
      repos: {
        acceptInvitation: ['PATCH /user/repository_invitations/{invitation_id}'],
        addAppAccessRestrictions: [
          'POST /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps',
          {},
          {
            mapToData: 'apps'
          }
        ],
        addCollaborator: ['PUT /repos/{owner}/{repo}/collaborators/{username}'],
        addStatusCheckContexts: [
          'POST /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts',
          {},
          {
            mapToData: 'contexts'
          }
        ],
        addTeamAccessRestrictions: [
          'POST /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams',
          {},
          {
            mapToData: 'teams'
          }
        ],
        addUserAccessRestrictions: [
          'POST /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users',
          {},
          {
            mapToData: 'users'
          }
        ],
        checkCollaborator: ['GET /repos/{owner}/{repo}/collaborators/{username}'],
        checkVulnerabilityAlerts: [
          'GET /repos/{owner}/{repo}/vulnerability-alerts',
          {
            mediaType: {
              previews: ['dorian']
            }
          }
        ],
        compareCommits: ['GET /repos/{owner}/{repo}/compare/{base}...{head}'],
        compareCommitsWithBasehead: ['GET /repos/{owner}/{repo}/compare/{basehead}'],
        createAutolink: ['POST /repos/{owner}/{repo}/autolinks'],
        createCommitComment: ['POST /repos/{owner}/{repo}/commits/{commit_sha}/comments'],
        createCommitSignatureProtection: [
          'POST /repos/{owner}/{repo}/branches/{branch}/protection/required_signatures',
          {
            mediaType: {
              previews: ['zzzax']
            }
          }
        ],
        createCommitStatus: ['POST /repos/{owner}/{repo}/statuses/{sha}'],
        createDeployKey: ['POST /repos/{owner}/{repo}/keys'],
        createDeployment: ['POST /repos/{owner}/{repo}/deployments'],
        createDeploymentStatus: ['POST /repos/{owner}/{repo}/deployments/{deployment_id}/statuses'],
        createDispatchEvent: ['POST /repos/{owner}/{repo}/dispatches'],
        createForAuthenticatedUser: ['POST /user/repos'],
        createFork: ['POST /repos/{owner}/{repo}/forks'],
        createInOrg: ['POST /orgs/{org}/repos'],
        createOrUpdateEnvironment: ['PUT /repos/{owner}/{repo}/environments/{environment_name}'],
        createOrUpdateFileContents: ['PUT /repos/{owner}/{repo}/contents/{path}'],
        createPagesSite: [
          'POST /repos/{owner}/{repo}/pages',
          {
            mediaType: {
              previews: ['switcheroo']
            }
          }
        ],
        createRelease: ['POST /repos/{owner}/{repo}/releases'],
        createUsingTemplate: [
          'POST /repos/{template_owner}/{template_repo}/generate',
          {
            mediaType: {
              previews: ['baptiste']
            }
          }
        ],
        createWebhook: ['POST /repos/{owner}/{repo}/hooks'],
        declineInvitation: ['DELETE /user/repository_invitations/{invitation_id}'],
        delete: ['DELETE /repos/{owner}/{repo}'],
        deleteAccessRestrictions: [
          'DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions'
        ],
        deleteAdminBranchProtection: [
          'DELETE /repos/{owner}/{repo}/branches/{branch}/protection/enforce_admins'
        ],
        deleteAnEnvironment: ['DELETE /repos/{owner}/{repo}/environments/{environment_name}'],
        deleteAutolink: ['DELETE /repos/{owner}/{repo}/autolinks/{autolink_id}'],
        deleteBranchProtection: ['DELETE /repos/{owner}/{repo}/branches/{branch}/protection'],
        deleteCommitComment: ['DELETE /repos/{owner}/{repo}/comments/{comment_id}'],
        deleteCommitSignatureProtection: [
          'DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_signatures',
          {
            mediaType: {
              previews: ['zzzax']
            }
          }
        ],
        deleteDeployKey: ['DELETE /repos/{owner}/{repo}/keys/{key_id}'],
        deleteDeployment: ['DELETE /repos/{owner}/{repo}/deployments/{deployment_id}'],
        deleteFile: ['DELETE /repos/{owner}/{repo}/contents/{path}'],
        deleteInvitation: ['DELETE /repos/{owner}/{repo}/invitations/{invitation_id}'],
        deletePagesSite: [
          'DELETE /repos/{owner}/{repo}/pages',
          {
            mediaType: {
              previews: ['switcheroo']
            }
          }
        ],
        deletePullRequestReviewProtection: [
          'DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_pull_request_reviews'
        ],
        deleteRelease: ['DELETE /repos/{owner}/{repo}/releases/{release_id}'],
        deleteReleaseAsset: ['DELETE /repos/{owner}/{repo}/releases/assets/{asset_id}'],
        deleteWebhook: ['DELETE /repos/{owner}/{repo}/hooks/{hook_id}'],
        disableAutomatedSecurityFixes: [
          'DELETE /repos/{owner}/{repo}/automated-security-fixes',
          {
            mediaType: {
              previews: ['london']
            }
          }
        ],
        disableVulnerabilityAlerts: [
          'DELETE /repos/{owner}/{repo}/vulnerability-alerts',
          {
            mediaType: {
              previews: ['dorian']
            }
          }
        ],
        downloadArchive: [
          'GET /repos/{owner}/{repo}/zipball/{ref}',
          {},
          {
            renamed: ['repos', 'downloadZipballArchive']
          }
        ],
        downloadTarballArchive: ['GET /repos/{owner}/{repo}/tarball/{ref}'],
        downloadZipballArchive: ['GET /repos/{owner}/{repo}/zipball/{ref}'],
        enableAutomatedSecurityFixes: [
          'PUT /repos/{owner}/{repo}/automated-security-fixes',
          {
            mediaType: {
              previews: ['london']
            }
          }
        ],
        enableVulnerabilityAlerts: [
          'PUT /repos/{owner}/{repo}/vulnerability-alerts',
          {
            mediaType: {
              previews: ['dorian']
            }
          }
        ],
        get: ['GET /repos/{owner}/{repo}'],
        getAccessRestrictions: [
          'GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions'
        ],
        getAdminBranchProtection: [
          'GET /repos/{owner}/{repo}/branches/{branch}/protection/enforce_admins'
        ],
        getAllEnvironments: ['GET /repos/{owner}/{repo}/environments'],
        getAllStatusCheckContexts: [
          'GET /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts'
        ],
        getAllTopics: [
          'GET /repos/{owner}/{repo}/topics',
          {
            mediaType: {
              previews: ['mercy']
            }
          }
        ],
        getAppsWithAccessToProtectedBranch: [
          'GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps'
        ],
        getAutolink: ['GET /repos/{owner}/{repo}/autolinks/{autolink_id}'],
        getBranch: ['GET /repos/{owner}/{repo}/branches/{branch}'],
        getBranchProtection: ['GET /repos/{owner}/{repo}/branches/{branch}/protection'],
        getClones: ['GET /repos/{owner}/{repo}/traffic/clones'],
        getCodeFrequencyStats: ['GET /repos/{owner}/{repo}/stats/code_frequency'],
        getCollaboratorPermissionLevel: [
          'GET /repos/{owner}/{repo}/collaborators/{username}/permission'
        ],
        getCombinedStatusForRef: ['GET /repos/{owner}/{repo}/commits/{ref}/status'],
        getCommit: ['GET /repos/{owner}/{repo}/commits/{ref}'],
        getCommitActivityStats: ['GET /repos/{owner}/{repo}/stats/commit_activity'],
        getCommitComment: ['GET /repos/{owner}/{repo}/comments/{comment_id}'],
        getCommitSignatureProtection: [
          'GET /repos/{owner}/{repo}/branches/{branch}/protection/required_signatures',
          {
            mediaType: {
              previews: ['zzzax']
            }
          }
        ],
        getCommunityProfileMetrics: ['GET /repos/{owner}/{repo}/community/profile'],
        getContent: ['GET /repos/{owner}/{repo}/contents/{path}'],
        getContributorsStats: ['GET /repos/{owner}/{repo}/stats/contributors'],
        getDeployKey: ['GET /repos/{owner}/{repo}/keys/{key_id}'],
        getDeployment: ['GET /repos/{owner}/{repo}/deployments/{deployment_id}'],
        getDeploymentStatus: [
          'GET /repos/{owner}/{repo}/deployments/{deployment_id}/statuses/{status_id}'
        ],
        getEnvironment: ['GET /repos/{owner}/{repo}/environments/{environment_name}'],
        getLatestPagesBuild: ['GET /repos/{owner}/{repo}/pages/builds/latest'],
        getLatestRelease: ['GET /repos/{owner}/{repo}/releases/latest'],
        getPages: ['GET /repos/{owner}/{repo}/pages'],
        getPagesBuild: ['GET /repos/{owner}/{repo}/pages/builds/{build_id}'],
        getPagesHealthCheck: ['GET /repos/{owner}/{repo}/pages/health'],
        getParticipationStats: ['GET /repos/{owner}/{repo}/stats/participation'],
        getPullRequestReviewProtection: [
          'GET /repos/{owner}/{repo}/branches/{branch}/protection/required_pull_request_reviews'
        ],
        getPunchCardStats: ['GET /repos/{owner}/{repo}/stats/punch_card'],
        getReadme: ['GET /repos/{owner}/{repo}/readme'],
        getReadmeInDirectory: ['GET /repos/{owner}/{repo}/readme/{dir}'],
        getRelease: ['GET /repos/{owner}/{repo}/releases/{release_id}'],
        getReleaseAsset: ['GET /repos/{owner}/{repo}/releases/assets/{asset_id}'],
        getReleaseByTag: ['GET /repos/{owner}/{repo}/releases/tags/{tag}'],
        getStatusChecksProtection: [
          'GET /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks'
        ],
        getTeamsWithAccessToProtectedBranch: [
          'GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams'
        ],
        getTopPaths: ['GET /repos/{owner}/{repo}/traffic/popular/paths'],
        getTopReferrers: ['GET /repos/{owner}/{repo}/traffic/popular/referrers'],
        getUsersWithAccessToProtectedBranch: [
          'GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users'
        ],
        getViews: ['GET /repos/{owner}/{repo}/traffic/views'],
        getWebhook: ['GET /repos/{owner}/{repo}/hooks/{hook_id}'],
        getWebhookConfigForRepo: ['GET /repos/{owner}/{repo}/hooks/{hook_id}/config'],
        getWebhookDelivery: ['GET /repos/{owner}/{repo}/hooks/{hook_id}/deliveries/{delivery_id}'],
        listAutolinks: ['GET /repos/{owner}/{repo}/autolinks'],
        listBranches: ['GET /repos/{owner}/{repo}/branches'],
        listBranchesForHeadCommit: [
          'GET /repos/{owner}/{repo}/commits/{commit_sha}/branches-where-head',
          {
            mediaType: {
              previews: ['groot']
            }
          }
        ],
        listCollaborators: ['GET /repos/{owner}/{repo}/collaborators'],
        listCommentsForCommit: ['GET /repos/{owner}/{repo}/commits/{commit_sha}/comments'],
        listCommitCommentsForRepo: ['GET /repos/{owner}/{repo}/comments'],
        listCommitStatusesForRef: ['GET /repos/{owner}/{repo}/commits/{ref}/statuses'],
        listCommits: ['GET /repos/{owner}/{repo}/commits'],
        listContributors: ['GET /repos/{owner}/{repo}/contributors'],
        listDeployKeys: ['GET /repos/{owner}/{repo}/keys'],
        listDeploymentStatuses: ['GET /repos/{owner}/{repo}/deployments/{deployment_id}/statuses'],
        listDeployments: ['GET /repos/{owner}/{repo}/deployments'],
        listForAuthenticatedUser: ['GET /user/repos'],
        listForOrg: ['GET /orgs/{org}/repos'],
        listForUser: ['GET /users/{username}/repos'],
        listForks: ['GET /repos/{owner}/{repo}/forks'],
        listInvitations: ['GET /repos/{owner}/{repo}/invitations'],
        listInvitationsForAuthenticatedUser: ['GET /user/repository_invitations'],
        listLanguages: ['GET /repos/{owner}/{repo}/languages'],
        listPagesBuilds: ['GET /repos/{owner}/{repo}/pages/builds'],
        listPublic: ['GET /repositories'],
        listPullRequestsAssociatedWithCommit: [
          'GET /repos/{owner}/{repo}/commits/{commit_sha}/pulls',
          {
            mediaType: {
              previews: ['groot']
            }
          }
        ],
        listReleaseAssets: ['GET /repos/{owner}/{repo}/releases/{release_id}/assets'],
        listReleases: ['GET /repos/{owner}/{repo}/releases'],
        listTags: ['GET /repos/{owner}/{repo}/tags'],
        listTeams: ['GET /repos/{owner}/{repo}/teams'],
        listWebhookDeliveries: ['GET /repos/{owner}/{repo}/hooks/{hook_id}/deliveries'],
        listWebhooks: ['GET /repos/{owner}/{repo}/hooks'],
        merge: ['POST /repos/{owner}/{repo}/merges'],
        mergeUpstream: ['POST /repos/{owner}/{repo}/merge-upstream'],
        pingWebhook: ['POST /repos/{owner}/{repo}/hooks/{hook_id}/pings'],
        redeliverWebhookDelivery: [
          'POST /repos/{owner}/{repo}/hooks/{hook_id}/deliveries/{delivery_id}/attempts'
        ],
        removeAppAccessRestrictions: [
          'DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps',
          {},
          {
            mapToData: 'apps'
          }
        ],
        removeCollaborator: ['DELETE /repos/{owner}/{repo}/collaborators/{username}'],
        removeStatusCheckContexts: [
          'DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts',
          {},
          {
            mapToData: 'contexts'
          }
        ],
        removeStatusCheckProtection: [
          'DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks'
        ],
        removeTeamAccessRestrictions: [
          'DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams',
          {},
          {
            mapToData: 'teams'
          }
        ],
        removeUserAccessRestrictions: [
          'DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users',
          {},
          {
            mapToData: 'users'
          }
        ],
        renameBranch: ['POST /repos/{owner}/{repo}/branches/{branch}/rename'],
        replaceAllTopics: [
          'PUT /repos/{owner}/{repo}/topics',
          {
            mediaType: {
              previews: ['mercy']
            }
          }
        ],
        requestPagesBuild: ['POST /repos/{owner}/{repo}/pages/builds'],
        setAdminBranchProtection: [
          'POST /repos/{owner}/{repo}/branches/{branch}/protection/enforce_admins'
        ],
        setAppAccessRestrictions: [
          'PUT /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps',
          {},
          {
            mapToData: 'apps'
          }
        ],
        setStatusCheckContexts: [
          'PUT /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts',
          {},
          {
            mapToData: 'contexts'
          }
        ],
        setTeamAccessRestrictions: [
          'PUT /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams',
          {},
          {
            mapToData: 'teams'
          }
        ],
        setUserAccessRestrictions: [
          'PUT /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users',
          {},
          {
            mapToData: 'users'
          }
        ],
        testPushWebhook: ['POST /repos/{owner}/{repo}/hooks/{hook_id}/tests'],
        transfer: ['POST /repos/{owner}/{repo}/transfer'],
        update: ['PATCH /repos/{owner}/{repo}'],
        updateBranchProtection: ['PUT /repos/{owner}/{repo}/branches/{branch}/protection'],
        updateCommitComment: ['PATCH /repos/{owner}/{repo}/comments/{comment_id}'],
        updateInformationAboutPagesSite: ['PUT /repos/{owner}/{repo}/pages'],
        updateInvitation: ['PATCH /repos/{owner}/{repo}/invitations/{invitation_id}'],
        updatePullRequestReviewProtection: [
          'PATCH /repos/{owner}/{repo}/branches/{branch}/protection/required_pull_request_reviews'
        ],
        updateRelease: ['PATCH /repos/{owner}/{repo}/releases/{release_id}'],
        updateReleaseAsset: ['PATCH /repos/{owner}/{repo}/releases/assets/{asset_id}'],
        updateStatusCheckPotection: [
          'PATCH /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks',
          {},
          {
            renamed: ['repos', 'updateStatusCheckProtection']
          }
        ],
        updateStatusCheckProtection: [
          'PATCH /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks'
        ],
        updateWebhook: ['PATCH /repos/{owner}/{repo}/hooks/{hook_id}'],
        updateWebhookConfigForRepo: ['PATCH /repos/{owner}/{repo}/hooks/{hook_id}/config'],
        uploadReleaseAsset: [
          'POST /repos/{owner}/{repo}/releases/{release_id}/assets{?name,label}',
          {
            baseUrl: 'https://uploads.github.com'
          }
        ]
      },
      search: {
        code: ['GET /search/code'],
        commits: [
          'GET /search/commits',
          {
            mediaType: {
              previews: ['cloak']
            }
          }
        ],
        issuesAndPullRequests: ['GET /search/issues'],
        labels: ['GET /search/labels'],
        repos: ['GET /search/repositories'],
        topics: [
          'GET /search/topics',
          {
            mediaType: {
              previews: ['mercy']
            }
          }
        ],
        users: ['GET /search/users']
      },
      secretScanning: {
        getAlert: ['GET /repos/{owner}/{repo}/secret-scanning/alerts/{alert_number}'],
        listAlertsForOrg: ['GET /orgs/{org}/secret-scanning/alerts'],
        listAlertsForRepo: ['GET /repos/{owner}/{repo}/secret-scanning/alerts'],
        updateAlert: ['PATCH /repos/{owner}/{repo}/secret-scanning/alerts/{alert_number}']
      },
      teams: {
        addOrUpdateMembershipForUserInOrg: [
          'PUT /orgs/{org}/teams/{team_slug}/memberships/{username}'
        ],
        addOrUpdateProjectPermissionsInOrg: [
          'PUT /orgs/{org}/teams/{team_slug}/projects/{project_id}',
          {
            mediaType: {
              previews: ['inertia']
            }
          }
        ],
        addOrUpdateRepoPermissionsInOrg: ['PUT /orgs/{org}/teams/{team_slug}/repos/{owner}/{repo}'],
        checkPermissionsForProjectInOrg: [
          'GET /orgs/{org}/teams/{team_slug}/projects/{project_id}',
          {
            mediaType: {
              previews: ['inertia']
            }
          }
        ],
        checkPermissionsForRepoInOrg: ['GET /orgs/{org}/teams/{team_slug}/repos/{owner}/{repo}'],
        create: ['POST /orgs/{org}/teams'],
        createDiscussionCommentInOrg: [
          'POST /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments'
        ],
        createDiscussionInOrg: ['POST /orgs/{org}/teams/{team_slug}/discussions'],
        deleteDiscussionCommentInOrg: [
          'DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}'
        ],
        deleteDiscussionInOrg: [
          'DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}'
        ],
        deleteInOrg: ['DELETE /orgs/{org}/teams/{team_slug}'],
        getByName: ['GET /orgs/{org}/teams/{team_slug}'],
        getDiscussionCommentInOrg: [
          'GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}'
        ],
        getDiscussionInOrg: ['GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}'],
        getMembershipForUserInOrg: ['GET /orgs/{org}/teams/{team_slug}/memberships/{username}'],
        list: ['GET /orgs/{org}/teams'],
        listChildInOrg: ['GET /orgs/{org}/teams/{team_slug}/teams'],
        listDiscussionCommentsInOrg: [
          'GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments'
        ],
        listDiscussionsInOrg: ['GET /orgs/{org}/teams/{team_slug}/discussions'],
        listForAuthenticatedUser: ['GET /user/teams'],
        listMembersInOrg: ['GET /orgs/{org}/teams/{team_slug}/members'],
        listPendingInvitationsInOrg: ['GET /orgs/{org}/teams/{team_slug}/invitations'],
        listProjectsInOrg: [
          'GET /orgs/{org}/teams/{team_slug}/projects',
          {
            mediaType: {
              previews: ['inertia']
            }
          }
        ],
        listReposInOrg: ['GET /orgs/{org}/teams/{team_slug}/repos'],
        removeMembershipForUserInOrg: [
          'DELETE /orgs/{org}/teams/{team_slug}/memberships/{username}'
        ],
        removeProjectInOrg: ['DELETE /orgs/{org}/teams/{team_slug}/projects/{project_id}'],
        removeRepoInOrg: ['DELETE /orgs/{org}/teams/{team_slug}/repos/{owner}/{repo}'],
        updateDiscussionCommentInOrg: [
          'PATCH /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}'
        ],
        updateDiscussionInOrg: [
          'PATCH /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}'
        ],
        updateInOrg: ['PATCH /orgs/{org}/teams/{team_slug}']
      },
      users: {
        addEmailForAuthenticated: ['POST /user/emails'],
        block: ['PUT /user/blocks/{username}'],
        checkBlocked: ['GET /user/blocks/{username}'],
        checkFollowingForUser: ['GET /users/{username}/following/{target_user}'],
        checkPersonIsFollowedByAuthenticated: ['GET /user/following/{username}'],
        createGpgKeyForAuthenticated: ['POST /user/gpg_keys'],
        createPublicSshKeyForAuthenticated: ['POST /user/keys'],
        deleteEmailForAuthenticated: ['DELETE /user/emails'],
        deleteGpgKeyForAuthenticated: ['DELETE /user/gpg_keys/{gpg_key_id}'],
        deletePublicSshKeyForAuthenticated: ['DELETE /user/keys/{key_id}'],
        follow: ['PUT /user/following/{username}'],
        getAuthenticated: ['GET /user'],
        getByUsername: ['GET /users/{username}'],
        getContextForUser: ['GET /users/{username}/hovercard'],
        getGpgKeyForAuthenticated: ['GET /user/gpg_keys/{gpg_key_id}'],
        getPublicSshKeyForAuthenticated: ['GET /user/keys/{key_id}'],
        list: ['GET /users'],
        listBlockedByAuthenticated: ['GET /user/blocks'],
        listEmailsForAuthenticated: ['GET /user/emails'],
        listFollowedByAuthenticated: ['GET /user/following'],
        listFollowersForAuthenticatedUser: ['GET /user/followers'],
        listFollowersForUser: ['GET /users/{username}/followers'],
        listFollowingForUser: ['GET /users/{username}/following'],
        listGpgKeysForAuthenticated: ['GET /user/gpg_keys'],
        listGpgKeysForUser: ['GET /users/{username}/gpg_keys'],
        listPublicEmailsForAuthenticated: ['GET /user/public_emails'],
        listPublicKeysForUser: ['GET /users/{username}/keys'],
        listPublicSshKeysForAuthenticated: ['GET /user/keys'],
        setPrimaryEmailVisibilityForAuthenticated: ['PATCH /user/email/visibility'],
        unblock: ['DELETE /user/blocks/{username}'],
        unfollow: ['DELETE /user/following/{username}'],
        updateAuthenticated: ['PATCH /user']
      }
    };
    var VERSION = '5.10.0';
    function endpointsToMethods(octokit, endpointsMap) {
      const newMethods = {};
      for (const [scope, endpoints] of Object.entries(endpointsMap)) {
        for (const [methodName, endpoint] of Object.entries(endpoints)) {
          const [route, defaults, decorations] = endpoint;
          const [method, url] = route.split(/ /);
          const endpointDefaults = Object.assign(
            {
              method,
              url
            },
            defaults
          );
          if (!newMethods[scope]) {
            newMethods[scope] = {};
          }
          const scopeMethods = newMethods[scope];
          if (decorations) {
            scopeMethods[methodName] = decorate(
              octokit,
              scope,
              methodName,
              endpointDefaults,
              decorations
            );
            continue;
          }
          scopeMethods[methodName] = octokit.request.defaults(endpointDefaults);
        }
      }
      return newMethods;
    }
    function decorate(octokit, scope, methodName, defaults, decorations) {
      const requestWithDefaults = octokit.request.defaults(defaults);
      function withDecorations(...args) {
        let options = requestWithDefaults.endpoint.merge(...args);
        if (decorations.mapToData) {
          options = Object.assign({}, options, {
            data: options[decorations.mapToData],
            [decorations.mapToData]: void 0
          });
          return requestWithDefaults(options);
        }
        if (decorations.renamed) {
          const [newScope, newMethodName] = decorations.renamed;
          octokit.log.warn(
            `octokit.${scope}.${methodName}() has been renamed to octokit.${newScope}.${newMethodName}()`
          );
        }
        if (decorations.deprecated) {
          octokit.log.warn(decorations.deprecated);
        }
        if (decorations.renamedParameters) {
          const options2 = requestWithDefaults.endpoint.merge(...args);
          for (const [name, alias] of Object.entries(decorations.renamedParameters)) {
            if (name in options2) {
              octokit.log.warn(
                `"${name}" parameter is deprecated for "octokit.${scope}.${methodName}()". Use "${alias}" instead`
              );
              if (!(alias in options2)) {
                options2[alias] = options2[name];
              }
              delete options2[name];
            }
          }
          return requestWithDefaults(options2);
        }
        return requestWithDefaults(...args);
      }
      return Object.assign(withDecorations, requestWithDefaults);
    }
    function restEndpointMethods(octokit) {
      const api = endpointsToMethods(octokit, Endpoints);
      return {
        rest: api
      };
    }
    restEndpointMethods.VERSION = VERSION;
    function legacyRestEndpointMethods(octokit) {
      const api = endpointsToMethods(octokit, Endpoints);
      return _objectSpread2(
        _objectSpread2({}, api),
        {},
        {
          rest: api
        }
      );
    }
    legacyRestEndpointMethods.VERSION = VERSION;
    exports2.legacyRestEndpointMethods = legacyRestEndpointMethods;
    exports2.restEndpointMethods = restEndpointMethods;
  }
});

// node_modules/@octokit/plugin-paginate-rest/dist-node/index.js
var require_dist_node10 = __commonJS({
  'node_modules/@octokit/plugin-paginate-rest/dist-node/index.js'(exports2) {
    'use strict';
    Object.defineProperty(exports2, '__esModule', { value: true });
    var VERSION = '2.16.0';
    function ownKeys(object, enumerableOnly) {
      var keys = Object.keys(object);
      if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly) {
          symbols = symbols.filter(function (sym) {
            return Object.getOwnPropertyDescriptor(object, sym).enumerable;
          });
        }
        keys.push.apply(keys, symbols);
      }
      return keys;
    }
    function _objectSpread2(target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i] != null ? arguments[i] : {};
        if (i % 2) {
          ownKeys(Object(source), true).forEach(function (key) {
            _defineProperty(target, key, source[key]);
          });
        } else if (Object.getOwnPropertyDescriptors) {
          Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
        } else {
          ownKeys(Object(source)).forEach(function (key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
          });
        }
      }
      return target;
    }
    function _defineProperty(obj, key, value) {
      if (key in obj) {
        Object.defineProperty(obj, key, {
          value,
          enumerable: true,
          configurable: true,
          writable: true
        });
      } else {
        obj[key] = value;
      }
      return obj;
    }
    function normalizePaginatedListResponse(response) {
      if (!response.data) {
        return _objectSpread2(
          _objectSpread2({}, response),
          {},
          {
            data: []
          }
        );
      }
      const responseNeedsNormalization =
        'total_count' in response.data && !('url' in response.data);
      if (!responseNeedsNormalization) return response;
      const incompleteResults = response.data.incomplete_results;
      const repositorySelection = response.data.repository_selection;
      const totalCount = response.data.total_count;
      delete response.data.incomplete_results;
      delete response.data.repository_selection;
      delete response.data.total_count;
      const namespaceKey = Object.keys(response.data)[0];
      const data = response.data[namespaceKey];
      response.data = data;
      if (typeof incompleteResults !== 'undefined') {
        response.data.incomplete_results = incompleteResults;
      }
      if (typeof repositorySelection !== 'undefined') {
        response.data.repository_selection = repositorySelection;
      }
      response.data.total_count = totalCount;
      return response;
    }
    function iterator(octokit, route, parameters) {
      const options =
        typeof route === 'function'
          ? route.endpoint(parameters)
          : octokit.request.endpoint(route, parameters);
      const requestMethod = typeof route === 'function' ? route : octokit.request;
      const method = options.method;
      const headers = options.headers;
      let url = options.url;
      return {
        [Symbol.asyncIterator]: () => ({
          async next() {
            if (!url)
              return {
                done: true
              };
            try {
              const response = await requestMethod({
                method,
                url,
                headers
              });
              const normalizedResponse = normalizePaginatedListResponse(response);
              url = ((normalizedResponse.headers.link || '').match(/<([^>]+)>;\s*rel="next"/) ||
                [])[1];
              return {
                value: normalizedResponse
              };
            } catch (error) {
              if (error.status !== 409) throw error;
              url = '';
              return {
                value: {
                  status: 200,
                  headers: {},
                  data: []
                }
              };
            }
          }
        })
      };
    }
    function paginate(octokit, route, parameters, mapFn) {
      if (typeof parameters === 'function') {
        mapFn = parameters;
        parameters = void 0;
      }
      return gather(
        octokit,
        [],
        iterator(octokit, route, parameters)[Symbol.asyncIterator](),
        mapFn
      );
    }
    function gather(octokit, results, iterator2, mapFn) {
      return iterator2.next().then(result => {
        if (result.done) {
          return results;
        }
        let earlyExit = false;
        function done() {
          earlyExit = true;
        }
        results = results.concat(mapFn ? mapFn(result.value, done) : result.value.data);
        if (earlyExit) {
          return results;
        }
        return gather(octokit, results, iterator2, mapFn);
      });
    }
    var composePaginateRest = Object.assign(paginate, {
      iterator
    });
    var paginatingEndpoints = [
      'GET /app/hook/deliveries',
      'GET /app/installations',
      'GET /applications/grants',
      'GET /authorizations',
      'GET /enterprises/{enterprise}/actions/permissions/organizations',
      'GET /enterprises/{enterprise}/actions/runner-groups',
      'GET /enterprises/{enterprise}/actions/runner-groups/{runner_group_id}/organizations',
      'GET /enterprises/{enterprise}/actions/runner-groups/{runner_group_id}/runners',
      'GET /enterprises/{enterprise}/actions/runners',
      'GET /enterprises/{enterprise}/actions/runners/downloads',
      'GET /events',
      'GET /gists',
      'GET /gists/public',
      'GET /gists/starred',
      'GET /gists/{gist_id}/comments',
      'GET /gists/{gist_id}/commits',
      'GET /gists/{gist_id}/forks',
      'GET /installation/repositories',
      'GET /issues',
      'GET /marketplace_listing/plans',
      'GET /marketplace_listing/plans/{plan_id}/accounts',
      'GET /marketplace_listing/stubbed/plans',
      'GET /marketplace_listing/stubbed/plans/{plan_id}/accounts',
      'GET /networks/{owner}/{repo}/events',
      'GET /notifications',
      'GET /organizations',
      'GET /orgs/{org}/actions/permissions/repositories',
      'GET /orgs/{org}/actions/runner-groups',
      'GET /orgs/{org}/actions/runner-groups/{runner_group_id}/repositories',
      'GET /orgs/{org}/actions/runner-groups/{runner_group_id}/runners',
      'GET /orgs/{org}/actions/runners',
      'GET /orgs/{org}/actions/runners/downloads',
      'GET /orgs/{org}/actions/secrets',
      'GET /orgs/{org}/actions/secrets/{secret_name}/repositories',
      'GET /orgs/{org}/blocks',
      'GET /orgs/{org}/credential-authorizations',
      'GET /orgs/{org}/events',
      'GET /orgs/{org}/failed_invitations',
      'GET /orgs/{org}/hooks',
      'GET /orgs/{org}/hooks/{hook_id}/deliveries',
      'GET /orgs/{org}/installations',
      'GET /orgs/{org}/invitations',
      'GET /orgs/{org}/invitations/{invitation_id}/teams',
      'GET /orgs/{org}/issues',
      'GET /orgs/{org}/members',
      'GET /orgs/{org}/migrations',
      'GET /orgs/{org}/migrations/{migration_id}/repositories',
      'GET /orgs/{org}/outside_collaborators',
      'GET /orgs/{org}/packages',
      'GET /orgs/{org}/projects',
      'GET /orgs/{org}/public_members',
      'GET /orgs/{org}/repos',
      'GET /orgs/{org}/secret-scanning/alerts',
      'GET /orgs/{org}/team-sync/groups',
      'GET /orgs/{org}/teams',
      'GET /orgs/{org}/teams/{team_slug}/discussions',
      'GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments',
      'GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}/reactions',
      'GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/reactions',
      'GET /orgs/{org}/teams/{team_slug}/invitations',
      'GET /orgs/{org}/teams/{team_slug}/members',
      'GET /orgs/{org}/teams/{team_slug}/projects',
      'GET /orgs/{org}/teams/{team_slug}/repos',
      'GET /orgs/{org}/teams/{team_slug}/team-sync/group-mappings',
      'GET /orgs/{org}/teams/{team_slug}/teams',
      'GET /projects/columns/{column_id}/cards',
      'GET /projects/{project_id}/collaborators',
      'GET /projects/{project_id}/columns',
      'GET /repos/{owner}/{repo}/actions/artifacts',
      'GET /repos/{owner}/{repo}/actions/runners',
      'GET /repos/{owner}/{repo}/actions/runners/downloads',
      'GET /repos/{owner}/{repo}/actions/runs',
      'GET /repos/{owner}/{repo}/actions/runs/{run_id}/artifacts',
      'GET /repos/{owner}/{repo}/actions/runs/{run_id}/jobs',
      'GET /repos/{owner}/{repo}/actions/secrets',
      'GET /repos/{owner}/{repo}/actions/workflows',
      'GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/runs',
      'GET /repos/{owner}/{repo}/assignees',
      'GET /repos/{owner}/{repo}/autolinks',
      'GET /repos/{owner}/{repo}/branches',
      'GET /repos/{owner}/{repo}/check-runs/{check_run_id}/annotations',
      'GET /repos/{owner}/{repo}/check-suites/{check_suite_id}/check-runs',
      'GET /repos/{owner}/{repo}/code-scanning/alerts',
      'GET /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}/instances',
      'GET /repos/{owner}/{repo}/code-scanning/analyses',
      'GET /repos/{owner}/{repo}/collaborators',
      'GET /repos/{owner}/{repo}/comments',
      'GET /repos/{owner}/{repo}/comments/{comment_id}/reactions',
      'GET /repos/{owner}/{repo}/commits',
      'GET /repos/{owner}/{repo}/commits/{commit_sha}/branches-where-head',
      'GET /repos/{owner}/{repo}/commits/{commit_sha}/comments',
      'GET /repos/{owner}/{repo}/commits/{commit_sha}/pulls',
      'GET /repos/{owner}/{repo}/commits/{ref}/check-runs',
      'GET /repos/{owner}/{repo}/commits/{ref}/check-suites',
      'GET /repos/{owner}/{repo}/commits/{ref}/statuses',
      'GET /repos/{owner}/{repo}/contributors',
      'GET /repos/{owner}/{repo}/deployments',
      'GET /repos/{owner}/{repo}/deployments/{deployment_id}/statuses',
      'GET /repos/{owner}/{repo}/events',
      'GET /repos/{owner}/{repo}/forks',
      'GET /repos/{owner}/{repo}/git/matching-refs/{ref}',
      'GET /repos/{owner}/{repo}/hooks',
      'GET /repos/{owner}/{repo}/hooks/{hook_id}/deliveries',
      'GET /repos/{owner}/{repo}/invitations',
      'GET /repos/{owner}/{repo}/issues',
      'GET /repos/{owner}/{repo}/issues/comments',
      'GET /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions',
      'GET /repos/{owner}/{repo}/issues/events',
      'GET /repos/{owner}/{repo}/issues/{issue_number}/comments',
      'GET /repos/{owner}/{repo}/issues/{issue_number}/events',
      'GET /repos/{owner}/{repo}/issues/{issue_number}/labels',
      'GET /repos/{owner}/{repo}/issues/{issue_number}/reactions',
      'GET /repos/{owner}/{repo}/issues/{issue_number}/timeline',
      'GET /repos/{owner}/{repo}/keys',
      'GET /repos/{owner}/{repo}/labels',
      'GET /repos/{owner}/{repo}/milestones',
      'GET /repos/{owner}/{repo}/milestones/{milestone_number}/labels',
      'GET /repos/{owner}/{repo}/notifications',
      'GET /repos/{owner}/{repo}/pages/builds',
      'GET /repos/{owner}/{repo}/projects',
      'GET /repos/{owner}/{repo}/pulls',
      'GET /repos/{owner}/{repo}/pulls/comments',
      'GET /repos/{owner}/{repo}/pulls/comments/{comment_id}/reactions',
      'GET /repos/{owner}/{repo}/pulls/{pull_number}/comments',
      'GET /repos/{owner}/{repo}/pulls/{pull_number}/commits',
      'GET /repos/{owner}/{repo}/pulls/{pull_number}/files',
      'GET /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers',
      'GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews',
      'GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/comments',
      'GET /repos/{owner}/{repo}/releases',
      'GET /repos/{owner}/{repo}/releases/{release_id}/assets',
      'GET /repos/{owner}/{repo}/secret-scanning/alerts',
      'GET /repos/{owner}/{repo}/stargazers',
      'GET /repos/{owner}/{repo}/subscribers',
      'GET /repos/{owner}/{repo}/tags',
      'GET /repos/{owner}/{repo}/teams',
      'GET /repositories',
      'GET /repositories/{repository_id}/environments/{environment_name}/secrets',
      'GET /scim/v2/enterprises/{enterprise}/Groups',
      'GET /scim/v2/enterprises/{enterprise}/Users',
      'GET /scim/v2/organizations/{org}/Users',
      'GET /search/code',
      'GET /search/commits',
      'GET /search/issues',
      'GET /search/labels',
      'GET /search/repositories',
      'GET /search/topics',
      'GET /search/users',
      'GET /teams/{team_id}/discussions',
      'GET /teams/{team_id}/discussions/{discussion_number}/comments',
      'GET /teams/{team_id}/discussions/{discussion_number}/comments/{comment_number}/reactions',
      'GET /teams/{team_id}/discussions/{discussion_number}/reactions',
      'GET /teams/{team_id}/invitations',
      'GET /teams/{team_id}/members',
      'GET /teams/{team_id}/projects',
      'GET /teams/{team_id}/repos',
      'GET /teams/{team_id}/team-sync/group-mappings',
      'GET /teams/{team_id}/teams',
      'GET /user/blocks',
      'GET /user/emails',
      'GET /user/followers',
      'GET /user/following',
      'GET /user/gpg_keys',
      'GET /user/installations',
      'GET /user/installations/{installation_id}/repositories',
      'GET /user/issues',
      'GET /user/keys',
      'GET /user/marketplace_purchases',
      'GET /user/marketplace_purchases/stubbed',
      'GET /user/memberships/orgs',
      'GET /user/migrations',
      'GET /user/migrations/{migration_id}/repositories',
      'GET /user/orgs',
      'GET /user/packages',
      'GET /user/public_emails',
      'GET /user/repos',
      'GET /user/repository_invitations',
      'GET /user/starred',
      'GET /user/subscriptions',
      'GET /user/teams',
      'GET /user/{username}/packages',
      'GET /users',
      'GET /users/{username}/events',
      'GET /users/{username}/events/orgs/{org}',
      'GET /users/{username}/events/public',
      'GET /users/{username}/followers',
      'GET /users/{username}/following',
      'GET /users/{username}/gists',
      'GET /users/{username}/gpg_keys',
      'GET /users/{username}/keys',
      'GET /users/{username}/orgs',
      'GET /users/{username}/projects',
      'GET /users/{username}/received_events',
      'GET /users/{username}/received_events/public',
      'GET /users/{username}/repos',
      'GET /users/{username}/starred',
      'GET /users/{username}/subscriptions'
    ];
    function isPaginatingEndpoint(arg) {
      if (typeof arg === 'string') {
        return paginatingEndpoints.includes(arg);
      } else {
        return false;
      }
    }
    function paginateRest(octokit) {
      return {
        paginate: Object.assign(paginate.bind(null, octokit), {
          iterator: iterator.bind(null, octokit)
        })
      };
    }
    paginateRest.VERSION = VERSION;
    exports2.composePaginateRest = composePaginateRest;
    exports2.isPaginatingEndpoint = isPaginatingEndpoint;
    exports2.paginateRest = paginateRest;
    exports2.paginatingEndpoints = paginatingEndpoints;
  }
});

// node_modules/@actions/github/lib/utils.js
var require_utils3 = __commonJS({
  'node_modules/@actions/github/lib/utils.js'(exports2) {
    'use strict';
    var __createBinding =
      (exports2 && exports2.__createBinding) ||
      (Object.create
        ? function (o, m, k, k2) {
            if (k2 === void 0) k2 = k;
            Object.defineProperty(o, k2, {
              enumerable: true,
              get: function () {
                return m[k];
              }
            });
          }
        : function (o, m, k, k2) {
            if (k2 === void 0) k2 = k;
            o[k2] = m[k];
          });
    var __setModuleDefault =
      (exports2 && exports2.__setModuleDefault) ||
      (Object.create
        ? function (o, v) {
            Object.defineProperty(o, 'default', { enumerable: true, value: v });
          }
        : function (o, v) {
            o['default'] = v;
          });
    var __importStar =
      (exports2 && exports2.__importStar) ||
      function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) {
          for (var k in mod)
            if (k !== 'default' && Object.hasOwnProperty.call(mod, k))
              __createBinding(result, mod, k);
        }
        __setModuleDefault(result, mod);
        return result;
      };
    Object.defineProperty(exports2, '__esModule', { value: true });
    exports2.getOctokitOptions = exports2.GitHub = exports2.context = void 0;
    var Context = __importStar(require_context());
    var Utils = __importStar(require_utils2());
    var core_1 = require_dist_node8();
    var plugin_rest_endpoint_methods_1 = require_dist_node9();
    var plugin_paginate_rest_1 = require_dist_node10();
    exports2.context = new Context.Context();
    var baseUrl = Utils.getApiBaseUrl();
    var defaults = {
      baseUrl,
      request: {
        agent: Utils.getProxyAgent(baseUrl)
      }
    };
    exports2.GitHub = core_1.Octokit.plugin(
      plugin_rest_endpoint_methods_1.restEndpointMethods,
      plugin_paginate_rest_1.paginateRest
    ).defaults(defaults);
    function getOctokitOptions(token2, options) {
      const opts = Object.assign({}, options || {});
      const auth = Utils.getAuthString(token2, opts);
      if (auth) {
        opts.auth = auth;
      }
      return opts;
    }
    exports2.getOctokitOptions = getOctokitOptions;
  }
});

// node_modules/@actions/github/lib/github.js
var require_github = __commonJS({
  'node_modules/@actions/github/lib/github.js'(exports2) {
    'use strict';
    var __createBinding =
      (exports2 && exports2.__createBinding) ||
      (Object.create
        ? function (o, m, k, k2) {
            if (k2 === void 0) k2 = k;
            Object.defineProperty(o, k2, {
              enumerable: true,
              get: function () {
                return m[k];
              }
            });
          }
        : function (o, m, k, k2) {
            if (k2 === void 0) k2 = k;
            o[k2] = m[k];
          });
    var __setModuleDefault =
      (exports2 && exports2.__setModuleDefault) ||
      (Object.create
        ? function (o, v) {
            Object.defineProperty(o, 'default', { enumerable: true, value: v });
          }
        : function (o, v) {
            o['default'] = v;
          });
    var __importStar =
      (exports2 && exports2.__importStar) ||
      function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) {
          for (var k in mod)
            if (k !== 'default' && Object.hasOwnProperty.call(mod, k))
              __createBinding(result, mod, k);
        }
        __setModuleDefault(result, mod);
        return result;
      };
    Object.defineProperty(exports2, '__esModule', { value: true });
    exports2.getOctokit = exports2.context = void 0;
    var Context = __importStar(require_context());
    var utils_1 = require_utils3();
    exports2.context = new Context.Context();
    function getOctokit(token2, options) {
      return new utils_1.GitHub(utils_1.getOctokitOptions(token2, options));
    }
    exports2.getOctokit = getOctokit;
  }
});

// src/git-commands.js
var require_git_commands = __commonJS({
  'src/git-commands.js'(exports2, module2) {
    var { spawnSync } = require('child_process');
    var core2 = require_core();
    var gitSpawnOptions = {
      maxBuffer: Infinity
    };
    function git(command, args) {
      args = args || [];
      const processResult = spawnSync('git', [command, ...args], gitSpawnOptions);
      if (processResult.status !== 0) throw new Error('Failed running git.');
      return processResult.stdout.toString().trim();
    }
    module2.exports = {
      listTags: () => {
        let tags = git('tag');
        if (!tags) {
          core2.warning(
            'There do not appear to be any tags on the repository.  If that is not accurate, ensure fetch-depth: 0 is set on the checkout action.'
          );
          return [];
        }
        core2.info(`The following tags exist on the repository:
${tags}
`);
        return tags.split('\n');
      },
      isAncestor: (ancestorCommitish, descendantCommitish) => {
        let processResult = spawnSync('git', [
          'merge-base',
          '--is-ancestor',
          ancestorCommitish,
          descendantCommitish
        ]);
        if (processResult.status === 0) {
          return true;
        } else if (processResult.status !== 1) {
          throw new Error('Failed running git.');
        }
      },
      commitMetadata: committish => {
        const gitOutput = git('log', ['-1', '--format=%h%n%at%n%ct', committish]);
        const lines = gitOutput.split('\n');
        const shortHash = lines[0];
        const authorDate = new Date(+(lines[1] + '000'));
        const committerDate = new Date(+(lines[2] + '000'));
        return {
          abbreviatedCommitHash: shortHash,
          authorDate,
          committerDate
        };
      },
      logBetween: (baseCommittish, finalCommittish) => {
        const gitOutput = git('log', [
          `${baseCommittish}..${finalCommittish}`,
          '--format=%H%x1d%h%x1d%an%x1d%ae%x1d%at%x1d%cn%x1d%ce%x1d%ct%x1d%B%x1d%N%x1e'
        ]);
        const commits = gitOutput.split('');
        return commits.map(commit => {
          let props = commit.split('');
          return {
            commitHash: props[0],
            abbreviatedCommitHash: props[1],
            authorName: props[2],
            authorEmail: props[3],
            authorDate: new Date(+(props[4] + '000')),
            committerName: props[5],
            committerEmail: props[6],
            committerDate: new Date(+(props[7] + '000')),
            rawBody: props[8],
            commitNotes: props[9]
          };
        });
      }
    };
  }
});

// node_modules/semver/internal/constants.js
var require_constants = __commonJS({
  'node_modules/semver/internal/constants.js'(exports2, module2) {
    var SEMVER_SPEC_VERSION = '2.0.0';
    var MAX_LENGTH = 256;
    var MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || 9007199254740991;
    var MAX_SAFE_COMPONENT_LENGTH = 16;
    module2.exports = {
      SEMVER_SPEC_VERSION,
      MAX_LENGTH,
      MAX_SAFE_INTEGER,
      MAX_SAFE_COMPONENT_LENGTH
    };
  }
});

// node_modules/semver/internal/debug.js
var require_debug = __commonJS({
  'node_modules/semver/internal/debug.js'(exports2, module2) {
    var debug =
      typeof process === 'object' &&
      process.env &&
      process.env.NODE_DEBUG &&
      /\bsemver\b/i.test(process.env.NODE_DEBUG)
        ? (...args) => console.error('SEMVER', ...args)
        : () => {};
    module2.exports = debug;
  }
});

// node_modules/semver/internal/re.js
var require_re = __commonJS({
  'node_modules/semver/internal/re.js'(exports2, module2) {
    var { MAX_SAFE_COMPONENT_LENGTH } = require_constants();
    var debug = require_debug();
    exports2 = module2.exports = {};
    var re = (exports2.re = []);
    var src = (exports2.src = []);
    var t = (exports2.t = {});
    var R = 0;
    var createToken = (name, value, isGlobal) => {
      const index = R++;
      debug(index, value);
      t[name] = index;
      src[index] = value;
      re[index] = new RegExp(value, isGlobal ? 'g' : void 0);
    };
    createToken('NUMERICIDENTIFIER', '0|[1-9]\\d*');
    createToken('NUMERICIDENTIFIERLOOSE', '[0-9]+');
    createToken('NONNUMERICIDENTIFIER', '\\d*[a-zA-Z-][a-zA-Z0-9-]*');
    createToken(
      'MAINVERSION',
      `(${src[t.NUMERICIDENTIFIER]})\\.(${src[t.NUMERICIDENTIFIER]})\\.(${
        src[t.NUMERICIDENTIFIER]
      })`
    );
    createToken(
      'MAINVERSIONLOOSE',
      `(${src[t.NUMERICIDENTIFIERLOOSE]})\\.(${src[t.NUMERICIDENTIFIERLOOSE]})\\.(${
        src[t.NUMERICIDENTIFIERLOOSE]
      })`
    );
    createToken(
      'PRERELEASEIDENTIFIER',
      `(?:${src[t.NUMERICIDENTIFIER]}|${src[t.NONNUMERICIDENTIFIER]})`
    );
    createToken(
      'PRERELEASEIDENTIFIERLOOSE',
      `(?:${src[t.NUMERICIDENTIFIERLOOSE]}|${src[t.NONNUMERICIDENTIFIER]})`
    );
    createToken(
      'PRERELEASE',
      `(?:-(${src[t.PRERELEASEIDENTIFIER]}(?:\\.${src[t.PRERELEASEIDENTIFIER]})*))`
    );
    createToken(
      'PRERELEASELOOSE',
      `(?:-?(${src[t.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${src[t.PRERELEASEIDENTIFIERLOOSE]})*))`
    );
    createToken('BUILDIDENTIFIER', '[0-9A-Za-z-]+');
    createToken('BUILD', `(?:\\+(${src[t.BUILDIDENTIFIER]}(?:\\.${src[t.BUILDIDENTIFIER]})*))`);
    createToken('FULLPLAIN', `v?${src[t.MAINVERSION]}${src[t.PRERELEASE]}?${src[t.BUILD]}?`);
    createToken('FULL', `^${src[t.FULLPLAIN]}$`);
    createToken(
      'LOOSEPLAIN',
      `[v=\\s]*${src[t.MAINVERSIONLOOSE]}${src[t.PRERELEASELOOSE]}?${src[t.BUILD]}?`
    );
    createToken('LOOSE', `^${src[t.LOOSEPLAIN]}$`);
    createToken('GTLT', '((?:<|>)?=?)');
    createToken('XRANGEIDENTIFIERLOOSE', `${src[t.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`);
    createToken('XRANGEIDENTIFIER', `${src[t.NUMERICIDENTIFIER]}|x|X|\\*`);
    createToken(
      'XRANGEPLAIN',
      `[v=\\s]*(${src[t.XRANGEIDENTIFIER]})(?:\\.(${src[t.XRANGEIDENTIFIER]})(?:\\.(${
        src[t.XRANGEIDENTIFIER]
      })(?:${src[t.PRERELEASE]})?${src[t.BUILD]}?)?)?`
    );
    createToken(
      'XRANGEPLAINLOOSE',
      `[v=\\s]*(${src[t.XRANGEIDENTIFIERLOOSE]})(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})(?:\\.(${
        src[t.XRANGEIDENTIFIERLOOSE]
      })(?:${src[t.PRERELEASELOOSE]})?${src[t.BUILD]}?)?)?`
    );
    createToken('XRANGE', `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAIN]}$`);
    createToken('XRANGELOOSE', `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAINLOOSE]}$`);
    createToken(
      'COERCE',
      `${'(^|[^\\d])(\\d{1,'}${MAX_SAFE_COMPONENT_LENGTH}})(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?(?:$|[^\\d])`
    );
    createToken('COERCERTL', src[t.COERCE], true);
    createToken('LONETILDE', '(?:~>?)');
    createToken('TILDETRIM', `(\\s*)${src[t.LONETILDE]}\\s+`, true);
    exports2.tildeTrimReplace = '$1~';
    createToken('TILDE', `^${src[t.LONETILDE]}${src[t.XRANGEPLAIN]}$`);
    createToken('TILDELOOSE', `^${src[t.LONETILDE]}${src[t.XRANGEPLAINLOOSE]}$`);
    createToken('LONECARET', '(?:\\^)');
    createToken('CARETTRIM', `(\\s*)${src[t.LONECARET]}\\s+`, true);
    exports2.caretTrimReplace = '$1^';
    createToken('CARET', `^${src[t.LONECARET]}${src[t.XRANGEPLAIN]}$`);
    createToken('CARETLOOSE', `^${src[t.LONECARET]}${src[t.XRANGEPLAINLOOSE]}$`);
    createToken('COMPARATORLOOSE', `^${src[t.GTLT]}\\s*(${src[t.LOOSEPLAIN]})$|^$`);
    createToken('COMPARATOR', `^${src[t.GTLT]}\\s*(${src[t.FULLPLAIN]})$|^$`);
    createToken(
      'COMPARATORTRIM',
      `(\\s*)${src[t.GTLT]}\\s*(${src[t.LOOSEPLAIN]}|${src[t.XRANGEPLAIN]})`,
      true
    );
    exports2.comparatorTrimReplace = '$1$2$3';
    createToken('HYPHENRANGE', `^\\s*(${src[t.XRANGEPLAIN]})\\s+-\\s+(${src[t.XRANGEPLAIN]})\\s*$`);
    createToken(
      'HYPHENRANGELOOSE',
      `^\\s*(${src[t.XRANGEPLAINLOOSE]})\\s+-\\s+(${src[t.XRANGEPLAINLOOSE]})\\s*$`
    );
    createToken('STAR', '(<|>)?=?\\s*\\*');
    createToken('GTE0', '^\\s*>=\\s*0.0.0\\s*$');
    createToken('GTE0PRE', '^\\s*>=\\s*0.0.0-0\\s*$');
  }
});

// node_modules/semver/internal/parse-options.js
var require_parse_options = __commonJS({
  'node_modules/semver/internal/parse-options.js'(exports2, module2) {
    var opts = ['includePrerelease', 'loose', 'rtl'];
    var parseOptions = options =>
      !options
        ? {}
        : typeof options !== 'object'
        ? { loose: true }
        : opts
            .filter(k => options[k])
            .reduce((options2, k) => {
              options2[k] = true;
              return options2;
            }, {});
    module2.exports = parseOptions;
  }
});

// node_modules/semver/internal/identifiers.js
var require_identifiers = __commonJS({
  'node_modules/semver/internal/identifiers.js'(exports2, module2) {
    var numeric = /^[0-9]+$/;
    var compareIdentifiers = (a, b) => {
      const anum = numeric.test(a);
      const bnum = numeric.test(b);
      if (anum && bnum) {
        a = +a;
        b = +b;
      }
      return a === b ? 0 : anum && !bnum ? -1 : bnum && !anum ? 1 : a < b ? -1 : 1;
    };
    var rcompareIdentifiers = (a, b) => compareIdentifiers(b, a);
    module2.exports = {
      compareIdentifiers,
      rcompareIdentifiers
    };
  }
});

// node_modules/semver/classes/semver.js
var require_semver = __commonJS({
  'node_modules/semver/classes/semver.js'(exports2, module2) {
    var debug = require_debug();
    var { MAX_LENGTH, MAX_SAFE_INTEGER } = require_constants();
    var { re, t } = require_re();
    var parseOptions = require_parse_options();
    var { compareIdentifiers } = require_identifiers();
    var SemVer = class {
      constructor(version, options) {
        options = parseOptions(options);
        if (version instanceof SemVer) {
          if (
            version.loose === !!options.loose &&
            version.includePrerelease === !!options.includePrerelease
          ) {
            return version;
          } else {
            version = version.version;
          }
        } else if (typeof version !== 'string') {
          throw new TypeError(`Invalid Version: ${version}`);
        }
        if (version.length > MAX_LENGTH) {
          throw new TypeError(`version is longer than ${MAX_LENGTH} characters`);
        }
        debug('SemVer', version, options);
        this.options = options;
        this.loose = !!options.loose;
        this.includePrerelease = !!options.includePrerelease;
        const m = version.trim().match(options.loose ? re[t.LOOSE] : re[t.FULL]);
        if (!m) {
          throw new TypeError(`Invalid Version: ${version}`);
        }
        this.raw = version;
        this.major = +m[1];
        this.minor = +m[2];
        this.patch = +m[3];
        if (this.major > MAX_SAFE_INTEGER || this.major < 0) {
          throw new TypeError('Invalid major version');
        }
        if (this.minor > MAX_SAFE_INTEGER || this.minor < 0) {
          throw new TypeError('Invalid minor version');
        }
        if (this.patch > MAX_SAFE_INTEGER || this.patch < 0) {
          throw new TypeError('Invalid patch version');
        }
        if (!m[4]) {
          this.prerelease = [];
        } else {
          this.prerelease = m[4].split('.').map(id => {
            if (/^[0-9]+$/.test(id)) {
              const num = +id;
              if (num >= 0 && num < MAX_SAFE_INTEGER) {
                return num;
              }
            }
            return id;
          });
        }
        this.build = m[5] ? m[5].split('.') : [];
        this.format();
      }
      format() {
        this.version = `${this.major}.${this.minor}.${this.patch}`;
        if (this.prerelease.length) {
          this.version += `-${this.prerelease.join('.')}`;
        }
        return this.version;
      }
      toString() {
        return this.version;
      }
      compare(other) {
        debug('SemVer.compare', this.version, this.options, other);
        if (!(other instanceof SemVer)) {
          if (typeof other === 'string' && other === this.version) {
            return 0;
          }
          other = new SemVer(other, this.options);
        }
        if (other.version === this.version) {
          return 0;
        }
        return this.compareMain(other) || this.comparePre(other);
      }
      compareMain(other) {
        if (!(other instanceof SemVer)) {
          other = new SemVer(other, this.options);
        }
        return (
          compareIdentifiers(this.major, other.major) ||
          compareIdentifiers(this.minor, other.minor) ||
          compareIdentifiers(this.patch, other.patch)
        );
      }
      comparePre(other) {
        if (!(other instanceof SemVer)) {
          other = new SemVer(other, this.options);
        }
        if (this.prerelease.length && !other.prerelease.length) {
          return -1;
        } else if (!this.prerelease.length && other.prerelease.length) {
          return 1;
        } else if (!this.prerelease.length && !other.prerelease.length) {
          return 0;
        }
        let i = 0;
        do {
          const a = this.prerelease[i];
          const b = other.prerelease[i];
          debug('prerelease compare', i, a, b);
          if (a === void 0 && b === void 0) {
            return 0;
          } else if (b === void 0) {
            return 1;
          } else if (a === void 0) {
            return -1;
          } else if (a === b) {
            continue;
          } else {
            return compareIdentifiers(a, b);
          }
        } while (++i);
      }
      compareBuild(other) {
        if (!(other instanceof SemVer)) {
          other = new SemVer(other, this.options);
        }
        let i = 0;
        do {
          const a = this.build[i];
          const b = other.build[i];
          debug('prerelease compare', i, a, b);
          if (a === void 0 && b === void 0) {
            return 0;
          } else if (b === void 0) {
            return 1;
          } else if (a === void 0) {
            return -1;
          } else if (a === b) {
            continue;
          } else {
            return compareIdentifiers(a, b);
          }
        } while (++i);
      }
      inc(release, identifier) {
        switch (release) {
          case 'premajor':
            this.prerelease.length = 0;
            this.patch = 0;
            this.minor = 0;
            this.major++;
            this.inc('pre', identifier);
            break;
          case 'preminor':
            this.prerelease.length = 0;
            this.patch = 0;
            this.minor++;
            this.inc('pre', identifier);
            break;
          case 'prepatch':
            this.prerelease.length = 0;
            this.inc('patch', identifier);
            this.inc('pre', identifier);
            break;
          case 'prerelease':
            if (this.prerelease.length === 0) {
              this.inc('patch', identifier);
            }
            this.inc('pre', identifier);
            break;
          case 'major':
            if (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) {
              this.major++;
            }
            this.minor = 0;
            this.patch = 0;
            this.prerelease = [];
            break;
          case 'minor':
            if (this.patch !== 0 || this.prerelease.length === 0) {
              this.minor++;
            }
            this.patch = 0;
            this.prerelease = [];
            break;
          case 'patch':
            if (this.prerelease.length === 0) {
              this.patch++;
            }
            this.prerelease = [];
            break;
          case 'pre':
            if (this.prerelease.length === 0) {
              this.prerelease = [0];
            } else {
              let i = this.prerelease.length;
              while (--i >= 0) {
                if (typeof this.prerelease[i] === 'number') {
                  this.prerelease[i]++;
                  i = -2;
                }
              }
              if (i === -1) {
                this.prerelease.push(0);
              }
            }
            if (identifier) {
              if (this.prerelease[0] === identifier) {
                if (isNaN(this.prerelease[1])) {
                  this.prerelease = [identifier, 0];
                }
              } else {
                this.prerelease = [identifier, 0];
              }
            }
            break;
          default:
            throw new Error(`invalid increment argument: ${release}`);
        }
        this.format();
        this.raw = this.version;
        return this;
      }
    };
    module2.exports = SemVer;
  }
});

// node_modules/semver/functions/parse.js
var require_parse = __commonJS({
  'node_modules/semver/functions/parse.js'(exports2, module2) {
    var { MAX_LENGTH } = require_constants();
    var { re, t } = require_re();
    var SemVer = require_semver();
    var parseOptions = require_parse_options();
    var parse = (version, options) => {
      options = parseOptions(options);
      if (version instanceof SemVer) {
        return version;
      }
      if (typeof version !== 'string') {
        return null;
      }
      if (version.length > MAX_LENGTH) {
        return null;
      }
      const r = options.loose ? re[t.LOOSE] : re[t.FULL];
      if (!r.test(version)) {
        return null;
      }
      try {
        return new SemVer(version, options);
      } catch (er) {
        return null;
      }
    };
    module2.exports = parse;
  }
});

// node_modules/semver/functions/valid.js
var require_valid = __commonJS({
  'node_modules/semver/functions/valid.js'(exports2, module2) {
    var parse = require_parse();
    var valid = (version, options) => {
      const v = parse(version, options);
      return v ? v.version : null;
    };
    module2.exports = valid;
  }
});

// node_modules/semver/functions/clean.js
var require_clean = __commonJS({
  'node_modules/semver/functions/clean.js'(exports2, module2) {
    var parse = require_parse();
    var clean = (version, options) => {
      const s = parse(version.trim().replace(/^[=v]+/, ''), options);
      return s ? s.version : null;
    };
    module2.exports = clean;
  }
});

// node_modules/semver/functions/inc.js
var require_inc = __commonJS({
  'node_modules/semver/functions/inc.js'(exports2, module2) {
    var SemVer = require_semver();
    var inc = (version, release, options, identifier) => {
      if (typeof options === 'string') {
        identifier = options;
        options = void 0;
      }
      try {
        return new SemVer(version, options).inc(release, identifier).version;
      } catch (er) {
        return null;
      }
    };
    module2.exports = inc;
  }
});

// node_modules/semver/functions/compare.js
var require_compare = __commonJS({
  'node_modules/semver/functions/compare.js'(exports2, module2) {
    var SemVer = require_semver();
    var compare = (a, b, loose) => new SemVer(a, loose).compare(new SemVer(b, loose));
    module2.exports = compare;
  }
});

// node_modules/semver/functions/eq.js
var require_eq = __commonJS({
  'node_modules/semver/functions/eq.js'(exports2, module2) {
    var compare = require_compare();
    var eq = (a, b, loose) => compare(a, b, loose) === 0;
    module2.exports = eq;
  }
});

// node_modules/semver/functions/diff.js
var require_diff = __commonJS({
  'node_modules/semver/functions/diff.js'(exports2, module2) {
    var parse = require_parse();
    var eq = require_eq();
    var diff = (version1, version2) => {
      if (eq(version1, version2)) {
        return null;
      } else {
        const v1 = parse(version1);
        const v2 = parse(version2);
        const hasPre = v1.prerelease.length || v2.prerelease.length;
        const prefix = hasPre ? 'pre' : '';
        const defaultResult = hasPre ? 'prerelease' : '';
        for (const key in v1) {
          if (key === 'major' || key === 'minor' || key === 'patch') {
            if (v1[key] !== v2[key]) {
              return prefix + key;
            }
          }
        }
        return defaultResult;
      }
    };
    module2.exports = diff;
  }
});

// node_modules/semver/functions/major.js
var require_major = __commonJS({
  'node_modules/semver/functions/major.js'(exports2, module2) {
    var SemVer = require_semver();
    var major = (a, loose) => new SemVer(a, loose).major;
    module2.exports = major;
  }
});

// node_modules/semver/functions/minor.js
var require_minor = __commonJS({
  'node_modules/semver/functions/minor.js'(exports2, module2) {
    var SemVer = require_semver();
    var minor = (a, loose) => new SemVer(a, loose).minor;
    module2.exports = minor;
  }
});

// node_modules/semver/functions/patch.js
var require_patch = __commonJS({
  'node_modules/semver/functions/patch.js'(exports2, module2) {
    var SemVer = require_semver();
    var patch = (a, loose) => new SemVer(a, loose).patch;
    module2.exports = patch;
  }
});

// node_modules/semver/functions/prerelease.js
var require_prerelease = __commonJS({
  'node_modules/semver/functions/prerelease.js'(exports2, module2) {
    var parse = require_parse();
    var prerelease = (version, options) => {
      const parsed = parse(version, options);
      return parsed && parsed.prerelease.length ? parsed.prerelease : null;
    };
    module2.exports = prerelease;
  }
});

// node_modules/semver/functions/rcompare.js
var require_rcompare = __commonJS({
  'node_modules/semver/functions/rcompare.js'(exports2, module2) {
    var compare = require_compare();
    var rcompare = (a, b, loose) => compare(b, a, loose);
    module2.exports = rcompare;
  }
});

// node_modules/semver/functions/compare-loose.js
var require_compare_loose = __commonJS({
  'node_modules/semver/functions/compare-loose.js'(exports2, module2) {
    var compare = require_compare();
    var compareLoose = (a, b) => compare(a, b, true);
    module2.exports = compareLoose;
  }
});

// node_modules/semver/functions/compare-build.js
var require_compare_build = __commonJS({
  'node_modules/semver/functions/compare-build.js'(exports2, module2) {
    var SemVer = require_semver();
    var compareBuild = (a, b, loose) => {
      const versionA = new SemVer(a, loose);
      const versionB = new SemVer(b, loose);
      return versionA.compare(versionB) || versionA.compareBuild(versionB);
    };
    module2.exports = compareBuild;
  }
});

// node_modules/semver/functions/sort.js
var require_sort = __commonJS({
  'node_modules/semver/functions/sort.js'(exports2, module2) {
    var compareBuild = require_compare_build();
    var sort = (list, loose) => list.sort((a, b) => compareBuild(a, b, loose));
    module2.exports = sort;
  }
});

// node_modules/semver/functions/rsort.js
var require_rsort = __commonJS({
  'node_modules/semver/functions/rsort.js'(exports2, module2) {
    var compareBuild = require_compare_build();
    var rsort = (list, loose) => list.sort((a, b) => compareBuild(b, a, loose));
    module2.exports = rsort;
  }
});

// node_modules/semver/functions/gt.js
var require_gt = __commonJS({
  'node_modules/semver/functions/gt.js'(exports2, module2) {
    var compare = require_compare();
    var gt = (a, b, loose) => compare(a, b, loose) > 0;
    module2.exports = gt;
  }
});

// node_modules/semver/functions/lt.js
var require_lt = __commonJS({
  'node_modules/semver/functions/lt.js'(exports2, module2) {
    var compare = require_compare();
    var lt = (a, b, loose) => compare(a, b, loose) < 0;
    module2.exports = lt;
  }
});

// node_modules/semver/functions/neq.js
var require_neq = __commonJS({
  'node_modules/semver/functions/neq.js'(exports2, module2) {
    var compare = require_compare();
    var neq = (a, b, loose) => compare(a, b, loose) !== 0;
    module2.exports = neq;
  }
});

// node_modules/semver/functions/gte.js
var require_gte = __commonJS({
  'node_modules/semver/functions/gte.js'(exports2, module2) {
    var compare = require_compare();
    var gte = (a, b, loose) => compare(a, b, loose) >= 0;
    module2.exports = gte;
  }
});

// node_modules/semver/functions/lte.js
var require_lte = __commonJS({
  'node_modules/semver/functions/lte.js'(exports2, module2) {
    var compare = require_compare();
    var lte = (a, b, loose) => compare(a, b, loose) <= 0;
    module2.exports = lte;
  }
});

// node_modules/semver/functions/cmp.js
var require_cmp = __commonJS({
  'node_modules/semver/functions/cmp.js'(exports2, module2) {
    var eq = require_eq();
    var neq = require_neq();
    var gt = require_gt();
    var gte = require_gte();
    var lt = require_lt();
    var lte = require_lte();
    var cmp = (a, op, b, loose) => {
      switch (op) {
        case '===':
          if (typeof a === 'object') a = a.version;
          if (typeof b === 'object') b = b.version;
          return a === b;
        case '!==':
          if (typeof a === 'object') a = a.version;
          if (typeof b === 'object') b = b.version;
          return a !== b;
        case '':
        case '=':
        case '==':
          return eq(a, b, loose);
        case '!=':
          return neq(a, b, loose);
        case '>':
          return gt(a, b, loose);
        case '>=':
          return gte(a, b, loose);
        case '<':
          return lt(a, b, loose);
        case '<=':
          return lte(a, b, loose);
        default:
          throw new TypeError(`Invalid operator: ${op}`);
      }
    };
    module2.exports = cmp;
  }
});

// node_modules/semver/functions/coerce.js
var require_coerce = __commonJS({
  'node_modules/semver/functions/coerce.js'(exports2, module2) {
    var SemVer = require_semver();
    var parse = require_parse();
    var { re, t } = require_re();
    var coerce = (version, options) => {
      if (version instanceof SemVer) {
        return version;
      }
      if (typeof version === 'number') {
        version = String(version);
      }
      if (typeof version !== 'string') {
        return null;
      }
      options = options || {};
      let match = null;
      if (!options.rtl) {
        match = version.match(re[t.COERCE]);
      } else {
        let next;
        while (
          (next = re[t.COERCERTL].exec(version)) &&
          (!match || match.index + match[0].length !== version.length)
        ) {
          if (!match || next.index + next[0].length !== match.index + match[0].length) {
            match = next;
          }
          re[t.COERCERTL].lastIndex = next.index + next[1].length + next[2].length;
        }
        re[t.COERCERTL].lastIndex = -1;
      }
      if (match === null) return null;
      return parse(`${match[2]}.${match[3] || '0'}.${match[4] || '0'}`, options);
    };
    module2.exports = coerce;
  }
});

// node_modules/yallist/iterator.js
var require_iterator = __commonJS({
  'node_modules/yallist/iterator.js'(exports2, module2) {
    'use strict';
    module2.exports = function (Yallist) {
      Yallist.prototype[Symbol.iterator] = function* () {
        for (let walker = this.head; walker; walker = walker.next) {
          yield walker.value;
        }
      };
    };
  }
});

// node_modules/yallist/yallist.js
var require_yallist = __commonJS({
  'node_modules/yallist/yallist.js'(exports2, module2) {
    'use strict';
    module2.exports = Yallist;
    Yallist.Node = Node;
    Yallist.create = Yallist;
    function Yallist(list) {
      var self = this;
      if (!(self instanceof Yallist)) {
        self = new Yallist();
      }
      self.tail = null;
      self.head = null;
      self.length = 0;
      if (list && typeof list.forEach === 'function') {
        list.forEach(function (item) {
          self.push(item);
        });
      } else if (arguments.length > 0) {
        for (var i = 0, l = arguments.length; i < l; i++) {
          self.push(arguments[i]);
        }
      }
      return self;
    }
    Yallist.prototype.removeNode = function (node) {
      if (node.list !== this) {
        throw new Error('removing node which does not belong to this list');
      }
      var next = node.next;
      var prev = node.prev;
      if (next) {
        next.prev = prev;
      }
      if (prev) {
        prev.next = next;
      }
      if (node === this.head) {
        this.head = next;
      }
      if (node === this.tail) {
        this.tail = prev;
      }
      node.list.length--;
      node.next = null;
      node.prev = null;
      node.list = null;
      return next;
    };
    Yallist.prototype.unshiftNode = function (node) {
      if (node === this.head) {
        return;
      }
      if (node.list) {
        node.list.removeNode(node);
      }
      var head = this.head;
      node.list = this;
      node.next = head;
      if (head) {
        head.prev = node;
      }
      this.head = node;
      if (!this.tail) {
        this.tail = node;
      }
      this.length++;
    };
    Yallist.prototype.pushNode = function (node) {
      if (node === this.tail) {
        return;
      }
      if (node.list) {
        node.list.removeNode(node);
      }
      var tail = this.tail;
      node.list = this;
      node.prev = tail;
      if (tail) {
        tail.next = node;
      }
      this.tail = node;
      if (!this.head) {
        this.head = node;
      }
      this.length++;
    };
    Yallist.prototype.push = function () {
      for (var i = 0, l = arguments.length; i < l; i++) {
        push(this, arguments[i]);
      }
      return this.length;
    };
    Yallist.prototype.unshift = function () {
      for (var i = 0, l = arguments.length; i < l; i++) {
        unshift(this, arguments[i]);
      }
      return this.length;
    };
    Yallist.prototype.pop = function () {
      if (!this.tail) {
        return void 0;
      }
      var res = this.tail.value;
      this.tail = this.tail.prev;
      if (this.tail) {
        this.tail.next = null;
      } else {
        this.head = null;
      }
      this.length--;
      return res;
    };
    Yallist.prototype.shift = function () {
      if (!this.head) {
        return void 0;
      }
      var res = this.head.value;
      this.head = this.head.next;
      if (this.head) {
        this.head.prev = null;
      } else {
        this.tail = null;
      }
      this.length--;
      return res;
    };
    Yallist.prototype.forEach = function (fn, thisp) {
      thisp = thisp || this;
      for (var walker = this.head, i = 0; walker !== null; i++) {
        fn.call(thisp, walker.value, i, this);
        walker = walker.next;
      }
    };
    Yallist.prototype.forEachReverse = function (fn, thisp) {
      thisp = thisp || this;
      for (var walker = this.tail, i = this.length - 1; walker !== null; i--) {
        fn.call(thisp, walker.value, i, this);
        walker = walker.prev;
      }
    };
    Yallist.prototype.get = function (n) {
      for (var i = 0, walker = this.head; walker !== null && i < n; i++) {
        walker = walker.next;
      }
      if (i === n && walker !== null) {
        return walker.value;
      }
    };
    Yallist.prototype.getReverse = function (n) {
      for (var i = 0, walker = this.tail; walker !== null && i < n; i++) {
        walker = walker.prev;
      }
      if (i === n && walker !== null) {
        return walker.value;
      }
    };
    Yallist.prototype.map = function (fn, thisp) {
      thisp = thisp || this;
      var res = new Yallist();
      for (var walker = this.head; walker !== null; ) {
        res.push(fn.call(thisp, walker.value, this));
        walker = walker.next;
      }
      return res;
    };
    Yallist.prototype.mapReverse = function (fn, thisp) {
      thisp = thisp || this;
      var res = new Yallist();
      for (var walker = this.tail; walker !== null; ) {
        res.push(fn.call(thisp, walker.value, this));
        walker = walker.prev;
      }
      return res;
    };
    Yallist.prototype.reduce = function (fn, initial) {
      var acc;
      var walker = this.head;
      if (arguments.length > 1) {
        acc = initial;
      } else if (this.head) {
        walker = this.head.next;
        acc = this.head.value;
      } else {
        throw new TypeError('Reduce of empty list with no initial value');
      }
      for (var i = 0; walker !== null; i++) {
        acc = fn(acc, walker.value, i);
        walker = walker.next;
      }
      return acc;
    };
    Yallist.prototype.reduceReverse = function (fn, initial) {
      var acc;
      var walker = this.tail;
      if (arguments.length > 1) {
        acc = initial;
      } else if (this.tail) {
        walker = this.tail.prev;
        acc = this.tail.value;
      } else {
        throw new TypeError('Reduce of empty list with no initial value');
      }
      for (var i = this.length - 1; walker !== null; i--) {
        acc = fn(acc, walker.value, i);
        walker = walker.prev;
      }
      return acc;
    };
    Yallist.prototype.toArray = function () {
      var arr = new Array(this.length);
      for (var i = 0, walker = this.head; walker !== null; i++) {
        arr[i] = walker.value;
        walker = walker.next;
      }
      return arr;
    };
    Yallist.prototype.toArrayReverse = function () {
      var arr = new Array(this.length);
      for (var i = 0, walker = this.tail; walker !== null; i++) {
        arr[i] = walker.value;
        walker = walker.prev;
      }
      return arr;
    };
    Yallist.prototype.slice = function (from, to) {
      to = to || this.length;
      if (to < 0) {
        to += this.length;
      }
      from = from || 0;
      if (from < 0) {
        from += this.length;
      }
      var ret = new Yallist();
      if (to < from || to < 0) {
        return ret;
      }
      if (from < 0) {
        from = 0;
      }
      if (to > this.length) {
        to = this.length;
      }
      for (var i = 0, walker = this.head; walker !== null && i < from; i++) {
        walker = walker.next;
      }
      for (; walker !== null && i < to; i++, walker = walker.next) {
        ret.push(walker.value);
      }
      return ret;
    };
    Yallist.prototype.sliceReverse = function (from, to) {
      to = to || this.length;
      if (to < 0) {
        to += this.length;
      }
      from = from || 0;
      if (from < 0) {
        from += this.length;
      }
      var ret = new Yallist();
      if (to < from || to < 0) {
        return ret;
      }
      if (from < 0) {
        from = 0;
      }
      if (to > this.length) {
        to = this.length;
      }
      for (var i = this.length, walker = this.tail; walker !== null && i > to; i--) {
        walker = walker.prev;
      }
      for (; walker !== null && i > from; i--, walker = walker.prev) {
        ret.push(walker.value);
      }
      return ret;
    };
    Yallist.prototype.splice = function (start, deleteCount, ...nodes) {
      if (start > this.length) {
        start = this.length - 1;
      }
      if (start < 0) {
        start = this.length + start;
      }
      for (var i = 0, walker = this.head; walker !== null && i < start; i++) {
        walker = walker.next;
      }
      var ret = [];
      for (var i = 0; walker && i < deleteCount; i++) {
        ret.push(walker.value);
        walker = this.removeNode(walker);
      }
      if (walker === null) {
        walker = this.tail;
      }
      if (walker !== this.head && walker !== this.tail) {
        walker = walker.prev;
      }
      for (var i = 0; i < nodes.length; i++) {
        walker = insert(this, walker, nodes[i]);
      }
      return ret;
    };
    Yallist.prototype.reverse = function () {
      var head = this.head;
      var tail = this.tail;
      for (var walker = head; walker !== null; walker = walker.prev) {
        var p = walker.prev;
        walker.prev = walker.next;
        walker.next = p;
      }
      this.head = tail;
      this.tail = head;
      return this;
    };
    function insert(self, node, value) {
      var inserted =
        node === self.head
          ? new Node(value, null, node, self)
          : new Node(value, node, node.next, self);
      if (inserted.next === null) {
        self.tail = inserted;
      }
      if (inserted.prev === null) {
        self.head = inserted;
      }
      self.length++;
      return inserted;
    }
    function push(self, item) {
      self.tail = new Node(item, self.tail, null, self);
      if (!self.head) {
        self.head = self.tail;
      }
      self.length++;
    }
    function unshift(self, item) {
      self.head = new Node(item, null, self.head, self);
      if (!self.tail) {
        self.tail = self.head;
      }
      self.length++;
    }
    function Node(value, prev, next, list) {
      if (!(this instanceof Node)) {
        return new Node(value, prev, next, list);
      }
      this.list = list;
      this.value = value;
      if (prev) {
        prev.next = this;
        this.prev = prev;
      } else {
        this.prev = null;
      }
      if (next) {
        next.prev = this;
        this.next = next;
      } else {
        this.next = null;
      }
    }
    try {
      require_iterator()(Yallist);
    } catch (er) {}
  }
});

// node_modules/lru-cache/index.js
var require_lru_cache = __commonJS({
  'node_modules/lru-cache/index.js'(exports2, module2) {
    'use strict';
    var Yallist = require_yallist();
    var MAX = Symbol('max');
    var LENGTH = Symbol('length');
    var LENGTH_CALCULATOR = Symbol('lengthCalculator');
    var ALLOW_STALE = Symbol('allowStale');
    var MAX_AGE = Symbol('maxAge');
    var DISPOSE = Symbol('dispose');
    var NO_DISPOSE_ON_SET = Symbol('noDisposeOnSet');
    var LRU_LIST = Symbol('lruList');
    var CACHE = Symbol('cache');
    var UPDATE_AGE_ON_GET = Symbol('updateAgeOnGet');
    var naiveLength = () => 1;
    var LRUCache = class {
      constructor(options) {
        if (typeof options === 'number') options = { max: options };
        if (!options) options = {};
        if (options.max && (typeof options.max !== 'number' || options.max < 0))
          throw new TypeError('max must be a non-negative number');
        const max = (this[MAX] = options.max || Infinity);
        const lc = options.length || naiveLength;
        this[LENGTH_CALCULATOR] = typeof lc !== 'function' ? naiveLength : lc;
        this[ALLOW_STALE] = options.stale || false;
        if (options.maxAge && typeof options.maxAge !== 'number')
          throw new TypeError('maxAge must be a number');
        this[MAX_AGE] = options.maxAge || 0;
        this[DISPOSE] = options.dispose;
        this[NO_DISPOSE_ON_SET] = options.noDisposeOnSet || false;
        this[UPDATE_AGE_ON_GET] = options.updateAgeOnGet || false;
        this.reset();
      }
      set max(mL) {
        if (typeof mL !== 'number' || mL < 0)
          throw new TypeError('max must be a non-negative number');
        this[MAX] = mL || Infinity;
        trim(this);
      }
      get max() {
        return this[MAX];
      }
      set allowStale(allowStale) {
        this[ALLOW_STALE] = !!allowStale;
      }
      get allowStale() {
        return this[ALLOW_STALE];
      }
      set maxAge(mA) {
        if (typeof mA !== 'number') throw new TypeError('maxAge must be a non-negative number');
        this[MAX_AGE] = mA;
        trim(this);
      }
      get maxAge() {
        return this[MAX_AGE];
      }
      set lengthCalculator(lC) {
        if (typeof lC !== 'function') lC = naiveLength;
        if (lC !== this[LENGTH_CALCULATOR]) {
          this[LENGTH_CALCULATOR] = lC;
          this[LENGTH] = 0;
          this[LRU_LIST].forEach(hit => {
            hit.length = this[LENGTH_CALCULATOR](hit.value, hit.key);
            this[LENGTH] += hit.length;
          });
        }
        trim(this);
      }
      get lengthCalculator() {
        return this[LENGTH_CALCULATOR];
      }
      get length() {
        return this[LENGTH];
      }
      get itemCount() {
        return this[LRU_LIST].length;
      }
      rforEach(fn, thisp) {
        thisp = thisp || this;
        for (let walker = this[LRU_LIST].tail; walker !== null; ) {
          const prev = walker.prev;
          forEachStep(this, fn, walker, thisp);
          walker = prev;
        }
      }
      forEach(fn, thisp) {
        thisp = thisp || this;
        for (let walker = this[LRU_LIST].head; walker !== null; ) {
          const next = walker.next;
          forEachStep(this, fn, walker, thisp);
          walker = next;
        }
      }
      keys() {
        return this[LRU_LIST].toArray().map(k => k.key);
      }
      values() {
        return this[LRU_LIST].toArray().map(k => k.value);
      }
      reset() {
        if (this[DISPOSE] && this[LRU_LIST] && this[LRU_LIST].length) {
          this[LRU_LIST].forEach(hit => this[DISPOSE](hit.key, hit.value));
        }
        this[CACHE] = new Map();
        this[LRU_LIST] = new Yallist();
        this[LENGTH] = 0;
      }
      dump() {
        return this[LRU_LIST].map(hit =>
          isStale(this, hit)
            ? false
            : {
                k: hit.key,
                v: hit.value,
                e: hit.now + (hit.maxAge || 0)
              }
        )
          .toArray()
          .filter(h => h);
      }
      dumpLru() {
        return this[LRU_LIST];
      }
      set(key, value, maxAge) {
        maxAge = maxAge || this[MAX_AGE];
        if (maxAge && typeof maxAge !== 'number') throw new TypeError('maxAge must be a number');
        const now = maxAge ? Date.now() : 0;
        const len = this[LENGTH_CALCULATOR](value, key);
        if (this[CACHE].has(key)) {
          if (len > this[MAX]) {
            del(this, this[CACHE].get(key));
            return false;
          }
          const node = this[CACHE].get(key);
          const item = node.value;
          if (this[DISPOSE]) {
            if (!this[NO_DISPOSE_ON_SET]) this[DISPOSE](key, item.value);
          }
          item.now = now;
          item.maxAge = maxAge;
          item.value = value;
          this[LENGTH] += len - item.length;
          item.length = len;
          this.get(key);
          trim(this);
          return true;
        }
        const hit = new Entry(key, value, len, now, maxAge);
        if (hit.length > this[MAX]) {
          if (this[DISPOSE]) this[DISPOSE](key, value);
          return false;
        }
        this[LENGTH] += hit.length;
        this[LRU_LIST].unshift(hit);
        this[CACHE].set(key, this[LRU_LIST].head);
        trim(this);
        return true;
      }
      has(key) {
        if (!this[CACHE].has(key)) return false;
        const hit = this[CACHE].get(key).value;
        return !isStale(this, hit);
      }
      get(key) {
        return get(this, key, true);
      }
      peek(key) {
        return get(this, key, false);
      }
      pop() {
        const node = this[LRU_LIST].tail;
        if (!node) return null;
        del(this, node);
        return node.value;
      }
      del(key) {
        del(this, this[CACHE].get(key));
      }
      load(arr) {
        this.reset();
        const now = Date.now();
        for (let l = arr.length - 1; l >= 0; l--) {
          const hit = arr[l];
          const expiresAt = hit.e || 0;
          if (expiresAt === 0) this.set(hit.k, hit.v);
          else {
            const maxAge = expiresAt - now;
            if (maxAge > 0) {
              this.set(hit.k, hit.v, maxAge);
            }
          }
        }
      }
      prune() {
        this[CACHE].forEach((value, key) => get(this, key, false));
      }
    };
    var get = (self, key, doUse) => {
      const node = self[CACHE].get(key);
      if (node) {
        const hit = node.value;
        if (isStale(self, hit)) {
          del(self, node);
          if (!self[ALLOW_STALE]) return void 0;
        } else {
          if (doUse) {
            if (self[UPDATE_AGE_ON_GET]) node.value.now = Date.now();
            self[LRU_LIST].unshiftNode(node);
          }
        }
        return hit.value;
      }
    };
    var isStale = (self, hit) => {
      if (!hit || (!hit.maxAge && !self[MAX_AGE])) return false;
      const diff = Date.now() - hit.now;
      return hit.maxAge ? diff > hit.maxAge : self[MAX_AGE] && diff > self[MAX_AGE];
    };
    var trim = self => {
      if (self[LENGTH] > self[MAX]) {
        for (let walker = self[LRU_LIST].tail; self[LENGTH] > self[MAX] && walker !== null; ) {
          const prev = walker.prev;
          del(self, walker);
          walker = prev;
        }
      }
    };
    var del = (self, node) => {
      if (node) {
        const hit = node.value;
        if (self[DISPOSE]) self[DISPOSE](hit.key, hit.value);
        self[LENGTH] -= hit.length;
        self[CACHE].delete(hit.key);
        self[LRU_LIST].removeNode(node);
      }
    };
    var Entry = class {
      constructor(key, value, length, now, maxAge) {
        this.key = key;
        this.value = value;
        this.length = length;
        this.now = now;
        this.maxAge = maxAge || 0;
      }
    };
    var forEachStep = (self, fn, node, thisp) => {
      let hit = node.value;
      if (isStale(self, hit)) {
        del(self, node);
        if (!self[ALLOW_STALE]) hit = void 0;
      }
      if (hit) fn.call(thisp, hit.value, hit.key, self);
    };
    module2.exports = LRUCache;
  }
});

// node_modules/semver/classes/range.js
var require_range = __commonJS({
  'node_modules/semver/classes/range.js'(exports2, module2) {
    var Range = class {
      constructor(range, options) {
        options = parseOptions(options);
        if (range instanceof Range) {
          if (
            range.loose === !!options.loose &&
            range.includePrerelease === !!options.includePrerelease
          ) {
            return range;
          } else {
            return new Range(range.raw, options);
          }
        }
        if (range instanceof Comparator) {
          this.raw = range.value;
          this.set = [[range]];
          this.format();
          return this;
        }
        this.options = options;
        this.loose = !!options.loose;
        this.includePrerelease = !!options.includePrerelease;
        this.raw = range;
        this.set = range
          .split(/\s*\|\|\s*/)
          .map(range2 => this.parseRange(range2.trim()))
          .filter(c => c.length);
        if (!this.set.length) {
          throw new TypeError(`Invalid SemVer Range: ${range}`);
        }
        if (this.set.length > 1) {
          const first = this.set[0];
          this.set = this.set.filter(c => !isNullSet(c[0]));
          if (this.set.length === 0) this.set = [first];
          else if (this.set.length > 1) {
            for (const c of this.set) {
              if (c.length === 1 && isAny(c[0])) {
                this.set = [c];
                break;
              }
            }
          }
        }
        this.format();
      }
      format() {
        this.range = this.set
          .map(comps => {
            return comps.join(' ').trim();
          })
          .join('||')
          .trim();
        return this.range;
      }
      toString() {
        return this.range;
      }
      parseRange(range) {
        range = range.trim();
        const memoOpts = Object.keys(this.options).join(',');
        const memoKey = `parseRange:${memoOpts}:${range}`;
        const cached = cache.get(memoKey);
        if (cached) return cached;
        const loose = this.options.loose;
        const hr = loose ? re[t.HYPHENRANGELOOSE] : re[t.HYPHENRANGE];
        range = range.replace(hr, hyphenReplace(this.options.includePrerelease));
        debug('hyphen replace', range);
        range = range.replace(re[t.COMPARATORTRIM], comparatorTrimReplace);
        debug('comparator trim', range, re[t.COMPARATORTRIM]);
        range = range.replace(re[t.TILDETRIM], tildeTrimReplace);
        range = range.replace(re[t.CARETTRIM], caretTrimReplace);
        range = range.split(/\s+/).join(' ');
        const compRe = loose ? re[t.COMPARATORLOOSE] : re[t.COMPARATOR];
        const rangeList = range
          .split(' ')
          .map(comp => parseComparator(comp, this.options))
          .join(' ')
          .split(/\s+/)
          .map(comp => replaceGTE0(comp, this.options))
          .filter(this.options.loose ? comp => !!comp.match(compRe) : () => true)
          .map(comp => new Comparator(comp, this.options));
        const l = rangeList.length;
        const rangeMap = new Map();
        for (const comp of rangeList) {
          if (isNullSet(comp)) return [comp];
          rangeMap.set(comp.value, comp);
        }
        if (rangeMap.size > 1 && rangeMap.has('')) rangeMap.delete('');
        const result = [...rangeMap.values()];
        cache.set(memoKey, result);
        return result;
      }
      intersects(range, options) {
        if (!(range instanceof Range)) {
          throw new TypeError('a Range is required');
        }
        return this.set.some(thisComparators => {
          return (
            isSatisfiable(thisComparators, options) &&
            range.set.some(rangeComparators => {
              return (
                isSatisfiable(rangeComparators, options) &&
                thisComparators.every(thisComparator => {
                  return rangeComparators.every(rangeComparator => {
                    return thisComparator.intersects(rangeComparator, options);
                  });
                })
              );
            })
          );
        });
      }
      test(version) {
        if (!version) {
          return false;
        }
        if (typeof version === 'string') {
          try {
            version = new SemVer(version, this.options);
          } catch (er) {
            return false;
          }
        }
        for (let i = 0; i < this.set.length; i++) {
          if (testSet(this.set[i], version, this.options)) {
            return true;
          }
        }
        return false;
      }
    };
    module2.exports = Range;
    var LRU = require_lru_cache();
    var cache = new LRU({ max: 1e3 });
    var parseOptions = require_parse_options();
    var Comparator = require_comparator();
    var debug = require_debug();
    var SemVer = require_semver();
    var { re, t, comparatorTrimReplace, tildeTrimReplace, caretTrimReplace } = require_re();
    var isNullSet = c => c.value === '<0.0.0-0';
    var isAny = c => c.value === '';
    var isSatisfiable = (comparators, options) => {
      let result = true;
      const remainingComparators = comparators.slice();
      let testComparator = remainingComparators.pop();
      while (result && remainingComparators.length) {
        result = remainingComparators.every(otherComparator => {
          return testComparator.intersects(otherComparator, options);
        });
        testComparator = remainingComparators.pop();
      }
      return result;
    };
    var parseComparator = (comp, options) => {
      debug('comp', comp, options);
      comp = replaceCarets(comp, options);
      debug('caret', comp);
      comp = replaceTildes(comp, options);
      debug('tildes', comp);
      comp = replaceXRanges(comp, options);
      debug('xrange', comp);
      comp = replaceStars(comp, options);
      debug('stars', comp);
      return comp;
    };
    var isX = id => !id || id.toLowerCase() === 'x' || id === '*';
    var replaceTildes = (comp, options) =>
      comp
        .trim()
        .split(/\s+/)
        .map(comp2 => {
          return replaceTilde(comp2, options);
        })
        .join(' ');
    var replaceTilde = (comp, options) => {
      const r = options.loose ? re[t.TILDELOOSE] : re[t.TILDE];
      return comp.replace(r, (_, M, m, p, pr) => {
        debug('tilde', comp, _, M, m, p, pr);
        let ret;
        if (isX(M)) {
          ret = '';
        } else if (isX(m)) {
          ret = `>=${M}.0.0 <${+M + 1}.0.0-0`;
        } else if (isX(p)) {
          ret = `>=${M}.${m}.0 <${M}.${+m + 1}.0-0`;
        } else if (pr) {
          debug('replaceTilde pr', pr);
          ret = `>=${M}.${m}.${p}-${pr} <${M}.${+m + 1}.0-0`;
        } else {
          ret = `>=${M}.${m}.${p} <${M}.${+m + 1}.0-0`;
        }
        debug('tilde return', ret);
        return ret;
      });
    };
    var replaceCarets = (comp, options) =>
      comp
        .trim()
        .split(/\s+/)
        .map(comp2 => {
          return replaceCaret(comp2, options);
        })
        .join(' ');
    var replaceCaret = (comp, options) => {
      debug('caret', comp, options);
      const r = options.loose ? re[t.CARETLOOSE] : re[t.CARET];
      const z = options.includePrerelease ? '-0' : '';
      return comp.replace(r, (_, M, m, p, pr) => {
        debug('caret', comp, _, M, m, p, pr);
        let ret;
        if (isX(M)) {
          ret = '';
        } else if (isX(m)) {
          ret = `>=${M}.0.0${z} <${+M + 1}.0.0-0`;
        } else if (isX(p)) {
          if (M === '0') {
            ret = `>=${M}.${m}.0${z} <${M}.${+m + 1}.0-0`;
          } else {
            ret = `>=${M}.${m}.0${z} <${+M + 1}.0.0-0`;
          }
        } else if (pr) {
          debug('replaceCaret pr', pr);
          if (M === '0') {
            if (m === '0') {
              ret = `>=${M}.${m}.${p}-${pr} <${M}.${m}.${+p + 1}-0`;
            } else {
              ret = `>=${M}.${m}.${p}-${pr} <${M}.${+m + 1}.0-0`;
            }
          } else {
            ret = `>=${M}.${m}.${p}-${pr} <${+M + 1}.0.0-0`;
          }
        } else {
          debug('no pr');
          if (M === '0') {
            if (m === '0') {
              ret = `>=${M}.${m}.${p}${z} <${M}.${m}.${+p + 1}-0`;
            } else {
              ret = `>=${M}.${m}.${p}${z} <${M}.${+m + 1}.0-0`;
            }
          } else {
            ret = `>=${M}.${m}.${p} <${+M + 1}.0.0-0`;
          }
        }
        debug('caret return', ret);
        return ret;
      });
    };
    var replaceXRanges = (comp, options) => {
      debug('replaceXRanges', comp, options);
      return comp
        .split(/\s+/)
        .map(comp2 => {
          return replaceXRange(comp2, options);
        })
        .join(' ');
    };
    var replaceXRange = (comp, options) => {
      comp = comp.trim();
      const r = options.loose ? re[t.XRANGELOOSE] : re[t.XRANGE];
      return comp.replace(r, (ret, gtlt, M, m, p, pr) => {
        debug('xRange', comp, ret, gtlt, M, m, p, pr);
        const xM = isX(M);
        const xm = xM || isX(m);
        const xp = xm || isX(p);
        const anyX = xp;
        if (gtlt === '=' && anyX) {
          gtlt = '';
        }
        pr = options.includePrerelease ? '-0' : '';
        if (xM) {
          if (gtlt === '>' || gtlt === '<') {
            ret = '<0.0.0-0';
          } else {
            ret = '*';
          }
        } else if (gtlt && anyX) {
          if (xm) {
            m = 0;
          }
          p = 0;
          if (gtlt === '>') {
            gtlt = '>=';
            if (xm) {
              M = +M + 1;
              m = 0;
              p = 0;
            } else {
              m = +m + 1;
              p = 0;
            }
          } else if (gtlt === '<=') {
            gtlt = '<';
            if (xm) {
              M = +M + 1;
            } else {
              m = +m + 1;
            }
          }
          if (gtlt === '<') pr = '-0';
          ret = `${gtlt + M}.${m}.${p}${pr}`;
        } else if (xm) {
          ret = `>=${M}.0.0${pr} <${+M + 1}.0.0-0`;
        } else if (xp) {
          ret = `>=${M}.${m}.0${pr} <${M}.${+m + 1}.0-0`;
        }
        debug('xRange return', ret);
        return ret;
      });
    };
    var replaceStars = (comp, options) => {
      debug('replaceStars', comp, options);
      return comp.trim().replace(re[t.STAR], '');
    };
    var replaceGTE0 = (comp, options) => {
      debug('replaceGTE0', comp, options);
      return comp.trim().replace(re[options.includePrerelease ? t.GTE0PRE : t.GTE0], '');
    };
    var hyphenReplace = incPr => ($0, from, fM, fm, fp, fpr, fb, to, tM, tm, tp, tpr, tb) => {
      if (isX(fM)) {
        from = '';
      } else if (isX(fm)) {
        from = `>=${fM}.0.0${incPr ? '-0' : ''}`;
      } else if (isX(fp)) {
        from = `>=${fM}.${fm}.0${incPr ? '-0' : ''}`;
      } else if (fpr) {
        from = `>=${from}`;
      } else {
        from = `>=${from}${incPr ? '-0' : ''}`;
      }
      if (isX(tM)) {
        to = '';
      } else if (isX(tm)) {
        to = `<${+tM + 1}.0.0-0`;
      } else if (isX(tp)) {
        to = `<${tM}.${+tm + 1}.0-0`;
      } else if (tpr) {
        to = `<=${tM}.${tm}.${tp}-${tpr}`;
      } else if (incPr) {
        to = `<${tM}.${tm}.${+tp + 1}-0`;
      } else {
        to = `<=${to}`;
      }
      return `${from} ${to}`.trim();
    };
    var testSet = (set, version, options) => {
      for (let i = 0; i < set.length; i++) {
        if (!set[i].test(version)) {
          return false;
        }
      }
      if (version.prerelease.length && !options.includePrerelease) {
        for (let i = 0; i < set.length; i++) {
          debug(set[i].semver);
          if (set[i].semver === Comparator.ANY) {
            continue;
          }
          if (set[i].semver.prerelease.length > 0) {
            const allowed = set[i].semver;
            if (
              allowed.major === version.major &&
              allowed.minor === version.minor &&
              allowed.patch === version.patch
            ) {
              return true;
            }
          }
        }
        return false;
      }
      return true;
    };
  }
});

// node_modules/semver/classes/comparator.js
var require_comparator = __commonJS({
  'node_modules/semver/classes/comparator.js'(exports2, module2) {
    var ANY = Symbol('SemVer ANY');
    var Comparator = class {
      static get ANY() {
        return ANY;
      }
      constructor(comp, options) {
        options = parseOptions(options);
        if (comp instanceof Comparator) {
          if (comp.loose === !!options.loose) {
            return comp;
          } else {
            comp = comp.value;
          }
        }
        debug('comparator', comp, options);
        this.options = options;
        this.loose = !!options.loose;
        this.parse(comp);
        if (this.semver === ANY) {
          this.value = '';
        } else {
          this.value = this.operator + this.semver.version;
        }
        debug('comp', this);
      }
      parse(comp) {
        const r = this.options.loose ? re[t.COMPARATORLOOSE] : re[t.COMPARATOR];
        const m = comp.match(r);
        if (!m) {
          throw new TypeError(`Invalid comparator: ${comp}`);
        }
        this.operator = m[1] !== void 0 ? m[1] : '';
        if (this.operator === '=') {
          this.operator = '';
        }
        if (!m[2]) {
          this.semver = ANY;
        } else {
          this.semver = new SemVer(m[2], this.options.loose);
        }
      }
      toString() {
        return this.value;
      }
      test(version) {
        debug('Comparator.test', version, this.options.loose);
        if (this.semver === ANY || version === ANY) {
          return true;
        }
        if (typeof version === 'string') {
          try {
            version = new SemVer(version, this.options);
          } catch (er) {
            return false;
          }
        }
        return cmp(version, this.operator, this.semver, this.options);
      }
      intersects(comp, options) {
        if (!(comp instanceof Comparator)) {
          throw new TypeError('a Comparator is required');
        }
        if (!options || typeof options !== 'object') {
          options = {
            loose: !!options,
            includePrerelease: false
          };
        }
        if (this.operator === '') {
          if (this.value === '') {
            return true;
          }
          return new Range(comp.value, options).test(this.value);
        } else if (comp.operator === '') {
          if (comp.value === '') {
            return true;
          }
          return new Range(this.value, options).test(comp.semver);
        }
        const sameDirectionIncreasing =
          (this.operator === '>=' || this.operator === '>') &&
          (comp.operator === '>=' || comp.operator === '>');
        const sameDirectionDecreasing =
          (this.operator === '<=' || this.operator === '<') &&
          (comp.operator === '<=' || comp.operator === '<');
        const sameSemVer = this.semver.version === comp.semver.version;
        const differentDirectionsInclusive =
          (this.operator === '>=' || this.operator === '<=') &&
          (comp.operator === '>=' || comp.operator === '<=');
        const oppositeDirectionsLessThan =
          cmp(this.semver, '<', comp.semver, options) &&
          (this.operator === '>=' || this.operator === '>') &&
          (comp.operator === '<=' || comp.operator === '<');
        const oppositeDirectionsGreaterThan =
          cmp(this.semver, '>', comp.semver, options) &&
          (this.operator === '<=' || this.operator === '<') &&
          (comp.operator === '>=' || comp.operator === '>');
        return (
          sameDirectionIncreasing ||
          sameDirectionDecreasing ||
          (sameSemVer && differentDirectionsInclusive) ||
          oppositeDirectionsLessThan ||
          oppositeDirectionsGreaterThan
        );
      }
    };
    module2.exports = Comparator;
    var parseOptions = require_parse_options();
    var { re, t } = require_re();
    var cmp = require_cmp();
    var debug = require_debug();
    var SemVer = require_semver();
    var Range = require_range();
  }
});

// node_modules/semver/functions/satisfies.js
var require_satisfies = __commonJS({
  'node_modules/semver/functions/satisfies.js'(exports2, module2) {
    var Range = require_range();
    var satisfies = (version, range, options) => {
      try {
        range = new Range(range, options);
      } catch (er) {
        return false;
      }
      return range.test(version);
    };
    module2.exports = satisfies;
  }
});

// node_modules/semver/ranges/to-comparators.js
var require_to_comparators = __commonJS({
  'node_modules/semver/ranges/to-comparators.js'(exports2, module2) {
    var Range = require_range();
    var toComparators = (range, options) =>
      new Range(range, options).set.map(comp =>
        comp
          .map(c => c.value)
          .join(' ')
          .trim()
          .split(' ')
      );
    module2.exports = toComparators;
  }
});

// node_modules/semver/ranges/max-satisfying.js
var require_max_satisfying = __commonJS({
  'node_modules/semver/ranges/max-satisfying.js'(exports2, module2) {
    var SemVer = require_semver();
    var Range = require_range();
    var maxSatisfying = (versions, range, options) => {
      let max = null;
      let maxSV = null;
      let rangeObj = null;
      try {
        rangeObj = new Range(range, options);
      } catch (er) {
        return null;
      }
      versions.forEach(v => {
        if (rangeObj.test(v)) {
          if (!max || maxSV.compare(v) === -1) {
            max = v;
            maxSV = new SemVer(max, options);
          }
        }
      });
      return max;
    };
    module2.exports = maxSatisfying;
  }
});

// node_modules/semver/ranges/min-satisfying.js
var require_min_satisfying = __commonJS({
  'node_modules/semver/ranges/min-satisfying.js'(exports2, module2) {
    var SemVer = require_semver();
    var Range = require_range();
    var minSatisfying = (versions, range, options) => {
      let min = null;
      let minSV = null;
      let rangeObj = null;
      try {
        rangeObj = new Range(range, options);
      } catch (er) {
        return null;
      }
      versions.forEach(v => {
        if (rangeObj.test(v)) {
          if (!min || minSV.compare(v) === 1) {
            min = v;
            minSV = new SemVer(min, options);
          }
        }
      });
      return min;
    };
    module2.exports = minSatisfying;
  }
});

// node_modules/semver/ranges/min-version.js
var require_min_version = __commonJS({
  'node_modules/semver/ranges/min-version.js'(exports2, module2) {
    var SemVer = require_semver();
    var Range = require_range();
    var gt = require_gt();
    var minVersion = (range, loose) => {
      range = new Range(range, loose);
      let minver = new SemVer('0.0.0');
      if (range.test(minver)) {
        return minver;
      }
      minver = new SemVer('0.0.0-0');
      if (range.test(minver)) {
        return minver;
      }
      minver = null;
      for (let i = 0; i < range.set.length; ++i) {
        const comparators = range.set[i];
        let setMin = null;
        comparators.forEach(comparator => {
          const compver = new SemVer(comparator.semver.version);
          switch (comparator.operator) {
            case '>':
              if (compver.prerelease.length === 0) {
                compver.patch++;
              } else {
                compver.prerelease.push(0);
              }
              compver.raw = compver.format();
            case '':
            case '>=':
              if (!setMin || gt(compver, setMin)) {
                setMin = compver;
              }
              break;
            case '<':
            case '<=':
              break;
            default:
              throw new Error(`Unexpected operation: ${comparator.operator}`);
          }
        });
        if (setMin && (!minver || gt(minver, setMin))) minver = setMin;
      }
      if (minver && range.test(minver)) {
        return minver;
      }
      return null;
    };
    module2.exports = minVersion;
  }
});

// node_modules/semver/ranges/valid.js
var require_valid2 = __commonJS({
  'node_modules/semver/ranges/valid.js'(exports2, module2) {
    var Range = require_range();
    var validRange = (range, options) => {
      try {
        return new Range(range, options).range || '*';
      } catch (er) {
        return null;
      }
    };
    module2.exports = validRange;
  }
});

// node_modules/semver/ranges/outside.js
var require_outside = __commonJS({
  'node_modules/semver/ranges/outside.js'(exports2, module2) {
    var SemVer = require_semver();
    var Comparator = require_comparator();
    var { ANY } = Comparator;
    var Range = require_range();
    var satisfies = require_satisfies();
    var gt = require_gt();
    var lt = require_lt();
    var lte = require_lte();
    var gte = require_gte();
    var outside = (version, range, hilo, options) => {
      version = new SemVer(version, options);
      range = new Range(range, options);
      let gtfn, ltefn, ltfn, comp, ecomp;
      switch (hilo) {
        case '>':
          gtfn = gt;
          ltefn = lte;
          ltfn = lt;
          comp = '>';
          ecomp = '>=';
          break;
        case '<':
          gtfn = lt;
          ltefn = gte;
          ltfn = gt;
          comp = '<';
          ecomp = '<=';
          break;
        default:
          throw new TypeError('Must provide a hilo val of "<" or ">"');
      }
      if (satisfies(version, range, options)) {
        return false;
      }
      for (let i = 0; i < range.set.length; ++i) {
        const comparators = range.set[i];
        let high = null;
        let low = null;
        comparators.forEach(comparator => {
          if (comparator.semver === ANY) {
            comparator = new Comparator('>=0.0.0');
          }
          high = high || comparator;
          low = low || comparator;
          if (gtfn(comparator.semver, high.semver, options)) {
            high = comparator;
          } else if (ltfn(comparator.semver, low.semver, options)) {
            low = comparator;
          }
        });
        if (high.operator === comp || high.operator === ecomp) {
          return false;
        }
        if ((!low.operator || low.operator === comp) && ltefn(version, low.semver)) {
          return false;
        } else if (low.operator === ecomp && ltfn(version, low.semver)) {
          return false;
        }
      }
      return true;
    };
    module2.exports = outside;
  }
});

// node_modules/semver/ranges/gtr.js
var require_gtr = __commonJS({
  'node_modules/semver/ranges/gtr.js'(exports2, module2) {
    var outside = require_outside();
    var gtr = (version, range, options) => outside(version, range, '>', options);
    module2.exports = gtr;
  }
});

// node_modules/semver/ranges/ltr.js
var require_ltr = __commonJS({
  'node_modules/semver/ranges/ltr.js'(exports2, module2) {
    var outside = require_outside();
    var ltr = (version, range, options) => outside(version, range, '<', options);
    module2.exports = ltr;
  }
});

// node_modules/semver/ranges/intersects.js
var require_intersects = __commonJS({
  'node_modules/semver/ranges/intersects.js'(exports2, module2) {
    var Range = require_range();
    var intersects = (r1, r2, options) => {
      r1 = new Range(r1, options);
      r2 = new Range(r2, options);
      return r1.intersects(r2);
    };
    module2.exports = intersects;
  }
});

// node_modules/semver/ranges/simplify.js
var require_simplify = __commonJS({
  'node_modules/semver/ranges/simplify.js'(exports2, module2) {
    var satisfies = require_satisfies();
    var compare = require_compare();
    module2.exports = (versions, range, options) => {
      const set = [];
      let min = null;
      let prev = null;
      const v = versions.sort((a, b) => compare(a, b, options));
      for (const version of v) {
        const included = satisfies(version, range, options);
        if (included) {
          prev = version;
          if (!min) min = version;
        } else {
          if (prev) {
            set.push([min, prev]);
          }
          prev = null;
          min = null;
        }
      }
      if (min) set.push([min, null]);
      const ranges = [];
      for (const [min2, max] of set) {
        if (min2 === max) ranges.push(min2);
        else if (!max && min2 === v[0]) ranges.push('*');
        else if (!max) ranges.push(`>=${min2}`);
        else if (min2 === v[0]) ranges.push(`<=${max}`);
        else ranges.push(`${min2} - ${max}`);
      }
      const simplified = ranges.join(' || ');
      const original = typeof range.raw === 'string' ? range.raw : String(range);
      return simplified.length < original.length ? simplified : range;
    };
  }
});

// node_modules/semver/ranges/subset.js
var require_subset = __commonJS({
  'node_modules/semver/ranges/subset.js'(exports2, module2) {
    var Range = require_range();
    var Comparator = require_comparator();
    var { ANY } = Comparator;
    var satisfies = require_satisfies();
    var compare = require_compare();
    var subset = (sub, dom, options = {}) => {
      if (sub === dom) return true;
      sub = new Range(sub, options);
      dom = new Range(dom, options);
      let sawNonNull = false;
      OUTER: for (const simpleSub of sub.set) {
        for (const simpleDom of dom.set) {
          const isSub = simpleSubset(simpleSub, simpleDom, options);
          sawNonNull = sawNonNull || isSub !== null;
          if (isSub) continue OUTER;
        }
        if (sawNonNull) return false;
      }
      return true;
    };
    var simpleSubset = (sub, dom, options) => {
      if (sub === dom) return true;
      if (sub.length === 1 && sub[0].semver === ANY) {
        if (dom.length === 1 && dom[0].semver === ANY) return true;
        else if (options.includePrerelease) sub = [new Comparator('>=0.0.0-0')];
        else sub = [new Comparator('>=0.0.0')];
      }
      if (dom.length === 1 && dom[0].semver === ANY) {
        if (options.includePrerelease) return true;
        else dom = [new Comparator('>=0.0.0')];
      }
      const eqSet = new Set();
      let gt, lt;
      for (const c of sub) {
        if (c.operator === '>' || c.operator === '>=') gt = higherGT(gt, c, options);
        else if (c.operator === '<' || c.operator === '<=') lt = lowerLT(lt, c, options);
        else eqSet.add(c.semver);
      }
      if (eqSet.size > 1) return null;
      let gtltComp;
      if (gt && lt) {
        gtltComp = compare(gt.semver, lt.semver, options);
        if (gtltComp > 0) return null;
        else if (gtltComp === 0 && (gt.operator !== '>=' || lt.operator !== '<=')) return null;
      }
      for (const eq of eqSet) {
        if (gt && !satisfies(eq, String(gt), options)) return null;
        if (lt && !satisfies(eq, String(lt), options)) return null;
        for (const c of dom) {
          if (!satisfies(eq, String(c), options)) return false;
        }
        return true;
      }
      let higher, lower;
      let hasDomLT, hasDomGT;
      let needDomLTPre =
        lt && !options.includePrerelease && lt.semver.prerelease.length ? lt.semver : false;
      let needDomGTPre =
        gt && !options.includePrerelease && gt.semver.prerelease.length ? gt.semver : false;
      if (
        needDomLTPre &&
        needDomLTPre.prerelease.length === 1 &&
        lt.operator === '<' &&
        needDomLTPre.prerelease[0] === 0
      ) {
        needDomLTPre = false;
      }
      for (const c of dom) {
        hasDomGT = hasDomGT || c.operator === '>' || c.operator === '>=';
        hasDomLT = hasDomLT || c.operator === '<' || c.operator === '<=';
        if (gt) {
          if (needDomGTPre) {
            if (
              c.semver.prerelease &&
              c.semver.prerelease.length &&
              c.semver.major === needDomGTPre.major &&
              c.semver.minor === needDomGTPre.minor &&
              c.semver.patch === needDomGTPre.patch
            ) {
              needDomGTPre = false;
            }
          }
          if (c.operator === '>' || c.operator === '>=') {
            higher = higherGT(gt, c, options);
            if (higher === c && higher !== gt) return false;
          } else if (gt.operator === '>=' && !satisfies(gt.semver, String(c), options))
            return false;
        }
        if (lt) {
          if (needDomLTPre) {
            if (
              c.semver.prerelease &&
              c.semver.prerelease.length &&
              c.semver.major === needDomLTPre.major &&
              c.semver.minor === needDomLTPre.minor &&
              c.semver.patch === needDomLTPre.patch
            ) {
              needDomLTPre = false;
            }
          }
          if (c.operator === '<' || c.operator === '<=') {
            lower = lowerLT(lt, c, options);
            if (lower === c && lower !== lt) return false;
          } else if (lt.operator === '<=' && !satisfies(lt.semver, String(c), options))
            return false;
        }
        if (!c.operator && (lt || gt) && gtltComp !== 0) return false;
      }
      if (gt && hasDomLT && !lt && gtltComp !== 0) return false;
      if (lt && hasDomGT && !gt && gtltComp !== 0) return false;
      if (needDomGTPre || needDomLTPre) return false;
      return true;
    };
    var higherGT = (a, b, options) => {
      if (!a) return b;
      const comp = compare(a.semver, b.semver, options);
      return comp > 0 ? a : comp < 0 ? b : b.operator === '>' && a.operator === '>=' ? b : a;
    };
    var lowerLT = (a, b, options) => {
      if (!a) return b;
      const comp = compare(a.semver, b.semver, options);
      return comp < 0 ? a : comp > 0 ? b : b.operator === '<' && a.operator === '<=' ? b : a;
    };
    module2.exports = subset;
  }
});

// node_modules/semver/index.js
var require_semver2 = __commonJS({
  'node_modules/semver/index.js'(exports2, module2) {
    var internalRe = require_re();
    module2.exports = {
      re: internalRe.re,
      src: internalRe.src,
      tokens: internalRe.t,
      SEMVER_SPEC_VERSION: require_constants().SEMVER_SPEC_VERSION,
      SemVer: require_semver(),
      compareIdentifiers: require_identifiers().compareIdentifiers,
      rcompareIdentifiers: require_identifiers().rcompareIdentifiers,
      parse: require_parse(),
      valid: require_valid(),
      clean: require_clean(),
      inc: require_inc(),
      diff: require_diff(),
      major: require_major(),
      minor: require_minor(),
      patch: require_patch(),
      prerelease: require_prerelease(),
      compare: require_compare(),
      rcompare: require_rcompare(),
      compareLoose: require_compare_loose(),
      compareBuild: require_compare_build(),
      sort: require_sort(),
      rsort: require_rsort(),
      gt: require_gt(),
      lt: require_lt(),
      eq: require_eq(),
      neq: require_neq(),
      gte: require_gte(),
      lte: require_lte(),
      cmp: require_cmp(),
      coerce: require_coerce(),
      Comparator: require_comparator(),
      Range: require_range(),
      satisfies: require_satisfies(),
      toComparators: require_to_comparators(),
      maxSatisfying: require_max_satisfying(),
      minSatisfying: require_min_satisfying(),
      minVersion: require_min_version(),
      validRange: require_valid2(),
      outside: require_outside(),
      gtr: require_gtr(),
      ltr: require_ltr(),
      intersects: require_intersects(),
      simplifyRange: require_simplify(),
      subset: require_subset()
    };
  }
});

// src/version.js
var require_version = __commonJS({
  'src/version.js'(exports2, module2) {
    var git = require_git_commands();
    var core2 = require_core();
    var semver = require_semver2();
    var commitPatterns = {
      major: [/\+semver:\s*(breaking|major)/i, /BREAKING CHANGES?:?/],
      minor: [
        /\+semver:\s*(feature|minor)/i,
        /feat\([^)]*\):\s/,
        /feature\([^)]*\):\s/,
        /^feat:\s.+/m,
        /^feature:\s.+/m
      ]
    };
    function getPriorReleaseCommit() {
      let tags = git.listTags();
      if (!tags || tags.length === 0) {
        return null;
      }
      const semverReleaseTags = tags
        .map(tag => ({
          tag,
          semverValue: semver.clean(tag, true)
        }))
        .filter(
          tagObj => tagObj.semverValue !== null && semver.prerelease(tagObj.semverValue) === null
        )
        .sort((a, b) => semver.rcompare(a.semverValue, b.semverValue));
      for (let i = 0; i < semverReleaseTags.length; i++) {
        const candidateTagObj = semverReleaseTags[i];
        if (git.isAncestor(candidateTagObj.tag, 'HEAD')) {
          const commitMetadata = git.commitMetadata(candidateTagObj.tag);
          return {
            ...commitMetadata,
            semver: candidateTagObj.semverValue
          };
        }
      }
      return null;
    }
    function determineReleaseTypeFromGitLog(baseCommit, finalCommit) {
      const commitObjects = git.logBetween(baseCommit, finalCommit);
      let releaseType = 'patch';
      for (let i = 0; i < commitObjects.length; i++) {
        const commitObj = commitObjects[i];
        if (
          commitPatterns.major.some(
            pattern => pattern.test(commitObj.rawBody) || pattern.test(commitObj.commitNotes)
          )
        ) {
          releaseType = 'major';
          core2.info('The following comment body or notes match the major pattern:');
          if (commitObj.rawBody && commitObj.rawBody.length > 0)
            core2.info(`	Body:"${commitObj.rawBody.trim()}"`);
          if (commitObj.commitNotes && commitObj.commitNotes.length > 0)
            core2.info(`	Notes:"${commitObj.commitNotes.trim()}"`);
          break;
        }
        if (
          commitPatterns.minor.some(
            pattern => pattern.test(commitObj.rawBody) || pattern.test(commitObj.commitNotes)
          )
        ) {
          releaseType = 'minor';
          core2.info('The following comment body or notes match the minor pattern:');
          if (commitObj.rawBody && commitObj.rawBody.length > 0)
            core2.info(`	Body:"${commitObj.rawBody.trim()}"`);
          if (commitObj.commitNotes && commitObj.commitNotes.length > 0)
            core2.info(`	Notes:"${commitObj.commitNotes.trim()}"`);
        }
      }
      return releaseType;
    }
    function twoDigit(number) {
      return ('0' + number.toString()).slice(-2);
    }
    function dateToPreReleaseComponent(input) {
      let year = input.getFullYear() % 100;
      let month = input.getMonth() + 1;
      let day = input.getDate();
      let hour = input.getHours();
      let minute = input.getMinutes();
      let second = input.getSeconds();
      return `${twoDigit(year)}${twoDigit(month)}${twoDigit(day)}${twoDigit(hour)}${twoDigit(
        minute
      )}${twoDigit(second)}`;
    }
    function nextReleaseVersion2(defaultReleaseType2, tagPrefix2) {
      let baseCommit;
      try {
        baseCommit = getPriorReleaseCommit();
      } catch (error) {
        core2.info(`An error occurred retrieving the tags for the repository: ${error}`);
      }
      let priorReleaseVersion;
      let releaseType;
      if (baseCommit === null) {
        priorReleaseVersion = '0.0.0';
        releaseType = defaultReleaseType2;
        core2.info(`
Prior release version default: ${priorReleaseVersion}`);
        core2.info(`Release Type: ${releaseType}`);
      } else {
        priorReleaseVersion = baseCommit.semver;
        releaseType = determineReleaseTypeFromGitLog(baseCommit.abbreviatedCommitHash, 'HEAD');
        core2.info(`
Prior release version: ${priorReleaseVersion}`);
        core2.info(`Release Type: ${releaseType}`);
      }
      let nextReleaseVersion3 = `${tagPrefix2}${semver.inc(priorReleaseVersion, releaseType)}`;
      core2.info(`Tag Prefix: '${tagPrefix2}'`);
      core2.info(`Next Release Version: ${nextReleaseVersion3}`);
      return nextReleaseVersion3;
    }
    function nextPrereleaseVersion2(label, defaultReleaseType2, tagPrefix2) {
      let baseCommit;
      try {
        baseCommit = getPriorReleaseCommit();
      } catch (error) {
        core2.info(`An error occurred retrieving the tags for the repository: ${error}`);
      }
      let currentHeadCommit = git.commitMetadata('HEAD');
      let formattedDate = dateToPreReleaseComponent(currentHeadCommit.committerDate);
      let priorReleaseVersion;
      let releaseType;
      if (baseCommit === null) {
        priorReleaseVersion = '0.0.0';
        releaseType = defaultReleaseType2;
        core2.info(`
Prior release version default: ${priorReleaseVersion}`);
        core2.info(`Release Type: ${releaseType}`);
      } else {
        priorReleaseVersion = baseCommit.semver;
        releaseType = determineReleaseTypeFromGitLog(baseCommit.abbreviatedCommitHash, 'HEAD');
        core2.info(`
Prior release version: ${priorReleaseVersion}`);
        core2.info(`Release Type: ${releaseType}`);
      }
      let nextReleaseVersion3 = semver.inc(priorReleaseVersion, releaseType);
      let prereleaseVersion = `${tagPrefix2}${nextReleaseVersion3}-${label}.${formattedDate}`;
      core2.info(`Tag Prefix: '${tagPrefix2}'`);
      core2.info(`Cleaned Branch Name: '${label}'`);
      core2.info(`Next Pre-release Version: ${prereleaseVersion}`);
      return prereleaseVersion;
    }
    module2.exports = {
      nextReleaseVersion: nextReleaseVersion2,
      nextPrereleaseVersion: nextPrereleaseVersion2
    };
  }
});

// src/main.js
var core = require_core();
var github = require_github();
var { nextReleaseVersion, nextPrereleaseVersion } = require_version();
var calculatePrereleaseVersion = core.getInput('calculate-prerelease-version') === 'true';
var branchName = core.getInput('branch-name');
var defaultReleaseType = core.getInput('default-release-type').toLowerCase();
var createRef = core.getInput('create-ref') === 'true';
var token = core.getInput('github-token');
var tagPrefix = core.getInput('tag-prefix');
async function createRefOnGitHub(versionToBuild) {
  core.info('Creating the ref on GitHub...');
  if (!token || token.length === 0) {
    core.setFailed('The token is required when creating a ref');
    return;
  }
  const octokit = github.getOctokit(token);
  let git_sha =
    github.context.eventName === 'pull_request'
      ? github.context.payload.pull_request.head.sha
      : github.context.sha;
  try {
    await octokit.rest.git.createRef({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      ref: `refs/tags/${versionToBuild}`,
      sha: git_sha
    });
    core.info('Finished creating the ref on GitHub.');
  } catch (error) {
    core.setFailed(`An error occurred creating the ref on GitHub: ${error}`);
  }
}
async function run() {
  try {
    if (
      defaultReleaseType !== 'major' &&
      defaultReleaseType != 'minor' &&
      defaultReleaseType != 'patch'
    ) {
      core.setFailed('The default release type must be populated and set to major|minor|patch');
      return;
    }
    if (tagPrefix.toLowerCase() == 'none') {
      tagPrefix = '';
    }
    let versionToBuild;
    if (calculatePrereleaseVersion) {
      if (!branchName || branchName.length === 0) {
        core.setFailed('The branch name is required when calculating a pre-release version');
        return;
      }
      core.info(`Calculating a pre-release version for ${branchName}...`);
      const prereleaseLabel = branchName.replace('refs/heads/', '').replace(/[^a-zA-Z0-9-]/g, '-');
      versionToBuild = nextPrereleaseVersion(prereleaseLabel, defaultReleaseType, tagPrefix);
    } else {
      core.info(`Calculating a release version...`);
      versionToBuild = nextReleaseVersion(defaultReleaseType, tagPrefix);
    }
    if (createRef) {
      await createRefOnGitHub(versionToBuild);
    }
    core.setOutput('VERSION', versionToBuild);
    core.exportVariable('VERSION', versionToBuild);
  } catch (error) {
    const versionTxt = calculatePrereleaseVersion ? 'pre-release' : 'release';
    core.setFailed(`An error occurred calculating the next ${versionTxt} version: ${error}`);
  }
}
run();
/*!
 * is-plain-object <https://github.com/jonschlinkert/is-plain-object>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */