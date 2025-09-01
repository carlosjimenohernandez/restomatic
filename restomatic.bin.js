Extract_process_parameters: {

  let lastArgument = "_";

  const parameters = process.argv.reduce(function (output, arg) {
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
  if (!parameters.database) {
    parameters.database = "default.sqlite";
  }

  // Parameter port:
  if (!parameters.port) {
    parameters.port = "9090";
  }

  // Parameter models:
  if (!parameters.models) {
    parameters.models = require("path").resolve(process.cwd(), "models.js");
  }

  // Parameter routes:
  if (!parameters.routes) {
    parameters.routes = require("path").resolve(process.cwd(), "routes.js");
  } else {
    parameters.routes = require("path").resolve(process.cwd(), parameters.routes);
  }

  // Parameter routesCallback:
  if (parameters.routes) {
    try {
      parameters.routesCallback = require(parameters.routes);
    } catch (error) {
      if (error.message.startsWith("Cannot find module")) {
        parameters.routesCallback = function() {
          console.log(`[WARN] Routes will not be loaded because file «${parameters.routes}» was not found`);
        };
      } else {
        parameters.routesCallback = function() {
          console.log("[ERROR] Routes will not be loaded due to: ", error);
        };
      }
    }
  }

  // Parameter token:
  if (!parameters.token) {
    parameters.token = false;
  }

  require(__dirname + "/restomatic.js").create(parameters);

}