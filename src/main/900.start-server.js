// Start server
Start_server: {

  Restomatic.server.listen(Restomatic.parameters.port, function() {
    console.log(`[*] Restomatic server started at:`);
    console.log(`  - http://127.0.0.1:${Restomatic.parameters.port}`);
  });

}