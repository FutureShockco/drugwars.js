class Log {
  constructor() {
    this.log = [];
  }

  add(message) {
    this.log.push(message);
  }
}

module.exports = Log;
