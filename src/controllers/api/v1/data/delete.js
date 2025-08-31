Restomatic.controllers.api.v1.data.delete = async function(request, response) {
  try {
    Restomatic.utils.protectWithAdminToken("delete", request.body?.token || request.query.token || false);
    const from = request.body?.from || request.query.from || false;
    const where = request.body?.where || request.query.where || false;
    const sanitizedDelete = Restomatic.utils.buildSqlDelete({
      from,
      where,
    });
    const output = Restomatic.utils.executeSql(sanitizedDelete);
    return response.success({
      operation: "api/v1/data/delete",
      output,
    });
  } catch (error) {
    return response.fail(error);
  }
};