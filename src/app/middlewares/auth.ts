import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

import AppError from '../errors/AppError';
import { secret } from '../../config/jwt';
import { User } from '../models/User';

interface IToken {
  iat: number;
  exp: number;
  sub: string;
}

export default async (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;
  if (!authorization) {
    throw new AppError({ message: "Token not provided.", statusCode: 401 });
  }

  const [, token] = authorization.split(' ');

  try {
    const { sub } = verify(token, secret) as IToken;

    req.user = await User.findOneOrFail(sub);

    next();
  } catch (e) {
    throw new AppError({ message: "Token invalid.", statusCode: 401 });
  }
}
