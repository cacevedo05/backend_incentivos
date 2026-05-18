import { ProductionRepository } from "./production.repository";
import { CreateProductionDTO, CreateProductionFinishDTO, UpdateProductionDTO, UpdateProductionFinishDTO } from "./production.Dto";
import { OrdersRepository } from "../orders/orders.repository";
import { ReferencesRepository } from "../references/reference.repository";

export class ProductionService {
    constructor(private repo = new ProductionRepository(), private repoOrders = new OrdersRepository(), private repoRefe = new ReferencesRepository) {}


    async create (data: CreateProductionDTO){
        const order = await this.repoOrders.findById(data.order_id);
        if(!order){
            throw new Error ("La orden no existe")
        }
        if(order.status === "CANCELADA"){
            throw new Error ("Esta orden fue cancelada, no se pude registrar producción")
        }
        if(order.status === "CERRADA"){
            throw new Error ("Esta orden ya fue completada, no se puede registrar más producción")
        }
        if(data.units > order.quantity_pending){
            throw new Error ("Las unidades producidad no puden superar las unidades pendientes")
        }

        const reference = await this.repoRefe.findById(order.reference_id); 

        if (!reference) {
            throw new Error ("La referencia no existe")
        }

        const productionData : CreateProductionFinishDTO = {
            order_id: data.order_id,
            reference_id: order.reference_id,
            units: data.units,
            module: order.module,
            standard_time: reference.standard_time,
            total_time: data.units * reference.standard_time
        }

        console.log(productionData)

        const production = await this.repo.create(productionData);

        const newPending = order.quantity_pending - data.units;

        await this.repoOrders.updatePendingAndStatus(order.id, newPending);

        return {
            id: production.id,
            order_id: production.order_id,
            reference_id: production.reference_id,
            module: production.module,
            units: production.units,
            standar_time: production.standard_time,
            total_time: production.total_time,
        }

    }
    async findAll(){
        return await this.repo.findAll();
    }
    async update(id: string, data: UpdateProductionDTO) {

        const production = await this.repo.findById(id);
        if (!production) {
            throw new Error("No se ha encontrado el registro de producción");
        }

        if (data.units === undefined) {
            throw new Error("Las unidades son obligatorias para actualizar el registro de producción");
        }

        const lastProduction = await this.repo.lastProductionByOrderId(production.order_id)

        if (!lastProduction || lastProduction.id !== production.id) {
            throw new Error("Solo se puede actualizar el ultimo registro de produccion de una orden")
        }
        const order = await this.repoOrders.findById(production.order_id);
        if (!order) {
            throw new Error("No se encontró la orden de producción");
        }

        const newUnits = data.units;
        const oldUnits = production.units;


        if (newUnits > order.quantity_pending + oldUnits) {
            throw new Error("No puedes exceder las unidades disponibles");
        }

        const diff = newUnits - oldUnits;
        const updateData: UpdateProductionFinishDTO= {
            units: newUnits,
            total_time: newUnits * production.standard_time
        }
        const updated = await this.repo.update(id, updateData);

        const newPending = order.quantity_pending - diff;

        await this.repoOrders.updatePendingAndStatus(order.id,newPending);

        return updated;
    }

    async delete (id: string){
        const production = await this.repo.findById(id);
        if (!production){
            throw new Error ("No se ha encontrado el registro de produccion")
        }
        const today = new Date();
        const createdAt = new Date(production.created_at);
        const isToday =
            createdAt.getFullYear() === today.getFullYear() &&
            createdAt.getMonth() === today.getMonth() &&
            createdAt.getDate() === today.getDate();

        if (!isToday){
            throw new Error ("Solo se pueden eliminar registros de produccion del dia de hoy")
        }
        const order = await this.repoOrders.findById(production.order_id);
        if (!order){
            throw new Error ("No se encontro la orden de produccion")
        }
        await this.repo.delete(id);
        const newPending = order.quantity_pending + production.units;
        await this.repoOrders.updatePendingAndStatus(order.id,newPending);
        return {message: "Registro de producción eliminado exitosamente"}
    }
}
