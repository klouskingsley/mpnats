export  {
    encode_utf8,
    bytes_size,
    substr_utf8_bytes
}

function encode_utf8( s ) { 
    s = s || ''
    return unescape( encodeURIComponent( s ) )
}

function bytes_size (str) {
    var m = encodeURIComponent(str).match(/%[89ABab]/g);
    return str.length + (m ? m.length : 0);
}

function substr_utf8_bytes(str, startInBytes, lengthInBytes) {

    str = str || ''
    var resultStr = ''
    var startInChars = 0, bytePos, end, ch, n, realLength
    realLength = encode_utf8(str).length
    lengthInBytes = realLength <  (lengthInBytes + startInBytes) ? (realLength - startInBytes): lengthInBytes


    for (bytePos = 0; bytePos < startInBytes; startInChars++) {

        ch = str.charCodeAt(startInChars)
        bytePos += (ch < 128) ? 1 : encode_utf8(str[startInChars]).length
    }
    
    end = startInChars + lengthInBytes - 1

    for (n = startInChars; startInChars <= end; n++) {

        ch = str.charCodeAt(n)
        end -= (ch < 128) ? 1 : encode_utf8(str[n]).length

        resultStr += str[n]
    }

    return resultStr
}
