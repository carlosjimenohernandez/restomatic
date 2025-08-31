Restomatic.controllers.api.v1.data.select = async function(request, response) {
  try {
    const fields = request.body?.fields || request.query.fields || false;
    const from = request.body?.from || request.query.from || false;
    const where = request.body?.where || request.query.where || false;
    const order = request.body?.order || request.query.order || false;
    const page = request.body?.page || request.query.page || 1;
    const items = request.body?.items || request.query.items || 100;
    const sanitizedSelect = Restomatic.utils.buildSqlSelect({
      fields,
      from,
      where,
      order,
      page,
      items,
    });
    const output = Restomatic.utils.executeSql(sanitizedSelect);
    return response.success({
      operation: "api/v1/data/select",
      output,
    });
  } catch (error) {
    return response.fail(error);
  }
};