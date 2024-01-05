import Joi from "joi";

const userSchemaValidation = Joi.object({
  fullName: Joi.string()
    .min(4)
    .max(55)
    .message("The full name is required to create the account")
    .required(),

  username: Joi.string()
    .min(3)
    .max(25)
    .pattern(/^[A-Za-z0-9@_]+$/)
    .message(
      "The username is required and can only contain letters, numbers, '@', and '_'"
    )
    .required(),

  email: Joi.string().email().message("Email type is not correct").required(),

  password: Joi.string()
    .required()
    .min(4)
    .max(12)
    .message("Password must be between 4 and 12 characters"),
});

export { userSchemaValidation };
