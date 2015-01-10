var test = require('tape');
var createDiceCup = require('../dicecup');

// For reduced test confusion, we're using a mock version of probable that 
// doesn't actually return random results. This way we can easily predict what 
// the results should be.

var mockProbable = {
  roll: function mockRoll(sides) {
    return sides - 1;
  }
};

function createRepeatArray(value, times) {
  var array = [];
  for (var i = 0; i < times; ++i) {
    array.push(value);
  }
  return array;
}


test('Single-series', function singleSeriesTests(t) {
  var cup = createDiceCup({
    probable: mockProbable
  });

  var outcomesForDiceStrings = {
    '1d6': [
      {
        rolls: [6],
        total: 6
      }
    ],
    'd4': [
      {
        rolls: [4],
        total: 4
      }
    ],
    '3d6': [
      {
        rolls: [6, 6, 6],
        total: 18
      }
    ],
    '2d8+3': [
      {
        rolls: [8, 8],
        total: 19
      }
    ],
    'd20': [
      {
        rolls: [20],
        total: 20
      }
    ],
    '10d6-10': [
      {
        rolls: [6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
        total: 50
      }
    ],
    '1d2-3': [
      {
        rolls: [2],
        total: -1
      }
    ],
    'asdf8d12': [
      {
        rolls: createRepeatArray(12, 8),
        total: 96
      }
    ],
    '23d0': [
      {
        rolls: createRepeatArray(0, 23),
        total: 0
      }
    ],
    '3d-1': [
      {
        rolls: [0, 0, 0],
        total: -1
      }
    ],
    '124345d46456': [
      {
        rolls: createRepeatArray(46456, 124345),
        total: 5776571320
      }
    ],
    'justnumbers+600': [
      {
        rolls: [],
        total: 600      
      }
    ]
  }

  var diceStrings = Object.keys(outcomesForDiceStrings);
  
  t.plan(diceStrings.length);

  diceStrings.forEach(function rollString(diceString) {
    t.deepEqual(cup.roll(diceString), outcomesForDiceStrings[diceString]);
  });

});


test('Multi-series', function multiSeriesTests(t) {
  var cup = createDiceCup({
    probable: mockProbable
  });

  var outcomesForDiceStrings = {
    '3d6, 3d6, 3d6, 3d6, 3d6, 3d6': [
      {
        rolls: [6, 6, 6],
        total: 18
      },
      {
        rolls: [6, 6, 6],
        total: 18
      },      
      {
        rolls: [6, 6, 6],
        total: 18
      },      
      {
        rolls: [6, 6, 6],
        total: 18
      },      
      {
        rolls: [6, 6, 6],
        total: 18
      },      
      {
        rolls: [6, 6, 6],
        total: 18
      }
    ],
    'd4 1d20+5 ': [
      {
        rolls: [4],
        total: 4
      },
      {
        rolls: [20],
        total: 25
      }
    ],
    '7d6 1d100 80d12-32 120d2': [
      {
        rolls: [6, 6, 6, 6, 6, 6, 6],
        total: 42
      },
      {
        rolls: [100],
        total: 100
      },
      {
        rolls: createRepeatArray(12, 80),
        total: 928
      },
      {
        rolls: createRepeatArray(2, 120),
        total: 240
      }
    ]
  }

  var diceStrings = Object.keys(outcomesForDiceStrings);
  
  t.plan(diceStrings.length);

  diceStrings.forEach(function rollString(diceString) {
    t.deepEqual(cup.roll(diceString), outcomesForDiceStrings[diceString]);
  });

});
