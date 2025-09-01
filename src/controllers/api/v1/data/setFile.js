(function () {

  const multer = require("multer");
  const uploadsDirectory = __dirname + "/src/static/uploads/";
  const storage = multer.diskStorage({
    destination: function (req, file, done) {
      done(null, uploadsDirectory);
    },
    filename: function (req, file, done) {
      const datePart = Restomatic.utils.formatDate(new Date());
      const randomPart = Restomatic.utils.getRandomString(10);
      const extensionPart = require("path").extname(file.originalname);
      done(null, datePart + "." + randomPart + extensionPart);
    }
  });
  const controller = multer({
    storage,
    fileFilter: function(request, file, done) {
      try {
        Restomatic.utils.protectWithAdminToken("setFile", request.headers.token || request.body?.token || request.query.token || false);
        done(null, true);
      } catch (error) {
        done(error, false);
      }
    }
  });

  Restomatic.controllers.api.v1.data.setFile = [
    controller.single("file"),
    function (request, response) {
      response.success({
        operation: "/api/v1/data/setFile",
        output: {
          file: request.file,
        }
      });
    }
  ];

})();