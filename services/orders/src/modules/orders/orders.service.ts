import { OrdersRepository } from './orders.repository'
import { createServiceClient } from '@incentivos/shared'
import { CreateOrderDTO, UpdateOrderDTO } from './orders.dto'

const productionClient = createServiceClient('production')

export class OrdersService {
  constructor(private repo = new OrdersRepository()) {}

  async create(data: CreateOrderDTO) {
    const modules = await this.repo.modules()
    if (!modules.includes(data.module)) {
      throw new Error(`El modulo ${data.module} no existe`)
    }
    data.quantity_pending = data.quantity
    const order = await this.repo.create(data)
    return {
      id: order.id,
      reference_id: order.reference_id,
      quantity: order.quantity,
      quantity_pending: order.quantity_pending,
      module: order.module,
      status: order.status,
    }
  }

  async findAll() { return await this.repo.findAll() }

  async update(id: string, data: UpdateOrderDTO) {
    const order = await this.repo.findById(id)
    if (!order) throw new Error('No se encontro la orden de produccion')
    if (order.status === 'CANCELADA') throw new Error('Esta orden esta eliminada')

    if (data.quantity !== undefined) {
      try {
        const records = await productionClient.get(`/api/production?order_id=${id}`)
        const totalProduced = Array.isArray(records)
          ? records.reduce((acc: number, r: any) => acc + r.units, 0)
          : 0
        if (data.quantity < totalProduced) {
          throw new Error(`La cantidad no puede ser menor a las unidades ya producidas (${totalProduced})`)
        }
      } catch (err: any) {
        if (err.message?.includes('unidades ya producidas')) throw err
      }
    }

    return this.repo.update(id, data)
  }

  async delete(id: string) {
    const order = await this.repo.findById(id)
    if (!order) throw new Error('No se encontro la orden de produccion')
    if (order.status === 'CANCELADA') throw new Error('Ya esta orden fue cancelada')

    try {
      const lastProduction = await productionClient.get(`/api/production?order_id=${id}&last=true`)
      if (lastProduction && Object.keys(lastProduction).length > 0) {
        throw new Error('No se puede eliminar una orden con produccion registrada')
      }
    } catch (err: any) {
      if (err.message?.includes('produccion registrada')) throw err
    }

    await this.repo.delete(id)
    return { message: 'Orden cancelada exitosamente' }
  }
}
