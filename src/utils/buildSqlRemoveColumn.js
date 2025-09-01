Restomatic.utils.buildSqlRemoveColumn = function(tableId, columnId, columnMetadata) {
  const tableIdSanitized = Restomatic.utils.escapeId(tableId);
  const columnIdSanitized = Restomatic.utils.escapeId(columnId);
  let sql = "";
  sql = `ALTER TABLE ${tableIdSanitized} DROP COLUMN ${columnIdSanitized};`;
  return sql;
};