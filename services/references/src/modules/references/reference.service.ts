import { ReferencesRepository } from './reference.repository'
import { createServiceClient } from '@incentivos/shared'
import { CreateReferenceDTO, UpdateReferenceDTO } from './reference.dto'

const ordersClient = createServiceClient('orders')

export class ReferencesService {
  constructor(private repo = new ReferencesRepository()) {}

  async create(data: CreateReferenceDTO) {
    const existing = await this.repo.findByRefColSiz(data.reference, data.color, data.size)
    if (existing) {
      if (existing.active) throw new Error('La combinacion referencia, color, talla, ya existe')
      return { requiresActivation: true, message: 'La combinacion referencia, color, talla ya existe pero esta inactiva', referenceId: existing.id }
    }
    const reference = await this.repo.create(data)
    return { id: reference.id, reference: reference.reference, color: reference.color, size: reference.size, standard_time: reference.standard_time }
  }

  async findAll() { return await this.repo.findAll() }

  async update(id: string, data: UpdateReferenceDTO) {
    const reference = await this.repo.findById(id)
    if (!reference) throw new Error('No se encontro la referencia')
    if (!reference.active) throw new Error('La referencia esta inactiva')
    return this.repo.update(id, data)
  }

  async delete(id: string) {
    const reference = await this.repo.findById(id)
    if (!reference) throw new Error('No se encontro la referencia')
    if (!reference.active) throw new Error('La referencia ya se encuentra eliminada')

    try {
      const orders = await ordersClient.get(`/api/orders?reference_id=${id}`)
      if (Array.isArray(orders) && orders.length > 0) {
        throw new Error('No se puede eliminar una referencia con ordenes de produccion activas')
      }
    } catch (err: any) {
      if (err.message?.includes('ordenes de produccion')) throw err
    }

    await this.repo.delete(id)
    return { message: 'Referencia eliminada correctamente' }
  }

  async activate(id: string) {
    const reference = await this.repo.findById(id)
    if (!reference) throw new Error('No se encontro la referencia')
    if (reference.active) throw new Error('La referencia esta activa')
    await this.repo.activate(id)
    return { message: 'Referencia activada correctamente' }
  }
}
