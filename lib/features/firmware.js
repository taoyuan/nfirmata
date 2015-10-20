'use strict';

var QUERY_FIRMWARE = 0x79;

module.exports = function () {
  return {
    handle: function (cmd, data, board) {
      if (cmd !== QUERY_FIRMWARE) return false;

      var buf = [];
      board.firmware.version = {};
      board.firmware.version.major = data[0];
      board.firmware.version.minor = data[1];
      for (var i = 2, length = data.length - 1; i < length; i += 2) {
        buf.push((data[i] & 0x7F) | ((data[i + 1] & 0x7F) << 7));
      }

      board.firmware.name = new Buffer(buf).toString("utf8", 0, buf.length);
      board.emit("queryfirmware");

      return true;
    }
  }
};
