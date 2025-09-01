Restomatic.utils.querySql = function(code, args = {}) {
  console.log("[SQL] " + code);
  return Restomatic.database.prepare(code).all(args);
};