
function createDiceCup(opts) {
  var probable = opts.probable;

  function roll(diceString) {
    var trimmedString = diceString.replace(/\s/g, '');
    console.log(trimmedString);
    var characterstics = parse(trimmedString);
    console.log(characterstics);
    var results = {
      rolls: [],
      total: 0
    };

    for (var i = 0; i < characterstics.times; ++i) {
      results.rolls.push(probable.roll(characterstics.faces) + 1);
    }
    results.total = results.rolls.reduce(add, 0) + characterstics.modifier;

    return results;
  }

  return {
    roll: roll
  };
}

function add(a, b) {
  return a + b;
}

// From https://github.com/NickMele/node-dice/, slightly modified.
function parse(command) {
  var parsed = {};

  if (typeof command !== 'string') {
    throw new Error('Parameter `command` must be a string, not undefined');
  }

  // determine number of dice to roll
  var times = command.match(/(\d+)d/i);
  parsed.times = times && times[1] && parseInt(times[1]) || 1;

  // determine the number of faces
  var faces = command.match(/d(\d+)/i);
  parsed.faces = faces && faces[1] && parseInt(faces[1]) || 0;

  // determine the number of dice to keep
  var keep = command.match(/\(k(\d+)\)/i);
  parsed.keep = keep && keep[1] && parseInt(keep[1]) || null;

  // determine if should keep the lowest rolled dice
  var lowest = /-L/.test(command);
  parsed.lowest = lowest;
  // determine if should keep the highest rolled dice
  var highest = /-H/.test(command);
  parsed.highest = highest;

  // determine the multiplier
  var multiplier = command.match(/(?!d\d+)x(\d+)/);
  parsed.multiplier = multiplier && multiplier[1] && parseInt(multiplier[1]) || 1;

  // determine the modifier
  var modifier = command.match(/(\+\d+\)?|-\d+)\)?/);
  parsed.modifier = modifier && modifier[1] && parseInt(modifier[1]) || 0;

  // determine if we need to repeat at all
  var repeat = command.match(/^(\d+)x\(|\)x(\d+)$/);
  parsed.repeat = repeat && repeat[1] && parseInt(repeat[1]) || repeat && repeat[2] && parseInt(repeat[2]) || 1;

  return parsed;
}

module.exports = createDiceCup;