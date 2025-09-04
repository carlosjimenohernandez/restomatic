Restomatic.controllers.api.v1.filesystem.isFile = async function(request, response) {
  try {
    Restomatic.utils.protectWithAdminToken("api/v1/filesystem/isFile", request.headers.token || request.body?.token || request.query.token || false);
    const filepath = request.body?.path || request.query.path || false;
    const isValid = filepath.startsWith("/static") || filepath.startsWith("/template");
    if(!isValid) {
      throw new Error("Parameter «path» must start with either «/static» or «/template» to be valid to «isFile»");
    }
    const filepathSanitized = require("path").resolve(__dirname + "/src" + filepath);
    const stats = await require("fs").promises.lstat(filepathSanitized);
    return response.success({
      operation: "api/v1/filesystem/isFile",
      output: {
        path: filepath,
        isFile: stats.isFile()
      },
    });
  } catch (error) {
    return response.fail(error);
  }
};