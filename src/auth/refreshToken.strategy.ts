import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from 'express';
import { Injectable } from "@nestjs/common";

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_REFRESH_SECRET,
        });
    }

    async validate(req: Request, payload: any) {
        const refreshToken = req.get('Authorization').replace('Bearer', '').trim();
        return { id: payload.sub, address: payload.address, refreshToken  };
    }
}