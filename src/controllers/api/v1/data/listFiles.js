Restomatic.controllers.api.v1.data.listFiles = async function(request, response) {
  const files = await require("fs").promises.readdir(__dirname + "/src/static/uploads/");
  return response.success({
    output: files
  });
};