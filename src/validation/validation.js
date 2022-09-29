const joi = require("joi");

//New user
const validateNewUser = (user) => {
  const schema = joi.object({
    id: joi.number(),
    email: joi.string().email().required(),
    firstname: joi.string().min(2).max(128).required(),
    lastname: joi.string().min(2).max(128).required(),
    usertype: joi.string(),
  });
  return schema.validate(user);
};

module.exports.validateNewUser = validateNewUser;
