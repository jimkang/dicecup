var probableModule = require('probable');
var _ = require('lodash');

function createDiceCup(opts) {
  var probable = probableModule;
  var numberOfRollsLimit;
  var numberOfFacesOnLargestDie;
  var error;

  if (opts) {
    if (opts.probable) {
      probable = opts.probable;
    }
    if (opts.numberOfRollsLimit) {
      numberOfRollsLimit = opts.numberOfRollsLimit;
    }
    if (opts.numberOfFacesOnLargestDie) {
      numberOfFacesOnLargestDie = opts.numberOfFacesOnLargestDie;
    }
  }

  function rollDice(diceString) {
    var dieStrings = diceString.trim().split(' ');
    var parsedDiceSpecs = dieStrings.map(parse);
    parsedDiceSpecs = parsedDiceSpecs.filter(_.isObject);

    if (parsedDiceSpecs.some(specHasTooManyDice)) {
      error = new Error('I can\'t roll that many times.');
      error.name = 'Too many rolls';
    }
    else if (parsedDiceSpecs.some(specHasTooManyFaces)) {
      error = new Error('I don\'t have a die with that many faces.');
      error.name = 'Not enough faces';
    }

    if (error) {
      return {
        error: error,
        rolls: [],
        total: NaN        
      };
    }
    else {
      return parsedDiceSpecs.map(rollDie);
    }
  }

  function rollDie(diceSpec) {    
    var results = {
      rolls: [],
      total: 0
    };

    for (var i = 0; i < diceSpec.times; ++i) {
      results.rolls.push(probable.rollDie(diceSpec.faces));
    }
    results.total = results.rolls.reduce(add, 0) + diceSpec.modifier;

    return results;
  }

  function specHasTooManyDice(diceSpec) {
    return (
      numberOfRollsLimit !== undefined && diceSpec.times > numberOfRollsLimit
    );
  }

  function specHasTooManyFaces(diceSpec) {
    return (
      numberOfFacesOnLargestDie !== undefined && 
      diceSpec.faces > numberOfFacesOnLargestDie
    );
  }

  return {
    roll: rollDice
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

  if (command.search(/d\d/i) !== -1) {
    // determine number of dice to roll
    var times = command.match(/(\d+)d/i);
    parsed.times = times && times[1] && parseInt(times[1]) || 1;
  }
  else {
    // If there's no 'd{number}' anywhere in there, then there's no dice to roll.
    if (command.search(/\d/i) === -1) {
      // If there's not even digits in there, then there's nothing to do.
      return undefined;
    }
    else {
      parsed.times = 0;
    }
  }

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
