'use strict';

var CAPABILITY_RESPONSE = 0x6C;

module.exports = function () {

  return {
    cmd: CAPABILITY_RESPONSE,
    handle: function (cmd, data, board) {

      var supportedModes = 0;

      function pushModes(modesArray, mode) {
        if (supportedModes & (1 << board.MODES[mode])) {
          modesArray.push(board.MODES[mode]);
        }
      }

      // Only create pins if none have been previously created on the instance.
      if (!board.pins.length) {
        for (var i = 0, n = 0; i < data.length; i++) {
          if (data[i] === 127) {
            var modesArray = [];
            Object.keys(board.MODES).forEach(pushModes.bind(null, modesArray));
            board.pins.push({
              supportedModes: modesArray,
              mode: board.MODES.UNKNOWN,
              value: 0,
              report: 1
            });
            supportedModes = 0;
            n = 0;
            continue;
          }
          if (n === 0) {
            supportedModes |= (1 << data[i]);
          }
          n ^= 1;
        }
      }

      board.emit("capability-query");
    }
  }

};
