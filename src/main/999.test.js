console.log(Object.keys(Restomatic));

(async function() {

  return;
  
  Test_insert: {
    const res = await fetch("http://127.0.0.1:9090/api/v1/data/insert", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        into: "lote",
        values: [{
          nombre: null,
        }]
      })
    });
    console.log(await res.json());
  }

})();