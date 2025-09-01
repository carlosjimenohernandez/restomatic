Restomatic.utils.buildSqlRemoveTable = function(tableId) {
  const tableIdSanitized = Restomatic.utils.escapeId(tableId);
  let sql = "";
  sql = `DROP TABLE ${tableIdSanitized};`;
  return sql;
};