import { Request, Response } from "express";
import { UserService } from "./users.service";
import { UserRepository } from "./users.repository";

const service = new UserService(new UserRepository());

export const createUser = async (req: Request, res: Response) =>{
    try {
        const result = await service.create(req.body);
        res.status(201).json(result);
    }catch (error: any){
        res.status(400).json({message: error.message});
    }
}

export const getAllUsers = async (req: Request, res: Response) =>{
    try {
        const result = await service.findAll();
        res.json(result);
    }catch (error: any){
        res.status(400).json({message: error.message});
    }
};

export const updateUser = async (req: Request, res: Response) =>{
    try {
        const id = parseInt(req.params.id);
        const result = await service.update(id, req.body);
        res.json(result);
    }catch (error: any){
        res.status(400).json({message: error.message});
    }
};

export const deleteUser = async (req: Request, res: Response) =>{
    try {
        const id = parseInt(req.params.id);
        const result = await service.delete(id);
        res.json(result);
    }catch (error: any){
        res.status(400).json({message: error.message});
    }
};

export const changePassword = async (req: Request, res: Response) =>{
    try {
        const id = parseInt(req.params.id);
        const result = await service.changePassword(id, req.body);
        res.json(result);
    }catch (error: any){
        res.status(400).json({message: error.message});
    }
};

export const activeUser = async (req: Request, res: Response) =>{
    try {
        const id = parseInt(req.params.id);
        const result = await service.active(id);
        res.json(result);
    }catch (error: any){
        res.status(400).json({message: error.message});
    }
}
