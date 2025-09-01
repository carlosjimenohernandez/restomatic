Restomatic.controllers.api.v1.data.removeColumn = async function(request, response) {
  try {
    Restomatic.utils.protectWithAdminToken("removeColumn", request.headers.token || request.body?.token || request.query.token || false);
    const table = request.body?.table || request.query.table || false;
    const column = request.body?.column || request.query.column || false;
    const sanitizedRemoveColumn = Restomatic.utils.buildSqlRemoveColumn(table, column);
    const output = Restomatic.utils.executeSql(sanitizedRemoveColumn);
    return response.success({
      operation: "api/v1/data/removeColumn",
      output,
    });
  } catch (error) {
    return response.fail(error);
  }
};