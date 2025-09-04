Restomatic.controllers.api.v1.filesystem.makeDirectory = async function(request, response) {
  try {
    Restomatic.utils.protectWithAdminToken("api/v1/filesystem/makeDirectory", request.headers.token || request.body?.token || request.query.token || false);
    const dirpath = request.body?.path || request.query.path || false;
    const isValid = dirpath.startsWith("/static") || dirpath.startsWith("/template");
    if(!isValid) {
      throw new Error("Parameter «path» must start with either «/static» or «/template» to be valid to «makeDirectory»");
    }
    const dirpathSanitized = require("path").resolve(__dirname + "/src" + dirpath);
    await require("fs").promises.mkdir(dirpathSanitized);
    return response.success({
      operation: "api/v1/filesystem/makeDirectory",
      output: {
        newDirectory: dirpathSanitized
      }
    });
  } catch (error) {
    return response.fail(error);
  }
};