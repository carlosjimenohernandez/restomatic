Restomatic.utils.buildSqlCreateTable = function(modelId, modelMetadata) {
  const modelIdSanitized = Restomatic.utils.escapeId(modelId);
  let sql = `CREATE TABLE ${modelIdSanitized} (\n`;
  sql += "  `id` INTEGER PRIMARY KEY AUTOINCREMENT";
  let contador = 0;
  for(let columnId in modelMetadata.columns) {
    const columnMetadata = modelMetadata.columns[columnId];
    sql += ",\n  ";
    sql += Restomatic.utils.escapeId(columnId) + " ";
    sql += typeof columnMetadata === "string" ? columnMetadata : typeof columnMetadata === "object" ? columnMetadata.sql : null;
    contador++;
  }
  sql += `\n);`;
  return sql;
};