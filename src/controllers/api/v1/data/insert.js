Restomatic.controllers.api.v1.data.insert = async function(request, response) {
  try {
    Restomatic.utils.protectWithAdminToken("api/v1/data/insert", request.headers.token || request.body?.token || request.query.token || false);
    const into = request.body?.into || request.query.into || false;
    const values = request.body?.values || request.query.values || false;
    const sanitizedInsert = Restomatic.utils.buildSqlInsert({
      into,
      values,
    });
    const output = Restomatic.utils.executeSql(sanitizedInsert);
    return response.success({
      operation: "api/v1/data/insert",
      output,
    });
  } catch (error) {
    return response.fail(error);
  }
};