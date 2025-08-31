// Add rest routes
Add_rest_routes: {

  Restomatic.router.use(require("body-parser").json());
  Restomatic.router.use("/api/v1/data/schema", Restomatic.controllers.api.v1.data.schema);
  Restomatic.router.use("/api/v1/data/select", Restomatic.controllers.api.v1.data.select);
  Restomatic.router.use("/api/v1/data/insert", Restomatic.controllers.api.v1.data.insert);
  Restomatic.router.use("/api/v1/data/update", Restomatic.controllers.api.v1.data.update);
  Restomatic.router.use("/api/v1/data/delete", Restomatic.controllers.api.v1.data.delete);

}