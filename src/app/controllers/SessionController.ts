import { Request, Response } from "express";
import jwt from 'jsonwebtoken';

import { secret, expiresIn } from '../../config/jwt'
import { User } from '../models/User'
import AppError from "../errors/AppError";

class SessionController {
  async store(req: Request, res: Response) {
    let { email, username, password } = req.body;
    const user = await User.findOne({ where: [{ email }, { username }] });

    if(!user) {
      throw new AppError({ message: "User does not exist.", statusCode: 401 });
    }

    if (!(await user.checkpassword(password))) {
      throw new AppError({ message: "Incorrect Password.", statusCode: 401 });
    }

    const { id } = user;
    username = username ?? user.username;
    email = email ?? user.email;

    return res.json({
      user: {
        id,
        email,
        username
      },
      token: jwt.sign({ id }, secret, { expiresIn })
    });
  }
}

export default new SessionController();
