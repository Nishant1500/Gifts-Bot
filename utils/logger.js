const chalk = require('chalk')

function log(...args) {
console.log(chalk.greenBright(...args));
  return true;
};
function hex(hex, ...args) {
  console.log(chalk.hex(hex)(...args));
  return true;
}

module.exports = {
  log,
  hex
}