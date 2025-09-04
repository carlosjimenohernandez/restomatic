Restomatic.controllers.api.v1.filesystem.readFile = async function(request, response) {
  try {
    Restomatic.utils.protectWithAdminToken("api/v1/filesystem/readFile", request.headers.token || request.body?.token || request.query.token || false);
    const filepath = request.body?.path || request.query.path || false;
    const isValid = filepath.startsWith("/static") || filepath.startsWith("/template");
    if(!isValid) {
      throw new Error("Parameter «path» must start with either «/static» or «/template» to be valid to «readFile»");
    }
    const filepathSanitized = require("path").resolve(__dirname + "/src" + filepath);
    const content = await require("fs").promises.readFile(filepathSanitized, "utf8");
    return response.success({
      operation: "api/v1/filesystem/readFile",
      output: {
        file: filepathSanitized,
        content,
      },
    });
  } catch (error) {
    return response.fail(error);
  }
};