Restomatic.controllers.api.v1.filesystem.deleteFile = async function(request, response) {
  try {
    Restomatic.utils.protectWithAdminToken("api/v1/filesystem/deleteFile", request.headers.token || request.body?.token || request.query.token || false);
    const filepath = request.body?.path || request.query.path || false;
    const isValid = filepath.startsWith("/static") || filepath.startsWith("/template");
    if(!isValid) {
      throw new Error("Parameter «path» must start with either «/static» or «/template» to be valid to «deleteFile»");
    }
    const filepathSanitized = require("path").resolve(__dirname + "/src" + filepath);
    await require("fs").promises.unlink(filepathSanitized);
    return response.success({
      operation: "api/v1/filesystem/deleteFile",
      output: {
        deletedFile: filepathSanitized
      },
    });
  } catch (error) {
    return response.fail(error);
  }
};