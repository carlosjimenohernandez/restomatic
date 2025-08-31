Restomatic.utils.buildSqlUpdate = function(parameters) {
  const { from, where, set } = parameters;
  let fromSanitized = Restomatic.utils.escapeId(from);
  let sql = "";
  sql += `UPDATE ${fromSanitized} SET `;
  Apply_values:
  if(set) {
    let setSanitized = set;
    if(typeof set === "string") {
      setSanitized = JSON.parse(set);
    }
    Restomatic.utils.assertAs("Parameter «set» must be an object").that(typeof setSanitized === "object");
    let counter = 0;
    for(let prop in setSanitized) {
      const val = setSanitized[prop];
      if(counter !== 0) {
        sql += ","
      }
      sql += "\n  ";
      sql += Restomatic.utils.escapeId(prop);
      sql += " = ";
      sql += Restomatic.utils.escapeValue(val);
      counter++;
    }
  }
  Apply_where:
  if(where) {
    sql += Restomatic.utils.buildSqlWhere(where, from);
  }
  return sql;
};