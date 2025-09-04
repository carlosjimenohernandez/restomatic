Restomatic.controllers.api.v1.filesystem.readDirectory = async function(request, response) {
  try {
    Restomatic.utils.protectWithAdminToken("api/v1/filesystem/readDirectory", request.headers.token || request.body?.token || request.query.token || false);
    const dirpath = request.body?.path || request.query.path || false;
    const isValid = dirpath.startsWith("/static") || dirpath.startsWith("/template");
    if(!isValid) {
      throw new Error("Parameter «path» must start with either «/static» or «/template» to be valid to «readDirectory»");
    }
    const dirpathSanitized = require("path").resolve(__dirname + "/src" + dirpath);
    const output = await require("fs").promises.readdir(dirpathSanitized);
    return response.success({
      operation: "api/v1/filesystem/readDirectory",
      output,
    });
  } catch (error) {
    return response.fail(error);
  }
};