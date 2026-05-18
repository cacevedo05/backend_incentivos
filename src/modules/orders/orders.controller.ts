import { Request, Response } from "express";
import { OrdersService } from "./orders.service";
import { OrdersRepository } from "./orders.repository";

const service = new OrdersService(new OrdersRepository());

export const CreateOrder = async (req: Request, res: Response)=>{
    try{
        const result = await service.create(req.body);
        res.status(201).json(result);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

export const GetOrders = async (req: Request, res: Response)=>{
    try{
        const result = await service.findAll();
        res.status(200).json(result);
    }
    catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

export const UpdateOrder = async (req: Request, res: Response)=>{
    try{
        const { id } = req.params;
        const result = await service.update(id, req.body);
        res.status(200).json(result);
    }
    catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

export const DeleteOrder = async (req: Request, res: Response)=>{
    try{
        const { id } = req.params;
        const result = await service.delete(id);
        res.status(200).json(result);
    }
    catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}