import { ProductionRepository } from './production.repository'
import { createServiceClient } from '@incentivos/shared'
import { CreateProductionDTO, CreateProductionFinishDTO, UpdateProductionDTO, UpdateProductionFinishDTO } from './production.dto'

const ordersClient = createServiceClient('orders')
const referencesClient = createServiceClient('references')

export class ProductionService {
  constructor(private repo = new ProductionRepository()) {}

  async create(data: CreateProductionDTO) {
    const order = await ordersClient.get(`/api/orders?id=${data.order_id}`)
    if (!order || Array.isArray(order) && order.length === 0) {
      throw new Error('La orden no existe')
    }
    const orderData = Array.isArray(order) ? order[0] : order

    if (orderData.status === 'CANCELADA') {
      throw new Error('Esta orden fue cancelada, no se puede registrar produccion')
    }
    if (orderData.status === 'CERRADA') {
      throw new Error('Esta orden ya fue completada, no se puede registrar mas produccion')
    }
    if (data.units > orderData.quantity_pending) {
      throw new Error('Las unidades producidas no pueden superar las unidades pendientes')
    }

    const reference = await referencesClient.get(`/api/references?id=${orderData.reference_id}`)
    const refData = Array.isArray(reference) ? reference[0] : reference
    if (!refData) throw new Error('La referencia no existe')

    const productionData: CreateProductionFinishDTO = {
      order_id: data.order_id,
      reference_id: orderData.reference_id,
      units: data.units,
      module: orderData.module,
      standard_time: refData.standard_time,
      total_time: data.units * refData.standard_time,
    }

    const production = await this.repo.create(productionData)
    const newPending = orderData.quantity_pending - data.units
    await this.repo.updateOrderPending(orderData.id, newPending)

    return {
      id: production.id,
      order_id: production.order_id,
      reference_id: production.reference_id,
      module: production.module,
      units: production.units,
      standard_time: production.standard_time,
      total_time: production.total_time,
    }
  }

  async findAll() { return await this.repo.findAll() }

  async update(id: string, data: UpdateProductionDTO) {
    const production = await this.repo.findById(id)
    if (!production) throw new Error('No se ha encontrado el registro de produccion')
    if (data.units === undefined) throw new Error('Las unidades son obligatorias')

    const lastProduction = await this.repo.lastProductionByOrderId(production.order_id)
    if (!lastProduction || lastProduction.id !== production.id) {
      throw new Error('Solo se puede actualizar el ultimo registro de produccion de una orden')
    }

    const order = await ordersClient.get(`/api/orders?id=${production.order_id}`)
    const orderData = Array.isArray(order) ? order[0] : order
    if (!orderData) throw new Error('No se encontro la orden de produccion')

    const newUnits = data.units
    const oldUnits = production.units

    if (newUnits > orderData.quantity_pending + oldUnits) {
      throw new Error('No puedes exceder las unidades disponibles')
    }

    const diff = newUnits - oldUnits
    const updateData: UpdateProductionFinishDTO = {
      units: newUnits,
      total_time: newUnits * production.standard_time,
    }
    const updated = await this.repo.update(id, updateData)
    const newPending = orderData.quantity_pending - diff
    await this.repo.updateOrderPending(orderData.id, newPending)

    return updated
  }

  async delete(id: string) {
    const production = await this.repo.findById(id)
    if (!production) throw new Error('No se ha encontrado el registro de produccion')

    const today = new Date()
    const createdAt = new Date(production.created_at)
    const isToday =
      createdAt.getFullYear() === today.getFullYear() &&
      createdAt.getMonth() === today.getMonth() &&
      createdAt.getDate() === today.getDate()

    if (!isToday) throw new Error('Solo se pueden eliminar registros de produccion del dia de hoy')

    const order = await ordersClient.get(`/api/orders?id=${production.order_id}`)
    const orderData = Array.isArray(order) ? order[0] : order
    if (!orderData) throw new Error('No se encontro la orden de produccion')

    await this.repo.delete(id)
    const newPending = orderData.quantity_pending + production.units
    await this.repo.updateOrderPending(orderData.id, newPending)

    return { message: 'Registro de produccion eliminado exitosamente' }
  }
}
