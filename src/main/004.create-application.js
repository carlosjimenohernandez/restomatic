// Create application
Create_application: {

  Extend_express_prototypes: {
    require("express").response.success = function (data) {
      this.type("json");
      this.status(200).send({
        ok: true,
        data
      });
    };
    require("express").response.fail = function (error, status = 400) {
      this.type("json");
      this.status(status).send({
        ok: false,
        error: error.name + ": " + error.message
      });
    };
  }

  const express = require("express");
  const app = express();
  const router = new express.Router();
  app.use(router);
  Restomatic.application = app;
  Restomatic.router = router;

}