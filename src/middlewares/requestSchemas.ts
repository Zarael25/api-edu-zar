import Joi from 'joi'

// ===============================
// AUTH / LOGIN SCHEMA
// ===============================
export const authSchema = Joi.object({
  carnet: Joi.string()
    .min(5)
    .max(15)
    .required(),

  password: Joi.string()
    .min(8)
    .max(50)
    .pattern(/[A-Z]/, 'una mayúscula')
    .pattern(/[a-z]/, 'una minúscula')
    .pattern(/[0-9]/, 'un número')
    .pattern(/[!@#$%&*_.-]/, 'un símbolo')
    .required(),
})
