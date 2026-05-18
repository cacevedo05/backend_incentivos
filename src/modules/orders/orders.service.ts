import { OrdersRepository } from "./orders.repository";
import { ProductionRepository } from "../production/production.repository";
import { CreateOrderDTO, UpdateOrderDTO } from "./orders.Dto";

export class OrdersService {
    constructor(private repo = new OrdersRepository(), private productionRepo = new ProductionRepository()){}

    async create(data: CreateOrderDTO){
    const modules = await this.repo.modules();


    if (!modules.includes(data.module)){
        throw new Error(`El modulo ${data.module} no existe`);
    }
    data.quantity_pending = data.quantity;
    const order = await this.repo.create(data);
    return {
        id: order.id,
        reference_id: order.reference_id,
        quantity: order.quantity,
        quantity_pending: order.quantity_pending,
        module: order.module,
        status: order.status
    }
}
    async findAll(){
        return await this.repo.findAll();
    }
    async update(id: string, data: UpdateOrderDTO){
        // falta validar cauntas unidades se han producido
        const findByOrderId = await this.productionRepo.findByOrderId(id);
        const totalProduced = findByOrderId.reduce((acc, record) => acc + record.units, 0);
        if (data.quantity !== undefined && data.quantity < totalProduced){
            throw new Error(`La cantidad no puede ser menor a las unidades ya producidas (${totalProduced})`);
        }
        const order = await this.repo.findById(id);
        if(!order){
            throw new Error("No se encontro la orden de produccion")
        }
        if (order.status === "CANCELADA"){
            throw new Error ("Esta orden esta eliminada")
        }
        return this.repo.update(id, data)
    }
    async delete (id: string){
        const order = await this.repo.findById(id);
        const production = await this.productionRepo.lastProductionByOrderId(id);
        if (production){
            throw new Error("No se puede eliminar una orden con produccion registrada")
        }
        if(!order){
            throw new Error("No se encontro la orden de produccion")
        }
        if (order.status === "CANCELADA"){
            throw new Error ("Ya esta orden fue cancelada")
        }
        await this.repo.delete(id)
        return {message: "Orden cancelada exitosamente"}
    }
}
