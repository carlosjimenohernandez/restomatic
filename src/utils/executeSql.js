Restomatic.utils.executeSql = function(code, args = {}) {
  console.log("[SQL] " + code);
  if(code.startsWith("SELECT")) {
    return Restomatic.database.prepare(code).all(args);
  } else {
    return Restomatic.database.prepare(code).run(args);
  }
};