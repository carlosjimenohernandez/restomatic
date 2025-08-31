Restomatic.controllers.api.v1.data.schema = function(request, response) {
  try {
    // @TODO...
    return response.success({
      operation: "api/v1/data/schema",
      output: Restomatic.parameters.schema,
    });
  } catch (error) {
    return response.fail(error);
  }
};