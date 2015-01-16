var test = require('tape');
var createDiceCup = require('../dicecup');

// For reduced test confusion, we're using a mock version of probable that 
// doesn't actually return random results. This way we can easily predict what 
// the results should be.

var mockProbable = {
  rollDie: function rollDie(sides) {
    return sides;
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
    '3d0-1': [
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

test('No opts', function testNoOps(t) {
  t.plan(2);

  var cup = createDiceCup();
  t.equal(typeof cup, 'object', 'Cup object is created even without opts.');

  var result = cup.roll('2d4');
  t.ok(result[0].total >= 2 && result[0].total <=8, 'Result is valid.');
});

test('No dice in string', function noDiceInString(t) {
  t.plan(1);

  var cup = createDiceCup({
    probable: mockProbable
  });

  t.deepEqual(cup.roll('fhqwhgads'), []);
});

test('Face limits', function testFaceLimits(t) {
  t.plan(4);

  var cup = createDiceCup({
    probable: mockProbable,
    numberOfFacesOnLargestDie: 50000,
    numberOfRollsLimit: 125000
  });

  var result = cup.roll('2d4 125000d50001');
  t.equal(
    result.error.name, 
    'Not enough faces',
    'It returns a "Not enough faces" error.'
  );
  t.equal(
    result.error.message, 
    'I don\'t have a die with that many faces.',
    'It returns an error that says it can\'t roll a die with that many faces.'
  );
  t.deepEqual(result.rolls, [], 'It returns no rolls.');
  t.ok(isNaN(result.total), 'It returns a total of NaN.');
});

test('Number of rolls limits', function numberOfRollsLimits(t) {
  t.plan(4);
  
  var cup = createDiceCup({
    probable: mockProbable,
    numberOfFacesOnLargestDie: 50000,
    numberOfRollsLimit: 125000
  });

  var result = cup.roll('125001d50000 10d6');

  t.equal(
    result.error.name, 
    'Too many rolls',
    'It returns a "Too many rolls" error.'
  );
  t.equal(
    result.error.message, 
    'I can\'t roll that many times.',
    'It returns an error that says it can\'t roll that many times.'
  );
  t.deepEqual(result.rolls, [], 'It returns no rolls.');
  t.ok(isNaN(result.total), 'It returns a total of NaN.');
});
