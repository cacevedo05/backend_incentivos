import { ReferencesRepository } from "./reference.repository";
import { OrdersRepository } from "../orders/orders.repository";
import { CreateReferenceDTO, UpdateReferenceDTO } from "./reference.Dto";

export class ReferencesService {
    constructor (private repo = new ReferencesRepository(), private ordersRepo = new OrdersRepository()){}

    async create (data: CreateReferenceDTO){
        const existing = await this.repo.findByRefColSiz(data.reference, data.color, data.size)

        if(existing){
            if(existing.active){
                throw new Error ("La conbinacion referencia, color, talla, ya existe")
            }
            return{
                requiresActivation: true,
                message: "La conbinacion referencia, color, talla ya existe pero esta inactiva",
                referenceId: existing.id
            }
        }
        const reference = await this.repo.create(data)
        return{
            id: reference.id,
            referece: reference.reference,
            color: reference.color,
            size: reference.size,
            standard_time: reference.standard_time 
        }
    }

    async findAll(){
        return await this.repo.findAll()
    }

    async update (id: string, data: UpdateReferenceDTO){
        const reference = await this.repo.findById(id)

        if (!reference){
            throw new Error ("No se encontro la referencia")
        }
        if (!reference.active){
            throw new Error ("La referencia esta inactiva")
        }
        return this.repo.update(id, data);
    }

    async delete (id: string){
        const reference = await this.repo.findById(id)
        const orders = await this.ordersRepo.findByReferenceId(id)
        
        if (orders.length > 0){
            throw new Error("No se puede eliminar una referencia con ordenes de produccion activas")
        }

        if (!reference){
            throw new Error("No se encontro la referencia")
        }
        if (!reference.active){
            throw new Error("La referencia ya se encuentra eliminada")
        }

        await this.repo.delete(id)
        return{message: "Referencia eliminada correctamente"}
    }

    async activate (id: string ){
        const reference = await this.repo.findById(id)

        if (!reference){
            throw new Error("No se encontro la referencia")
        }
        if (reference.active){
            throw new Error("La referencia esta activa")
        }

        await this.repo.activate(id)
        return {message: "Referencia activada correctamente"}
    }
}