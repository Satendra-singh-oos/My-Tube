import Joi from "joi";

const userSchemaValidation = Joi.object({
  fullName: Joi.string()
    .min(4)
    .max(55)
    .message("The full name is required to create the account")
    .trim()
    .required(),

  username: Joi.string()
    .min(3)
    .max(25)
    .pattern(/^[A-Za-z0-9@_]+$/)
    .message(
      "The username is required and can only contain letters, numbers, '@', and '_'"
    )
    .trim()
    .required(),

  email: Joi.string().email().message("Email type is not correct").required(),

  password: Joi.string()
    .pattern(/^[A-Za-z0-9@]+$/)
    .trim()
    .required()
    .min(4)
    .max(12)
    .message(
      "Password must be between 4 and 12 characters and a special charater is allowed"
    ),
});

const loginValidation = Joi.object({
  username: Joi.string()
    .min(3)
    .max(25)
    .pattern(/^[A-Za-z0-9@_]+$/)
    .message(
      "The username is required and can only contain letters, numbers, '@', and '_'"
    )
    .optional(),

  email: Joi.string().email().message("Email type is not correct").optional(),

  password: Joi.string()
    .required()
    .min(4)
    .max(12)
    .message("Password must be between 4 and 12 characters"),
});

const updateUserDetailsValidation = Joi.object({
  fullName: Joi.string()
    .min(4)
    .max(55)
    .message("The full name is required to create the account")
    .optional(),

  email: Joi.string().email().message("Email type is not correct").optional(),
});

export { userSchemaValidation, loginValidation, updateUserDetailsValidation };
