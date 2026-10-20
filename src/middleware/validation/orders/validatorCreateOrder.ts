import { Request, Response, NextFunction } from 'express';
import validator from 'validator';

import { CustomError } from 'utils/response/custom-error/CustomError';
import { ErrorValidation } from 'utils/response/custom-error/types';

export const validatorCreateOrder = (req: Request, res: Response, next: NextFunction) => {
  let { description } = req.body;
  const { price, clientId } = req.body;
  const errorsValidation: ErrorValidation[] = [];

  description = !description ? '' : String(description);
  const priceStr = price !== undefined && price !== null ? String(price) : '';
  const clientIdStr = clientId !== undefined && clientId !== null ? String(clientId) : '';

  if (validator.isEmpty(description)) {
    errorsValidation.push({ description: 'Description is required' });
  }

  if (validator.isEmpty(priceStr) || !validator.isFloat(priceStr, { gt: 0 })) {
    errorsValidation.push({ price: 'Price must be a number greater than 0' });
  }

  if (validator.isEmpty(clientIdStr) || !validator.isInt(clientIdStr, { min: 1 })) {
    errorsValidation.push({ clientId: 'Valid Client ID is required' });
  }

  if (errorsValidation.length !== 0) {
    const customError = new CustomError(
      400,
      'Validation',
      'Create order validation error',
      null,
      null,
      errorsValidation,
    );
    return next(customError);
  }

  return next();
};
