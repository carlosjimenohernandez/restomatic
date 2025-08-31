// Start server
Start_server: {

  Restomatic.server.listen(Restomatic.parameters.port, function() {
    console.log(`[*] Restomatic server started at port: ${Restomatic.parameters.port}`);
  });

}