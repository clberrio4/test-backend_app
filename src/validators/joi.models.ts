import * as Joi from 'joi';

export interface IValidator {
  name: string;
  model: Joi.Schema;
}

export const validators: IValidator[] = [
  {
    name: 'signup',
    model: Joi.object().keys({
      name: Joi.string().min(3).max(60).required(),
      email: Joi.string().email(),
      password: Joi.string().regex(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{5,}$/,
        {
          name:
            'Minimum five characters, at least one letter, one number and one special character:',
        }
      ),
    }),
  },
  {
    name: 'login',
    model: Joi.object().keys({
      email: Joi.string().email(),
      password: Joi.string().required(),
    }),
  },
  {
    name: 'updateUser',
    model: Joi.object().keys({
      email: Joi.string().email(),
      name: Joi.string().max(100),
    }),
  },
];
