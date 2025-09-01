Restomatic.controllers.api.v1.data.schema = function(request, response) {
  try {
    const schema = Restomatic.utils.getSchema();
    return response.success({
      operation: "api/v1/data/schema",
      output: schema,
    });
  } catch (error) {
    return response.fail(error);
  }
};