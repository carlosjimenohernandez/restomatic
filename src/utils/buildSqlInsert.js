Restomatic.utils.buildSqlInsert = function(parameters) {
  let { into, values = "{}" } = parameters;
  let sql = "";
  if(typeof values === "string") {
    values = JSON.parse(values);
  }
  if(Array.isArray(values)) {
    // @OK
  } else if(typeof values === "object") {
    values = [values];
  }
  sql += `INSERT INTO `;
  sql += Restomatic.utils.escapeId(into);
  sql += ` (`;
  sql += Object.keys(values[0]).map(field => Restomatic.utils.escapeId(field)).join(", ");
  sql += `)`;
  sql += ` VALUES\n  `;
  for(let index=0; index<values.length; index++) {
    if(index !== 0) {
      sql += ",\n  ";
    }
    sql += `(`;
    const row = values[index];
    sql += Object.values(row).map(value => Restomatic.utils.escapeValue(value)).join(", ");
    sql += `)`;
  }
  sql += ";";
  return sql;
};