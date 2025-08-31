Restomatic.controllers.api.v1.data.update = async function(request, response) {
  try {
    const set = request.body?.set || request.query.set || false;
    const from = request.body?.from || request.query.from || false;
    const where = request.body?.where || request.query.where || false;
    const sanitizedUpdate = Restomatic.utils.buildSqlUpdate({
      from,
      set,
      where,
    });
    const output = Restomatic.utils.executeSql(sanitizedUpdate);
    return response.success({
      operation: "api/v1/data/update",
      output,
    });
  } catch (error) {
    return response.fail(error);
  }
};