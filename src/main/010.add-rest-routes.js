// Add rest routes
Add_rest_routes: {

  Restomatic.router.use(require("body-parser").json());
  Restomatic.router.use("/api/v1/data/schema", Restomatic.controllers.api.v1.data.schema);
  Restomatic.router.use("/api/v1/data/select", Restomatic.controllers.api.v1.data.select);
  Restomatic.router.use("/api/v1/data/insert", Restomatic.controllers.api.v1.data.insert);
  Restomatic.router.use("/api/v1/data/update", Restomatic.controllers.api.v1.data.update);
  Restomatic.router.use("/api/v1/data/delete", Restomatic.controllers.api.v1.data.delete);

  Restomatic.router.use("/api/v1/data/createTable", Restomatic.controllers.api.v1.data.createTable);
  Restomatic.router.use("/api/v1/data/createColumn", Restomatic.controllers.api.v1.data.createColumn);
  Restomatic.router.use("/api/v1/data/removeTable", Restomatic.controllers.api.v1.data.removeTable);
  Restomatic.router.use("/api/v1/data/removeColumn", Restomatic.controllers.api.v1.data.removeColumn);
  Restomatic.router.use("/api/v1/data/listFiles", Restomatic.controllers.api.v1.data.listFiles);
  Restomatic.router.post("/api/v1/data/setFile", Restomatic.controllers.api.v1.data.setFile);
  
  Restomatic.router.use("/api/v1/filesystem/readDirectory", Restomatic.controllers.api.v1.filesystem.readDirectory);
  Restomatic.router.use("/api/v1/filesystem/makeDirectory", Restomatic.controllers.api.v1.filesystem.makeDirectory);
  Restomatic.router.use("/api/v1/filesystem/deleteDirectory", Restomatic.controllers.api.v1.filesystem.deleteDirectory);
  Restomatic.router.use("/api/v1/filesystem/readFile", Restomatic.controllers.api.v1.filesystem.readFile);
  Restomatic.router.use("/api/v1/filesystem/writeFile", Restomatic.controllers.api.v1.filesystem.writeFile);
  Restomatic.router.use("/api/v1/filesystem/deleteFile", Restomatic.controllers.api.v1.filesystem.deleteFile);
  Restomatic.router.use("/api/v1/filesystem/isFile", Restomatic.controllers.api.v1.filesystem.isFile);

  // Inject routes to override other routes:
  if(typeof Restomatic.parameters.routesCallback === "function") {
    Restomatic.parameters.routesCallback();
  }

  Restomatic.router.use("/static", require("express").static(__dirname + "/src/static"));
  Restomatic.router.use("/template", async function(request, response, next) {
    try {
      console.log()
      const filepath = __dirname + "/src/template" + request.path;
      const filecontent = await require("fs").promises.readFile(filepath, "utf8");
      const rendered = await require("ejs").render(filecontent, {
        Restomatic,
        request,
        response
      }, { async: true });
      return response.send(rendered);
    } catch (error) {
      console.log(error);
      if (error.code === "ENOENT") {
        return next();
      } else {
        console.log(error);
        return response.fail(error);
      }
    }
  });


}