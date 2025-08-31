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

  if (!Restomatic.parameters.database) {
    Restomatic.parameters.database = "default.sqlite";
  }

  if (!Restomatic.parameters.port) {
    Restomatic.parameters.port = "9090";
  }

  if (!Restomatic.parameters.models) {
    Restomatic.parameters.models = require("path").resolve(process.cwd(), "models.js");
  }

  if (!Restomatic.parameters.routes) {
    Restomatic.parameters.routes = require("path").resolve(process.cwd(), "routes.js");
  }

}