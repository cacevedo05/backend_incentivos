import { Request, Response } from "express";
import { WorkLogsService } from "./work-logs.service";
import { workLogsRepository } from "./work-logs.repository";

const service = new WorkLogsService(new workLogsRepository())

export const createWorkLog = async (req: Request, res: Response)=> {
    try{
        const data = req.body;
        const result = await service.create(data);
        res.json(result);
    } catch (error: any){
        res.status(400).json({
            message: error.message || "Error al crear el registro de trabajo"
        })
    }
}

export const updateWorLog = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const data = req.body;
        const result = await service.update(id, data);
        res.json (result);
    }catch (error: any){
        res.status(400).json({
            message: error.message || "Error al actualizar el registro de trabajo"
        })
    }
}

export const getAllWorkLogs = async (req: Request, res: Response)=>{
    try {
        const result = await service.findAll();
        res.json(result);
    }catch (error: any){
        res.status(400).json({
            message: error.message || "Error al obtener los registros de trabajo"
        })
    }
}

export const deleteWorkLog = async (req: Request, res: Response)=>{
    try {
        const id = req.params.id;
        const result = await service.delete(id);
        res.json(result);
    }catch (error: any){
        res.status(400).json({
            message: error.message || "Error al eliminar el registro de trabajo"
        })
    }
}