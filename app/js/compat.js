if (!Array.prototype.flatMap) {
  Object.defineProperty(Array.prototype, 'flatMap', {
    value: function(fn) {
      return this.map(fn).reduce((acc, val) => acc.concat(val), []);
    }
  })
}
