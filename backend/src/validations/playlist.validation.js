import Joi from "joi";

const playlistSchemaValidation = Joi.object({
  name: Joi.string()
    .min(1)
    .allow("")
    .max(70)
    .pattern(/^[A-Za-z0-9@_!? -]+$/)
    .message(
      "Title is required to publish the video. It should only contain alphanumeric characters and some special characters."
    )
    .trim()
    .optional(),
  description: Joi.string()
    .max(1000)
    .allow("")
    .trim()
    .message("Description is required to publish the video")
    .optional(),
});

export { playlistSchemaValidation };
