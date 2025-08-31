module.exports = {
  lote: {
    columns: {
      nombre: {
        sql: "VARCHAR(255) UNIQUE",
      },
      descripcion: {
        sql: "VARCHAR(255)",
      },
      unidades: {
        sql: "INTEGER",
      },
      magnitud: {
        sql: "VARCHAR(255)",
      },
      tipo: {
        sql: "VARCHAR(255)",
      },
      contenedor: {
        sql: "INTEGER REFERENCES lote(id)"
      }
    }
  }
};