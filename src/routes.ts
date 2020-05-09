import { Router } from 'express';

import auth from './app/middlewares/auth';
import UserController from './app/controllers/UserController';
import SessionController from "./app/controllers/SessionController";

const routes = Router();

routes.get('/', (req, res) => {
  return res.status(200).json({ message: "Zeus is ok!" })
});
routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(auth);

routes.get('/users', UserController.index);

export default routes;
