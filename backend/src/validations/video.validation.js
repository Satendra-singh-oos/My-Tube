import Joi from "joi";

const videoSchemaValidation = Joi.object({
  title: Joi.string()
    .min(1)
    .allow("")
    .max(70)
    .pattern(/^[A-Za-z0-9@_!? -]+$/)
    .message(
      "Title is required to publish the video. It should only contain alphanumeric characters and some special characters."
    )
    .optional(),
  description: Joi.string()
    .max(1000)
    .allow("")
    .message("Description is required to publish the video")
    .optional(),
});

export { videoSchemaValidation };
