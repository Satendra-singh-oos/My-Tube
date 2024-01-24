import Joi from "joi";

const commentSchemaValidation = Joi.object({
  content: Joi.string()
    .required()
    .min(1)
    .allow(" ")
    .max(500)
    .message(
      "Comment Text is required to publish the comment on the video. It should only contain alphanumeric characters and some special characters."
    ),
});

export { commentSchemaValidation };
