interface IRequest {
  message: string;
  statusCode: number;
}

class AppError {
  public readonly message: string;

  public readonly statusCode: number;

  constructor({ message, statusCode }: IRequest) {
    this.message = message;
    this.statusCode = statusCode;
  }
}

export default AppError;
