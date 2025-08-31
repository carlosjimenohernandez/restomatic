// @file[0] = src/main/001.initialize.js

// Initialize
global.Restomatic = {
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

// @file[1] = src/utils/assertAs.js

Restomatic.utils.assertAs = function(message) {
  return {
    that(condition) {
      if(!condition) {
        throw new Error("Assertion failed: " + message + "");
      }
    }
  }
};

// @file[2] = src/utils/escapeId.js

Restomatic.utils.escapeId = function(text) {
  return require("sqlstring").escapeId(text);
};

// @file[3] = src/utils/escapeValue.js

Restomatic.utils.escapeValue = function(text) {
  return require("sqlstring").escape(text);
};

// @file[4] = src/utils/protectWithAdminToken.js

Restomatic.utils.protectWithAdminToken = function(operationId, token = false) {
  Restomatic.utils.assertAs(`Operation «${operationId}» requires administration token`).that(typeof token === "string");
  Restomatic.utils.assertAs(`Operation «${operationId}» could not match administration token with provided «${token}»`).that(token === Restomatic.parameters.token);
};

// @file[5] = src/utils/buildSqlCreateTable.js

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

// @file[6] = src/utils/buildSqlWhere.js

(function () {

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

  Restomatic.utils.buildSqlWhere = function (whereOriginal, table) {
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
      if(indexCondition === 0) {
        sql += "\n  WHERE ";
      } else {
        sql += "\n  AND ";
      }
      if(operator === "= null") {
        sql += `${sanitizedField} IS NULL`;
      } else if(operator === "!= null") {
        sql += `${sanitizedField} IS NOT NULL`;
      } else if(operator === "like") {
        Restomatic.utils.assertAs(`Parameter «where» on index «${indexCondition}/2» must be a string to fit «is like» operator`).that(typeof whereCondition[2] === "string");
        const sanitizedComplement = Restomatic.utils.escapeValue(whereCondition[2]);
        sql += `${sanitizedField} LIKE ${sanitizedComplement}`;
      } else if(operator === "not like") {
        Restomatic.utils.assertAs(`Parameter «where» on index «${indexCondition}/2» must be a string to fit «is not like» operator`).that(typeof whereCondition[2] === "string");
        const sanitizedComplement = Restomatic.utils.escapeValue(whereCondition[2]);
        sql += `${sanitizedField} NOT LIKE ${sanitizedComplement}`;
      } else if(operator === "in") {
        Restomatic.utils.assertAs(`Parameter «where» on index «${indexCondition}/2» must be an array to fit «is in» operator`).that(Array.isArray(whereCondition[2]));
        const sanitizedComplement = Restomatic.utils.escapeValue(whereCondition[2]);
        sql += `${sanitizedField} IN (${sanitizedComplement})`;
      } else if(operator === "not in") {
        Restomatic.utils.assertAs(`Parameter «where» on index «${indexCondition}/2» must be an array to fit «is not in» operator`).that(Array.isArray(whereCondition[2]));
        const sanitizedComplement = Restomatic.utils.escapeValue(whereCondition[2]);
        sql += `${sanitizedField} NOT IN (${sanitizedComplement})`;
      } else if(["=","!=","<","<=",">",">="].indexOf(operator) !== -1) {
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

// @file[7] = src/utils/buildSqlSelect.js

Restomatic.utils.buildSqlSelect = function(parameters) {
  const { from, where, order, page, items } = parameters;
  let sql = "";
  sql += `SELECT * FROM ${from}`;
  Apply_where:
  if(where) {
    sql += Restomatic.utils.buildSqlWhere(where, from);
  }
  Apply_order:
  if(order) {
    let orderSanitized = order;
    if(typeof order === 'string') {
      orderSanitized = JSON.parse(order);
    }
    Restomatic.utils.assertAs("Parameter «order» must be an array").that(Array.isArray(orderSanitized));
    if(orderSanitized.length === 0) {
      break Apply_order;
    }
    sql += `\n  ORDER BY `;
    for(let index=0; index<orderSanitized.length; index++) {
      let orderRule = orderSanitized[index];
      if(index !== 0) {
        sql += ", ";
      }
      if(orderRule.startsWith("!")) {
        sql += orderRule.substr(1) + " DESC";
      } else {
        sql += orderRule + " ASC";
      }
    }
  }
  Apply_pagination:
  if(page || items) {
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

// @file[8] = src/utils/buildSqlInsert.js

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

// @file[9] = src/utils/buildSqlUpdate.js

Restomatic.utils.buildSqlUpdate = function(parameters) {
  const { from, where, set } = parameters;
  let fromSanitized = Restomatic.utils.escapeId(from);
  let sql = "";
  sql += `UPDATE ${fromSanitized} SET `;
  Apply_values:
  if(set) {
    let setSanitized = set;
    if(typeof set === "string") {
      setSanitized = JSON.parse(set);
    }
    Restomatic.utils.assertAs("Parameter «set» must be an object").that(typeof setSanitized === "object");
    let counter = 0;
    for(let prop in setSanitized) {
      const val = setSanitized[prop];
      if(counter !== 0) {
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
  if(where) {
    sql += Restomatic.utils.buildSqlWhere(where, from);
  }
  return sql;
};

// @file[10] = src/utils/buildSqlDelete.js

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

// @file[11] = src/utils/executeSql.js

Restomatic.utils.executeSql = function(code, args = {}) {
  console.log("[SQL] " + code);
  if(code.startsWith("SELECT")) {
    return Restomatic.database.prepare(code).all(args);
  } else {
    return Restomatic.database.prepare(code).run(args);
  }
};

// @file[12] = src/controllers/api/v1/data/schema.js

Restomatic.controllers.api.v1.data.schema = function(request, response) {
  try {
    // @TODO...
    return response.success({
      operation: "api/v1/data/schema",
      output: Restomatic.parameters.schema,
    });
  } catch (error) {
    return response.fail(error);
  }
};

// @file[13] = src/controllers/api/v1/data/select.js

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
    const output = Restomatic.utils.executeSql(sanitizedSelect);
    return response.success({
      operation: "api/v1/data/select",
      output,
    });
  } catch (error) {
    return response.fail(error);
  }
};

// @file[14] = src/controllers/api/v1/data/insert.js

Restomatic.controllers.api.v1.data.insert = async function(request, response) {
  try {
    Restomatic.utils.protectWithAdminToken("insert", request.body?.token || request.query.token || false);
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

// @file[15] = src/controllers/api/v1/data/update.js

Restomatic.controllers.api.v1.data.update = async function(request, response) {
  try {
    Restomatic.utils.protectWithAdminToken("update", request.body?.token || request.query.token || false);
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

// @file[16] = src/controllers/api/v1/data/delete.js

Restomatic.controllers.api.v1.data.delete = async function(request, response) {
  try {
    Restomatic.utils.protectWithAdminToken("delete", request.body?.token || request.query.token || false);
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

// @file[17] = src/main/002.get-parameters.js

// Get parameters
Extract_process_parameters: {

  let lastArgument = "_";

  Restomatic.parameters = process.argv.reduce(function (output, arg) {
    if (arg.startsWith("--")) {
      lastArgument = arg.substr(2);
      return output;
    }
    if (!(lastArgument in output)) {
      output[lastArgument] = null;
    }
    if (output[lastArgument] === null) {
      output[lastArgument] = arg;
    } else {
      output[lastArgument] = [output[lastArgument]];
      output[lastArgument].push(arg);
    }
    return output;
  }, {});

  // Parameter database:
  if (!Restomatic.parameters.database) {
    Restomatic.parameters.database = "default.sqlite";
  }

  // Parameter port:
  if (!Restomatic.parameters.port) {
    Restomatic.parameters.port = "9090";
  }

  // Parameter models:
  if (!Restomatic.parameters.models) {
    Restomatic.parameters.models = require("path").resolve(process.cwd(), "models.js");
  }

  // Parameter routes:
  if (!Restomatic.parameters.routes) {
    Restomatic.parameters.routes = require("path").resolve(process.cwd(), "routes.js");
  } else {
    Restomatic.parameters.routes = require("path").resolve(process.cwd(), Restomatic.parameters.routes);
  }

  // Parameter routesCallback:
  if (Restomatic.parameters.routes) {
    try {
      Restomatic.parameters.routesCallback = require(Restomatic.parameters.routes);
    } catch (error) {
      Restomatic.parameters.routesCallback = function() {
        console.log("[WARN] Routes will not be loaded due to " + error.name + ": " + error.message);
      };
    }
  }

  // Parameter token:
  if (!Restomatic.parameters.token) {
    Restomatic.parameters.token = false;
  }

}

// @file[18] = src/main/003.create-database.js

// Create database
Create_database: {

  const Database = require("better-sqlite3");
  const filename = Restomatic.parameters.database;
  const database = new Database(filename, {});
  Restomatic.database = database;

}

// @file[19] = src/main/004.create-application.js

// Create application
Create_application: {

  Extend_express_prototypes: {
    require("express").response.success = function (data) {
      this.type("json");
      this.status(200).send({
        ok: true,
        data
      });
    };
    require("express").response.fail = function (error, status = 400) {
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

// @file[20] = src/main/005.create-server.js

// Create server
Create_server: {

  const http = require("http");
  const server = http.createServer(Restomatic.application);
  Restomatic.server = server;

}

// @file[21] = src/main/010.add-rest-routes.js

// Add rest routes
Add_rest_routes: {

  Restomatic.router.use(require("body-parser").json());
  Restomatic.router.use("/api/v1/data/schema", Restomatic.controllers.api.v1.data.schema);
  Restomatic.router.use("/api/v1/data/select", Restomatic.controllers.api.v1.data.select);
  Restomatic.router.use("/api/v1/data/insert", Restomatic.controllers.api.v1.data.insert);
  Restomatic.router.use("/api/v1/data/update", Restomatic.controllers.api.v1.data.update);
  Restomatic.router.use("/api/v1/data/delete", Restomatic.controllers.api.v1.data.delete);

  Restomatic.router.use("/static", require("express").static(__dirname + "/src/static"));
  Restomatic.router.use("/template", async function(request, response, next) {
    try {
      console.log()
      const filepath = __dirname + "/src/template" + request.path;
      console.log("Looking for: " + filepath);
      const filecontent = await require("fs").promises.readFile(filepath, "utf8");
      const rendered = await require("ejs").render(filecontent, { request, response }, { async: true });
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
  
  if(typeof Restomatic.parameters.routesCallback === "function") {
    Restomatic.parameters.routesCallback();
  }

}

// @file[22] = src/main/011.add-rest-models.js

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
  for(let modelId in foundModels) {
    const modelMetadata = foundModels[modelId];
    Restomatic.utils.assertAs(`Model «${modelId}» must be an object`).that(typeof modelMetadata === 'object');
    Restomatic.parameters.schema[modelId] = modelMetadata;
    try {
      const createTableSql = Restomatic.utils.buildSqlCreateTable(modelId, modelMetadata);
      const result = Restomatic.utils.executeSql(createTableSql);
    } catch (error) {
      console.log(error);
    }
    
  }

}

// @file[23] = src/main/900.start-server.js

// Start server
Start_server: {

  Restomatic.server.listen(Restomatic.parameters.port, function() {
    console.log(`[*] Restomatic server started at port: ${Restomatic.parameters.port}`);
  });

}

// @file[24] = src/main/999.test.js

console.log(Object.keys(Restomatic));

(async function() {

  return;
  
  Test_insert: {
    const res = await fetch("http://127.0.0.1:9090/api/v1/data/insert", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        into: "lote",
        values: [{
          nombre: null,
        }]
      })
    });
    console.log(await res.json());
  }

})();

