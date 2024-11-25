import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class SwaggerAuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];

    // Check if Authorization header exists
    if (!authHeader || !authHeader.startsWith('Basic ')) {
      res.setHeader('WWW-Authenticate', 'Basic realm="Swagger"'); // Trigger browser prompt
      return res.status(401).send('Authentication required.');
    }

    // Decode credentials
    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString(
      'ascii',
    );
    const [username, password] = credentials.split(':');

    const validPassword = process.env.SWAGGER_PASSWORD || 'securePassword';
    if (username !== 'swagger' || password !== validPassword) {
      res.setHeader('WWW-Authenticate', 'Basic realm="Swagger"');
      return res.status(401).send('Invalid credentials.');
    }

    next();
  }
}
