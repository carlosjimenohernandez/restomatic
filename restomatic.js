// @file[0] = src/main/000.open-function.js

const RestomaticAPI = {
  create: async function(options = {}) {

    // @file[1] = src/main/001.initialize.js

    // Initialize
    const Restomatic = {
      utils: {},
      controllers: {
        api: {
          v1: {
            data: {
              // @OK
            }
          }
        }
      },
      parameters: null,
      application: null,
      router: null,
      server: null,
    };

    // @file[2] = src/utils/assertAs.js

    Restomatic.utils.assertAs = function(message) {
      return {
        that(condition) {
          if (!condition) {
            throw new Error("Assertion failed: " + message + "");
          }
        }
      }
    };

    // @file[3] = src/utils/escapeId.js

    Restomatic.utils.escapeId = function(text) {
      return require("sqlstring").escapeId(text);
    };

    // @file[4] = src/utils/escapeValue.js

    Restomatic.utils.escapeValue = function(text) {
      return require("sqlstring").escape(text);
    };

    // @file[5] = src/utils/protectWithAdminToken.js

    Restomatic.utils.protectWithAdminToken = function(operationId, token = false) {
      Restomatic.utils.assertAs(`Operation «${operationId}» requires administration token`).that(typeof token === "string");
      Restomatic.utils.assertAs(`Operation «${operationId}» could not match administration token with provided «${token}»`).that(token === Restomatic.parameters.token);
    };

    // @file[6] = src/utils/buildSqlCreateColumn.js

    Restomatic.utils.buildSqlCreateColumn = function(tableId, columnId, columnMetadata) {
      const tableIdSanitized = Restomatic.utils.escapeId(tableId);
      const columnIdSanitized = Restomatic.utils.escapeId(columnId);
      Restomatic.utils.assertAs("Parameter «columnMetadata» must be a string or an array").that((typeof columnMetadata === "string") || (typeof columnMetadata === "object"));
      let sql = typeof columnMetadata === "string" ? columnMetadata : typeof columnMetadata === "object" ? columnMetadata.sql : null;
      sql = `ALTER TABLE ${tableIdSanitized} ADD COLUMN ${columnIdSanitized} ${columnMetadata};`;
      return sql;
    };

    // @file[7] = src/utils/buildSqlCreateTable.js

    Restomatic.utils.buildSqlCreateTable = function(modelId, modelMetadata) {
      const modelIdSanitized = Restomatic.utils.escapeId(modelId);
      let sql = `CREATE TABLE ${modelIdSanitized} (\n`;
      sql += "  `id` INTEGER PRIMARY KEY AUTOINCREMENT";
      let contador = 0;
      for (let columnId in modelMetadata.columns) {
        const columnMetadata = modelMetadata.columns[columnId];
        sql += ",\n  ";
        sql += Restomatic.utils.escapeId(columnId) + " ";
        sql += typeof columnMetadata === "string" ? columnMetadata : typeof columnMetadata === "object" ? columnMetadata.sql : null;
        contador++;
      }
      sql += `\n);`;
      return sql;
    };

    // @file[8] = src/utils/buildSqlRemoveColumn.js

    Restomatic.utils.buildSqlRemoveColumn = function(tableId, columnId, columnMetadata) {
      const tableIdSanitized = Restomatic.utils.escapeId(tableId);
      const columnIdSanitized = Restomatic.utils.escapeId(columnId);
      let sql = "";
      sql = `ALTER TABLE ${tableIdSanitized} DROP COLUMN ${columnIdSanitized};`;
      return sql;
    };

    // @file[9] = src/utils/buildSqlRemoveTable.js

    Restomatic.utils.buildSqlRemoveTable = function(tableId) {
      const tableIdSanitized = Restomatic.utils.escapeId(tableId);
      let sql = "";
      sql = `DROP TABLE ${tableIdSanitized};`;
      return sql;
    };

    // @file[10] = src/utils/buildSqlWhere.js

    (function() {

      const validOperations = {
        "=": "=",
        "!=": "!=",
        "<": "<",
        "<=": "<=",
        ">": ">",
        ">=": ">=",
        "like": "like",
        "not like": "not like",
        "in": "in",
        "not in": "not in",
        "is null": "= null",
        "is not null": "!= null",
      }

      Restomatic.utils.buildSqlWhere = function(whereOriginal, table) {
        let whereInput = whereOriginal;
        if (typeof whereInput === "string") {
          whereInput = JSON.parse(whereInput);
        }
        Restomatic.utils.assertAs("Parameter «where» must be an array").that(Array.isArray(whereInput));
        let sql = "";
        for (let indexCondition = 0; indexCondition < whereInput.length; indexCondition++) {
          const whereCondition = whereInput[indexCondition];
          Restomatic.utils.assertAs(`Parameter «where» on index «${indexCondition}» must be an array`).that(Array.isArray(whereCondition));
          Restomatic.utils.assertAs(`Parameter «where» on index «${indexCondition}» must contain at least 2 items`).that(whereCondition.length >= 2);
          Restomatic.utils.assertAs(`Parameter «where» on index «${indexCondition}/1» must be a valid operation`).that(whereCondition[1] in validOperations);
          const operator = validOperations[whereCondition[1]];
          const sanitizedField = Restomatic.utils.escapeId(table) + "." + Restomatic.utils.escapeId(whereCondition[0]);
          if (indexCondition === 0) {
            sql += "\n  WHERE ";
          } else {
            sql += "\n  AND ";
          }
          if (operator === "= null") {
            sql += `${sanitizedField} IS NULL`;
          } else if (operator === "!= null") {
            sql += `${sanitizedField} IS NOT NULL`;
          } else if (operator === "like") {
            Restomatic.utils.assertAs(`Parameter «where» on index «${indexCondition}/2» must be a string to fit «is like» operator`).that(typeof whereCondition[2] === "string");
            const sanitizedComplement = Restomatic.utils.escapeValue(whereCondition[2]);
            sql += `${sanitizedField} LIKE ${sanitizedComplement}`;
          } else if (operator === "not like") {
            Restomatic.utils.assertAs(`Parameter «where» on index «${indexCondition}/2» must be a string to fit «is not like» operator`).that(typeof whereCondition[2] === "string");
            const sanitizedComplement = Restomatic.utils.escapeValue(whereCondition[2]);
            sql += `${sanitizedField} NOT LIKE ${sanitizedComplement}`;
          } else if (operator === "in") {
            Restomatic.utils.assertAs(`Parameter «where» on index «${indexCondition}/2» must be an array to fit «is in» operator`).that(Array.isArray(whereCondition[2]));
            const sanitizedComplement = Restomatic.utils.escapeValue(whereCondition[2]);
            sql += `${sanitizedField} IN (${sanitizedComplement})`;
          } else if (operator === "not in") {
            Restomatic.utils.assertAs(`Parameter «where» on index «${indexCondition}/2» must be an array to fit «is not in» operator`).that(Array.isArray(whereCondition[2]));
            const sanitizedComplement = Restomatic.utils.escapeValue(whereCondition[2]);
            sql += `${sanitizedField} NOT IN (${sanitizedComplement})`;
          } else if (["=", "!=", "<", "<=", ">", ">="].indexOf(operator) !== -1) {
            Restomatic.utils.assertAs(`Parameter «where» on index «${indexCondition}/2» must be a string or a number to fit «${operator}» operator`).that((typeof whereCondition[2] === "string") || (typeof whereCondition[2] === "number"));
            const sanitizedComplement = Restomatic.utils.escapeValue(whereCondition[2]);
            sql += `${sanitizedField} ${operator} ${sanitizedComplement}`;
          } else {
            throw new Error(`Operator «${operator}» was not idenfitied`);
          }
        }
        return sql;
      };
    })();

    // @file[11] = src/utils/buildSqlSelect.js

    Restomatic.utils.buildSqlSelect = function(parameters) {
      const {
        from,
        where,
        order,
        page,
        items
      } = parameters;
      let sql = "";
      sql += `SELECT * FROM ${from}`;
      Apply_where:
        if (where) {
          sql += Restomatic.utils.buildSqlWhere(where, from);
        }
      Apply_order:
        if (order) {
          let orderSanitized = order;
          if (typeof order === 'string') {
            orderSanitized = JSON.parse(order);
          }
          Restomatic.utils.assertAs("Parameter «order» must be an array").that(Array.isArray(orderSanitized));
          if (orderSanitized.length === 0) {
            break Apply_order;
          }
          sql += `\n  ORDER BY `;
          for (let index = 0; index < orderSanitized.length; index++) {
            let orderRule = orderSanitized[index];
            if (index !== 0) {
              sql += ", ";
            }
            if (orderRule.startsWith("!")) {
              sql += orderRule.substr(1) + " DESC";
            } else {
              sql += orderRule + " ASC";
            }
          }
        }
      Apply_pagination:
        if (page || items) {
          const itemsNumber = parseInt(items);
          const pageNumber = parseInt(page);
          const limit = itemsNumber;
          const offset = (itemsNumber * pageNumber) - itemsNumber;
          sql += `\n  LIMIT ${limit}`;
          sql += `\n  OFFSET ${offset}`;
        }
      sql += ";";
      return sql;
    };

    // @file[12] = src/utils/buildSqlInsert.js

    Restomatic.utils.buildSqlInsert = function(parameters) {
      let {
        into,
        values = "{}"
      } = parameters;
      let sql = "";
      if (typeof values === "string") {
        values = JSON.parse(values);
      }
      if (Array.isArray(values)) {
        // @OK
      } else if (typeof values === "object") {
        values = [values];
      }
      sql += `INSERT INTO `;
      sql += Restomatic.utils.escapeId(into);
      sql += ` (`;
      sql += Object.keys(values[0]).map(field => Restomatic.utils.escapeId(field)).join(", ");
      sql += `)`;
      sql += ` VALUES\n  `;
      for (let index = 0; index < values.length; index++) {
        if (index !== 0) {
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

    // @file[13] = src/utils/buildSqlUpdate.js

    Restomatic.utils.buildSqlUpdate = function(parameters) {
      const {
        from,
        where,
        set
      } = parameters;
      let fromSanitized = Restomatic.utils.escapeId(from);
      let sql = "";
      sql += `UPDATE ${fromSanitized} SET `;
      Apply_values:
        if (set) {
          let setSanitized = set;
          if (typeof set === "string") {
            setSanitized = JSON.parse(set);
          }
          Restomatic.utils.assertAs("Parameter «set» must be an object").that(typeof setSanitized === "object");
          let counter = 0;
          for (let prop in setSanitized) {
            const val = setSanitized[prop];
            if (counter !== 0) {
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
        if (where) {
          sql += Restomatic.utils.buildSqlWhere(where, from);
        }
      return sql;
    };

    // @file[14] = src/utils/buildSqlDelete.js

    Restomatic.utils.buildSqlDelete = function(parameters) {
      const {
        from,
        where
      } = parameters;
      let sql = "";
      const fromSanitized = Restomatic.utils.escapeId(from);
      sql += `DELETE FROM ${fromSanitized}`;
      Apply_where:
        if (where) {
          sql += Restomatic.utils.buildSqlWhere(where, from);
        }
      sql += ";";
      return sql;
    };

    // @file[15] = src/utils/getSchema.js

    Restomatic.utils.getSchema = function() {
      // Paso 1: obtener todas las tablas
      const tablas = Restomatic.utils.querySql(`
    SELECT name
      FROM sqlite_master
      WHERE type='table'
        AND name NOT LIKE 'sqlite_%';
  `);
      const mapa = {};
      for (const {
          name
        }
        of tablas) {
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

    // @file[16] = src/utils/getRandomString.js

    Restomatic.utils.getRandomString = function(len = 5, alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ") {
      let out = "";
      while (out.length < len) {
        out += alphabet[Math.floor(Math.random() * alphabet.length)];
      }
      return out;
    };

    // @file[17] = src/utils/formatDate.js

    Restomatic.utils.formatDate = function(date) {
      let formatted = "";
      formatted += ("" + date.getFullYear()).padStart(4, "0");
      formatted += "." + ("" + (date.getMonth() + 1)).padStart(2, "0");
      formatted += "." + ("" + date.getDate()).padStart(2, "0");
      formatted += "." + ("" + date.getHours()).padStart(2, "0");
      formatted += "." + ("" + date.getMinutes()).padStart(2, "0");
      formatted += "." + ("" + date.getSeconds()).padStart(2, "0");
      formatted += "." + ("" + date.getMilliseconds()).padStart(3, "0");
      return formatted;
    };

    // @file[18] = src/utils/querySql.js

    Restomatic.utils.querySql = function(code, args = {}) {
      console.log("[SQL] " + code);
      return Restomatic.database.prepare(code).all(args);
    };

    // @file[19] = src/utils/executeSql.js

    Restomatic.utils.executeSql = function(code, args = {}) {
      console.log("[SQL] " + code);
      return Restomatic.database.prepare(code).run(args);
    };

    // @file[20] = src/controllers/api/v1/data/schema.js

    Restomatic.controllers.api.v1.data.schema = function(request, response) {
      try {
        const schema = Restomatic.utils.getSchema();
        return response.success({
          operation: "api/v1/data/schema",
          output: schema,
        });
      } catch (error) {
        return response.fail(error);
      }
    };

    // @file[21] = src/controllers/api/v1/data/select.js

    Restomatic.controllers.api.v1.data.select = async function(request, response) {
      try {
        const fields = request.body?.fields || request.query.fields || false;
        const from = request.body?.from || request.query.from || false;
        const where = request.body?.where || request.query.where || false;
        const order = request.body?.order || request.query.order || false;
        const page = request.body?.page || request.query.page || 1;
        const items = request.body?.items || request.query.items || 100;
        const sanitizedSelect = Restomatic.utils.buildSqlSelect({
          fields,
          from,
          where,
          order,
          page,
          items,
        });
        const output = Restomatic.utils.querySql(sanitizedSelect);
        return response.success({
          operation: "api/v1/data/select",
          output,
        });
      } catch (error) {
        return response.fail(error);
      }
    };

    // @file[22] = src/controllers/api/v1/data/insert.js

    Restomatic.controllers.api.v1.data.insert = async function(request, response) {
      try {
        Restomatic.utils.protectWithAdminToken("insert", request.headers.token || request.body?.token || request.query.token || false);
        const into = request.body?.into || request.query.into || false;
        const values = request.body?.values || request.query.values || false;
        const sanitizedInsert = Restomatic.utils.buildSqlInsert({
          into,
          values,
        });
        const output = Restomatic.utils.executeSql(sanitizedInsert);
        return response.success({
          operation: "api/v1/data/insert",
          output,
        });
      } catch (error) {
        return response.fail(error);
      }
    };

    // @file[23] = src/controllers/api/v1/data/update.js

    Restomatic.controllers.api.v1.data.update = async function(request, response) {
      try {
        Restomatic.utils.protectWithAdminToken("update", request.headers.token || request.body?.token || request.query.token || false);
        const set = request.body?.set || request.query.set || false;
        const from = request.body?.from || request.query.from || false;
        const where = request.body?.where || request.query.where || false;
        const sanitizedUpdate = Restomatic.utils.buildSqlUpdate({
          from,
          set,
          where,
        });
        const output = Restomatic.utils.executeSql(sanitizedUpdate);
        return response.success({
          operation: "api/v1/data/update",
          output,
        });
      } catch (error) {
        return response.fail(error);
      }
    };

    // @file[24] = src/controllers/api/v1/data/delete.js

    Restomatic.controllers.api.v1.data.delete = async function(request, response) {
      try {
        Restomatic.utils.protectWithAdminToken("delete", request.headers.token || request.body?.token || request.query.token || false);
        const from = request.body?.from || request.query.from || false;
        const where = request.body?.where || request.query.where || false;
        const sanitizedDelete = Restomatic.utils.buildSqlDelete({
          from,
          where,
        });
        const output = Restomatic.utils.executeSql(sanitizedDelete);
        return response.success({
          operation: "api/v1/data/delete",
          output,
        });
      } catch (error) {
        return response.fail(error);
      }
    };

    // @file[25] = src/controllers/api/v1/data/createTable.js

    Restomatic.controllers.api.v1.data.createTable = async function(request, response) {
      try {
        Restomatic.utils.protectWithAdminToken("createTable", request.headers.token || request.body?.token || request.query.token || false);
        const table = request.body?.table || request.query.table || false;
        const content = request.body?.content || request.query.content || false;
        const sanitizedCreateTable = Restomatic.utils.buildSqlCreateTable(table, content);
        const output = Restomatic.utils.executeSql(sanitizedCreateTable);
        return response.success({
          operation: "api/v1/data/createTable",
          output,
        });
      } catch (error) {
        return response.fail(error);
      }
    };

    // @file[26] = src/controllers/api/v1/data/createColumn.js

    Restomatic.controllers.api.v1.data.createColumn = async function(request, response) {
      try {
        Restomatic.utils.protectWithAdminToken("createColumn", request.headers.token || request.body?.token || request.query.token || false);
        const table = request.body?.table || request.query.table || false;
        const column = request.body?.column || request.query.column || false;
        const content = request.body?.content || request.query.content || false;
        const sanitizedCreateColumn = Restomatic.utils.buildSqlCreateColumn(table, column, content);
        const output = Restomatic.utils.executeSql(sanitizedCreateColumn);
        return response.success({
          operation: "api/v1/data/createColumn",
          output,
        });
      } catch (error) {
        return response.fail(error);
      }
    };

    // @file[27] = src/controllers/api/v1/data/removeTable.js

    Restomatic.controllers.api.v1.data.removeTable = async function(request, response) {
      try {
        Restomatic.utils.protectWithAdminToken("removeTable", request.headers.token || request.body?.token || request.query.token || false);
        const table = request.body?.table || request.query.table || false;
        const sanitizedRemoveTable = Restomatic.utils.buildSqlRemoveTable(table);
        const output = Restomatic.utils.executeSql(sanitizedRemoveTable);
        return response.success({
          operation: "api/v1/data/removeTable",
          output,
        });
      } catch (error) {
        return response.fail(error);
      }
    };

    // @file[28] = src/controllers/api/v1/data/removeColumn.js

    Restomatic.controllers.api.v1.data.removeColumn = async function(request, response) {
      try {
        Restomatic.utils.protectWithAdminToken("removeColumn", request.headers.token || request.body?.token || request.query.token || false);
        const table = request.body?.table || request.query.table || false;
        const column = request.body?.column || request.query.column || false;
        const sanitizedRemoveColumn = Restomatic.utils.buildSqlRemoveColumn(table, column);
        const output = Restomatic.utils.executeSql(sanitizedRemoveColumn);
        return response.success({
          operation: "api/v1/data/removeColumn",
          output,
        });
      } catch (error) {
        return response.fail(error);
      }
    };

    // @file[29] = src/controllers/api/v1/data/listFiles.js

    Restomatic.controllers.api.v1.data.listFiles = async function(request, response) {
      const files = await require("fs").promises.readdir(__dirname + "/src/static/uploads/");
      return response.success({
        output: files
      });
    };

    // @file[30] = src/controllers/api/v1/data/setFile.js

    (function() {

      const multer = require("multer");
      const uploadsDirectory = __dirname + "/src/static/uploads/";
      const storage = multer.diskStorage({
        destination: function(req, file, done) {
          done(null, uploadsDirectory);
        },
        filename: function(req, file, done) {
          const datePart = Restomatic.utils.formatDate(new Date());
          const randomPart = Restomatic.utils.getRandomString(10);
          const extensionPart = require("path").extname(file.originalname);
          done(null, datePart + "." + randomPart + extensionPart);
        }
      });
      const controller = multer({
        storage,
        fileFilter: function(request, file, done) {
          try {
            Restomatic.utils.protectWithAdminToken("setFile", request.headers.token || request.body?.token || request.query.token || false);
            done(null, true);
          } catch (error) {
            done(error, false);
          }
        }
      });

      Restomatic.controllers.api.v1.data.setFile = [
        controller.single("file"),
        function(request, response) {
          response.success({
            operation: "/api/v1/data/setFile",
            output: {
              file: request.file,
            }
          });
        }
      ];

    })();

    // @file[31] = src/main/002.get-parameters.js

    // Get parameters
    Restomatic.parameters = options;

    // @file[32] = src/main/003.create-database.js

    // Create database
    Create_database: {

      const Database = require("better-sqlite3");
      const filename = Restomatic.parameters.database;
      const database = new Database(filename, {});
      Restomatic.database = database;

    }

    // @file[33] = src/main/004.create-application.js

    // Create application
    Create_application: {

      Extend_express_prototypes: {
        require("express").response.success = function(data) {
          this.type("json");
          this.status(200).send({
            ok: true,
            data
          });
        };
        require("express").response.fail = function(error, status = 400) {
          this.type("json");
          this.status(status).send({
            ok: false,
            error: error.name + ": " + error.message
          });
        };
      }

      const express = require("express");
      const app = express();
      const router = new express.Router();
      app.use(router);
      Restomatic.application = app;
      Restomatic.router = router;

    }

    // @file[34] = src/main/005.create-server.js

    // Create server
    Create_server: {

      const http = require("http");
      const server = http.createServer(Restomatic.application);
      Restomatic.server = server;

    }

    // @file[35] = src/main/010.add-rest-routes.js

    // Add rest routes
    Add_rest_routes: {

      Restomatic.router.use(require("body-parser").json());
      Restomatic.router.use("/api/v1/data/schema", Restomatic.controllers.api.v1.data.schema);
      Restomatic.router.use("/api/v1/data/select", Restomatic.controllers.api.v1.data.select);
      Restomatic.router.use("/api/v1/data/insert", Restomatic.controllers.api.v1.data.insert);
      Restomatic.router.use("/api/v1/data/update", Restomatic.controllers.api.v1.data.update);
      Restomatic.router.use("/api/v1/data/delete", Restomatic.controllers.api.v1.data.delete);

      Restomatic.router.use("/api/v1/data/createTable", Restomatic.controllers.api.v1.data.createTable);
      Restomatic.router.use("/api/v1/data/createColumn", Restomatic.controllers.api.v1.data.createColumn);
      Restomatic.router.use("/api/v1/data/removeTable", Restomatic.controllers.api.v1.data.removeTable);
      Restomatic.router.use("/api/v1/data/removeColumn", Restomatic.controllers.api.v1.data.removeColumn);
      Restomatic.router.use("/api/v1/data/listFiles", Restomatic.controllers.api.v1.data.listFiles);
      Restomatic.router.post("/api/v1/data/setFile", Restomatic.controllers.api.v1.data.setFile);

      // Inject routes to override other routes:
      if (typeof Restomatic.parameters.routesCallback === "function") {
        Restomatic.parameters.routesCallback();
      }

      Restomatic.router.use("/static", require("express").static(__dirname + "/src/static"));
      Restomatic.router.use("/template", async function(request, response, next) {
        try {
          console.log()
          const filepath = __dirname + "/src/template" + request.path;
          const filecontent = await require("fs").promises.readFile(filepath, "utf8");
          const rendered = await require("ejs").render(filecontent, {
            Restomatic,
            request,
            response
          }, {
            async: true
          });
          return response.send(rendered);
        } catch (error) {
          console.log(error);
          if (error.code === "ENOENT") {
            return next();
          } else {
            console.log(error);
            return response.fail(error);
          }
        }
      });


    }

    // @file[36] = src/main/011.add-rest-models.js

    // Add rest models
    Add_rest_models: {

      Restomatic.utils.assertAs("Parameter «models» must be a string").that(typeof Restomatic.parameters.models === "string");
      let foundModels = false;
      try {
        const modelsPath = require("path").resolve(process.cwd(), Restomatic.parameters.models);
        foundModels = require(modelsPath);
      } catch (error) {
        foundModels = error;
        console.log(error);
      }
      Restomatic.utils.assertAs("Parameter «models» must point to an existing and readable file").that(!(foundModels instanceof Error));
      Restomatic.utils.assertAs("File of parameter «models» must return an object").that(typeof foundModels === 'object');
      Restomatic.parameters.schema = {};
      for (let modelId in foundModels) {
        const modelMetadata = foundModels[modelId];
        Restomatic.utils.assertAs(`Model «${modelId}» must be an object`).that(typeof modelMetadata === 'object');
        Restomatic.parameters.schema[modelId] = modelMetadata;
        try {
          const createTableSql = Restomatic.utils.buildSqlCreateTable(modelId, modelMetadata);
          const result = Restomatic.utils.executeSql(createTableSql);
        } catch (error) {
          if ((error.name === "SqliteError") && (error.message.endsWith("already exists"))) {
            console.log(`[*] Table «${modelId}» already exists in the database`);
          } else {
            throw error;
          }
        }

      }

    }

    // @file[37] = src/main/900.start-server.js

    // Start server
    Start_server: {

      Restomatic.server.listen(Restomatic.parameters.port, function() {
        console.log(`[*] Restomatic server started at:`);
        console.log(`  - http://127.0.0.1:${Restomatic.parameters.port}`);
      });

    }

    // @file[38] = src/main/999.close-function.js

    return Restomatic;
  }
};

RestomaticAPI.default = RestomaticAPI;

module.exports = RestomaticAPI;