Restomatic.controllers.api.v1.filesystem.writeFile = async function(request, response) {
  try {
    Restomatic.utils.protectWithAdminToken("api/v1/filesystem/writeFile", request.headers.token || request.body?.token || request.query.token || false);
    const filepath = request.body?.path || request.query.path || false;
    const isValid = filepath.startsWith("/static") || filepath.startsWith("/template");
    if(!isValid) {
      throw new Error("Parameter «path» must start with either «/static» or «/template» to be valid to «writeFile»");
    }
    const content = request.body?.content || request.query.content || false;
    const filepathSanitized = require("path").resolve(__dirname + "/src" + filepath);
    await require("fs").promises.writeFile(filepathSanitized, content, "utf8");
    return response.success({
      operation: "api/v1/filesystem/writeFile",
      output: {
        file: filepathSanitized,
        written: true,
      },
    });
  } catch (error) {
    return response.fail(error);
  }
};