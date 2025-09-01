Restomatic.utils.getSchema = function () {
  // Paso 1: obtener todas las tablas
  const tablas = Restomatic.utils.querySql(`
    SELECT name
      FROM sqlite_master
      WHERE type='table'
        AND name NOT LIKE 'sqlite_%';
  `);
  const mapa = {};
  for (const { name } of tablas) {
    // Paso 2: columnas
    const columnas = Restomatic.utils.querySql(`PRAGMA table_info(${name})`);
    // Paso 3: foreign keys
    const fks = Restomatic.utils.querySql(`PRAGMA foreign_key_list(${name})`);
    // Paso 4: formatear datos
    mapa[name] = {
      columns: columnas.map(c => ({
        nombre: c.name,
        tipo: c.type,
        notNull: !!c.notnull,
        pk: !!c.pk,
        default: c.dflt_value
      })),
      foreignKeys: fks.map(fk => ({
        id: fk.id, // varias columnas pueden compartir el mismo id
        columna: fk.from,
        referenciaTabla: fk.table,
        referenciaColumna: fk.to,
        onUpdate: fk.on_update,
        onDelete: fk.on_delete
      }))
    };
  }
  return mapa;
}