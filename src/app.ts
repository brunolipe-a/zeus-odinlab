import 'dotenv/config';

// @ts-ignore
import Youch from 'youch';
import express, { Express, Errback, Response, Request, NextFunction } from 'express';
import 'express-async-errors';
import cors from 'cors';
import { createConnection } from 'typeorm'

import routes from './routes';
import AppError from './app/errors/AppError';

class App {
  public server: Express;

  constructor() {
    this.server = express();

    this.middlewares();
    this.database();
    this.routes();
    this.exceptionHandler();
  }

  middlewares() {
    this.server.use(cors());
    this.server.use(express.json());
  }

  async database() {
    const connection = await createConnection();
    if (connection === undefined) { throw new Error('Error connecting to database'); }
  }

  routes() {
    this.server.use(routes);
  }

  exceptionHandler() {
    this.server.use(async (err: Error, req: Request, res: Response, next: NextFunction) => {
      if (err instanceof AppError) {
        return res.status(err.statusCode).json(
          { status: 'error', message: err.message }
        );
      }

      if (process.env.NODE_ENV === 'development') {
        const errors = await new Youch(err, req).toJSON();
        return res.status(500).json(errors);
      }

      return res.status(500).json({ error: 'Internal server error' });
    });
  }
}

export default new App().server;
