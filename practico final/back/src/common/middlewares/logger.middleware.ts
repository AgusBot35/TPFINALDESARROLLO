import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction): void {
        const fecha = new Date().toISOString();
        console.log(`[${fecha}]  ${req.method} ${req.originalUrl}`);
        next();
    }
}