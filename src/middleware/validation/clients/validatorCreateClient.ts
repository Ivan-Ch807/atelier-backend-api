import { Request, Response, NextFunction } from 'express';
import validator from 'validator';

import { CustomError } from 'utils/response/custom-error/CustomError';
import { ErrorValidation } from 'utils/response/custom-error/types';

export const validatorCreateClient = (req: Request, res: Response, next: NextFunction) => {
  let { fullName, phone, email } = req.body;
  const errorsValidation: ErrorValidation[] = [];

  fullName = !fullName ? '' : String(fullName);
  phone = !phone ? '' : String(phone);
  email = !email ? '' : String(email);

  if (validator.isEmpty(fullName)) {
    errorsValidation.push({ fullName: 'Full name is required' });
  }

  if (validator.isEmpty(phone)) {
    errorsValidation.push({ phone: 'Phone number is required' });
  }

  if (!validator.isEmpty(email) && !validator.isEmail(email)) {
    errorsValidation.push({ email: 'Email is invalid' });
  }

  if (errorsValidation.length !== 0) {
    const customError = new CustomError(
      400,
      'Validation',
      'Create client validation error',
      null,
      null,
      errorsValidation,
    );
    return next(customError);
  }

  return next();
};
