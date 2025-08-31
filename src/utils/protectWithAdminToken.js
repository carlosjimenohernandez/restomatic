Restomatic.utils.protectWithAdminToken = function(operationId, token = false) {
  Restomatic.utils.assertAs(`Operation «${operationId}» requires administration token`).that(typeof token === "string");
  Restomatic.utils.assertAs(`Operation «${operationId}» could not match administration token with provided «${token}»`).that(token === Restomatic.parameters.token);
};