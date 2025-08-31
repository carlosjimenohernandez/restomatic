Restomatic.utils.assertAs = function(message) {
  return {
    that(condition) {
      if(!condition) {
        throw new Error("Assertion failed: " + message + "");
      }
    }
  }
};