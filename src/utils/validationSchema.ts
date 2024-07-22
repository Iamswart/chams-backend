import { Joi } from "celebrate";

export const registerAccountSchema = Joi.object({
  email: Joi.string().trim().email().lowercase().required(),
  phone: Joi.string()
    .trim()
    .pattern(/^[0-9]{11,}$/)
    .required()
    .min(7)
    .max(12),
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])/)
    .message(
      '"password" must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),
});

export const loginSchema = Joi.object().keys({
  email: Joi.string().trim().email().lowercase(),
  phone: Joi.string()
    .trim()
    .pattern(/^[0-9]{11,}$/)
    .min(7)
    .max(12),
  password: Joi.string().required(),
});

export const cartItemSchema = Joi.object({
  items: Joi.array().items(
    Joi.object({
      type: Joi.string().valid('airtime', 'data').required(),
      productId: Joi.string().optional(),
      amount: Joi.number().positive().required(),
      operator: Joi.string().required(),
      email: Joi.string().email().required(),
      phone: Joi.string().required(),
      dataPlan: Joi.string().optional()
    })
  ).required()
});

export const operatorSchema = Joi.object({
  operator: Joi.string().valid("mtn", "glo", "airtel", "9mobile").insensitive().required()
});