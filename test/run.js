(async function () {

  const fs = require("fs");
  // const FormData = require("form-data");
  const form = new FormData();
  const fileBuffer = fs.readFileSync(__dirname + "/example.txt");
  
  form.append("file", new Blob([fileBuffer]), "example.txt");
  
  const r = await fetch("http://127.0.0.1:9090/api/v1/data/setFile", {
    method: "POST",
    body: form,
    headers: {
      token: "admin"
    }
  });

  const response = await r.text();

  console.log(response);

})();