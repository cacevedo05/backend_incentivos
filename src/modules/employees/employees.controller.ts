import { Request, Response } from "express";
import { EmployeesService } from "./employees.service";
import { EmployeesRepository } from "./employees.repository";

const service = new EmployeesService(new EmployeesRepository());

export const createEmployees = async (req: Request, res: Response)=>{
    try{
        const result = await service.create(req.body);
        res.status(201).json(result);
    }catch (error: any){
        res.status(400).json({message: error.message})
    }
}

export const getAllEmployees = async (req: Request, res: Response) => {
    try{
        const result = await service.findAll();
        res.status(200).json(result);
    }
    catch (error: any){
        res.status(400).json({message: error.message})
    }
}

export const updateEmployees = async (req: Request, res: Response) => {
    try{
        const id = parseInt (req.params.id)
        const result = await service.update(id, req.body);
        res.json(result);
    }catch(error: any){
        res.status(400).json({message: error.message})
    }
}

export const delteEmployees = async (req: Request, res: Response) => {
    try{
        const id = parseInt (req.params.id)
        const result = await service.delete(id);
        res.json(result);
    }catch(error: any){
        res.status(400).json({message: error.message})
    }
}

export const activateEmployees = async (req: Request, res: Response)=>{
    try{
        const id = parseInt (req.params.id)
        const result = await service.activate(id);
        res.json(result);
    }catch(error: any){
        res.status(400).json({message: error.message})
    }
}