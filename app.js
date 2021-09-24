import { version } from './package.json';
import Dicecup from './dicecup';

var textInput = document.getElementById('roll-text');
var rollButton = document.getElementById('roll-button');
var resultField = document.getElementById('result');
var totalField = document.getElementById('total-field');

var cup;

(async function go() {
  renderVersion();

  cup = Dicecup();

  rollButton.addEventListener('click', runRoll);
})();

function runRoll() {
  var results = cup.roll(textInput.value);
  const total = results.map((result) => result.total).join(', ');
  if (totalField.textContent) {
    totalField.textContent = totalField.textContent + ', ';
  }
  totalField.textContent = totalField.textContent + total;

  resultField.textContent = JSON.stringify(results, null, 2);
}

function renderVersion() {
  var versionInfo = document.getElementById('version-info');
  versionInfo.textContent = version;
}
