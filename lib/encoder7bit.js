"use strict";
/**
 * "Inspired" by Encoder7Bit.h/Encoder7Bit.cpp in the
 * Firmata source code.
 */
module.exports = {
  to7BitArray: function(data, offset, length) {
    offset = offset || 0;
    length = length || data.length - offset;
    if (offset > data.length - 1) offset = data.length - 1;
    if (length > data.length - offset) length = data.length - offset;

    var shift = 0;
    var previous = 0;
    var output = [];

    // suitable for array and buffer
    for (var i = 0; i < length; i++) {
      var byte = data[offset + i];
      if (shift === 0) {
        output.push(byte & 0x7f);
        shift++;
        previous = byte >> 7;
      } else {
        output.push(((byte << shift) & 0x7f) | previous);
        if (shift === 6) {
          output.push(byte >> 1);
          shift = 0;
        } else {
          shift++;
          previous = byte >> (8 - shift);
        }
      }
    }

    if (shift > 0) {
      output.push(previous);
    }

    return output;
  },
  from7BitArray: function(encoded, offset, length) {
    offset = offset || 0;
    length = length || encoded.length - offset;
    if (offset > encoded.length - 1) offset = encoded.length - 1;
    if (length > encoded.length - offset) length = encoded.length - offset;

    var expectedBytes = length * 7 >> 3;
    var decoded = [];

    for (var i = 0; i < expectedBytes; i++) {
      var j = i << 3;
      var pos = offset + parseInt(j / 7, 10);
      var shift = j % 7;
      decoded[i] = (encoded[pos] >> shift) | ((encoded[pos + 1] << (7 - shift)) & 0xFF);
    }

    return decoded;
  }
};
