import { Request, Response } from "express";
import { ReferencesService } from "./reference.service";
import { ReferencesRepository } from "./reference.repository";

const service = new ReferencesService(new ReferencesRepository())

export const createReference = async (req: Request, res: Response)=>{
    try{
        const result = await service.create(req.body);
        res.status(201).json(result)
    }catch(error: any){
        res.status(400).json({message: error.message})
    }
}

export const getAllReferences = async ( req: Request, res:Response)=>{
    try{
        const result = await service.findAll();
        res.status(201).json(result)
    }catch(error: any){
        res.status(400).json({message: error.message})
    }
}

export const updateReference = async(req: Request, res:Response)=>{
    try{
        const id = req.params.id
        const result = await service.update(id, req.body)
        res.status(201).json(result)
    }catch (error: any){
        res.status(400).json({message: error.message})
    }
}

export const deleteReference = async (req: Request, res:Response)=>{
    try{
        const result = await service.delete(req.params.id)
        res.status (201).json(result)
    }catch(error: any){
        res.status(400).json({message: error.message})
    }
}

export const activeReference = async (req: Request, res:Response)=>{
    try{
        const result = await service.activate(req.params.id);
        res.status(201).json(result)
    }catch(error: any){
        res.status(400).json({message: error.message})
    }
}