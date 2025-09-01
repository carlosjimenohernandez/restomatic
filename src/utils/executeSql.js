Restomatic.utils.executeSql = function(code, args = {}) {
  console.log("[SQL] " + code);
  return Restomatic.database.prepare(code).run(args);
};