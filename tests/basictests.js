var test = require('tape');
var createDiceCup = require('../dicecup');

test('Rolls', function typicalTests(t) {
  var cup = createDiceCup({
    probable: {
      roll: function mockRoll(sides) {
        return sides - 1;
      }
    }
  });

  function createRepeatArray(value, times) {
    var array = [];
    for (var i = 0; i < times; ++i) {
      array.push(value);
    }
    return array;
  }

  var outcomesForDiceStrings = {
    '1d6': {
      rolls: [6],
      total: 6
    },
    'd4': {
      rolls: [4],
      total: 4
    },
    '3d6': {
      rolls: [6, 6, 6],
      total: 18
    },
    '2d8+3': {
      rolls: [8, 8],
      total: 19
    },
    'd20': {
      rolls: [20],
      total: 20
    },
    '10d6-10': {
      rolls: [6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
      total: 50
    },
    '1d2-3': {
      rolls: [2],
      total: -1
    },
    'asdf 8d12': {
      rolls: createRepeatArray(12, 8),
      total: 96
    },
    '23d0': {
      rolls: createRepeatArray(0, 23),
      total: 0
    },
    '3d-1': {
      rolls: [0, 0, 0],
      total: -1
    },
    '124345d46456': {
      rolls: createRepeatArray(46456, 124345),
      total: 5776571320
    },
    'justnumbers+600': {
      rolls: [],
      total: 600
    }
  }

  var diceStrings = Object.keys(outcomesForDiceStrings);
  
  t.plan(diceStrings.length);

  diceStrings.forEach(function rollString(diceString) {
    t.deepEqual(cup.roll(diceString), outcomesForDiceStrings[diceString]);
  });

});


// TODO: Multiseries.
