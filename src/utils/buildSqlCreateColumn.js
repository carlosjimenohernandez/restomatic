Restomatic.utils.buildSqlCreateColumn = function(tableId, columnId, columnMetadata) {
  const tableIdSanitized = Restomatic.utils.escapeId(tableId);
  const columnIdSanitized = Restomatic.utils.escapeId(columnId);
  Restomatic.utils.assertAs("Parameter «columnMetadata» must be a string or an array").that((typeof columnMetadata === "string") || (typeof columnMetadata === "object"));
  let sql = typeof columnMetadata === "string" ? columnMetadata : typeof columnMetadata === "object" ? columnMetadata.sql : null;
  sql = `ALTER TABLE ${tableIdSanitized} ADD COLUMN ${columnIdSanitized} ${columnMetadata};`;
  return sql;
};