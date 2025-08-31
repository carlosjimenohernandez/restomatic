// Create database
Create_database: {

  const Database = require("better-sqlite3");
  const filename = Restomatic.parameters.database;
  const database = new Database(filename, {});
  Restomatic.database = database;

}