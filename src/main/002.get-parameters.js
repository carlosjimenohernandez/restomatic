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