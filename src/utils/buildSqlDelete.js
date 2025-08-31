Restomatic.utils.buildSqlDelete = function(parameters) {
  const { from, where } = parameters;
  let sql = "";
  const fromSanitized = Restomatic.utils.escapeId(from);
  sql += `DELETE FROM ${fromSanitized}`;
  Apply_where:
  if(where) {
    sql += Restomatic.utils.buildSqlWhere(where, from);
  }
  sql += ";";
  return sql;
};