import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { RpcException } from "@nestjs/microservices";
import { Observable } from "rxjs";
import { ROLES_KEY } from "./roles-auth.decorator";

@Injectable()
export class RolesGuard implements CanActivate { 
    constructor(private jwtService: JwtService,
                private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        try {
            const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
                
                context.getHandler(),
                context.getClass(),
            ])
            if (!requiredRoles) {
                return true;
            }
            const req = context.switchToHttp().getRequest();
            const authHeader = req.headers.authorization;
            
            const bearer = authHeader.split(' ')[0];
            const token = authHeader.split(' ')[1];
            if(bearer !== 'Bearer' || !token) {
                throw new UnauthorizedException({message: 'Пользователь не авторизован'})
            }
            const user = this.jwtService.verify(token, {secret: process.env.JWT_ACCESS_SECRET});
            req.user = user;
            const result = user.payload.roles.some(role => requiredRoles.includes(role.value));
            if(!result) {
                throw new UnauthorizedException({message: 'Нет доступа'})
            }
            return true;
        } catch (e) {
            throw new HttpException('Нет доступа', HttpStatus.BAD_REQUEST)
        }
    }    
}