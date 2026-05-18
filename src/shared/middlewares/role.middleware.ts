import { Request, Response, NextFunction } from "express";

export const roleMiddleware = (...rolesAlowed: string[])=>{
    return (req: Request, res: Response, next: NextFunction)=>{
        const user = (req as any).user;
        if(!user){
            return res.status(401).json({message: "No autorizado"});
        }
        if(user.role === "ADMIN"){
            return next();
        }
        if(!rolesAlowed.includes(user.role)){
            return res.status(403).json({message: "Acceso denegado"});
        }
        next();
    } 
}
