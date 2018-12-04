var SUB = 'SUB'
var UNSUB = 'UNSUB'
var CONNECT = 'CONNECT'
var PUB = 'PUB'
var EMPTY = ''
var SPC = ' '
var CR_LF = '\r\n'

var MSG   = /^MSG\s+([^\s\r\n]+)\s+([^\s\r\n]+)\s+(([^\s\r\n]+)[^\S\r\n]+)?(\d+)\r\n/i
var OK    = /^\+OK\s*\r\n/i
var ERR   = /^-ERR\s+('.+')?\r\n/i
var PING  = /^PING\r\n/i
var PONG  = /^PONG\r\n/i
var INFO  = /^INFO\s+([^\r\n]+)\r\n/i
var SUBRE = /^SUB\s+([^\r\n]+)\r\n/i

var PING_REQUEST = 'PING' + CR_LF
var PONG_RESPONSE = 'PONG' + CR_LF

export {
    server,
    SUB,
    PUB,
    UNSUB,
    CONNECT,
    EMPTY,
    SPC,
    CR_LF,
    MSG,
    OK,
    ERR,
    PING,
    PONG,
    INFO,
    SUBRE,
    PING_REQUEST,
    PONG_RESPONSE
}
