import { Model, Types } from 'mongoose'

export default abstract class BaseRepository<T> {
  protected model: Model<T>

  constructor(model: Model<T>) {
    this.model = model
  }

  public async getAll(): Promise<T[]> {
    return this.model.find().exec()
  }

  public async getById(
    id: string | Types.ObjectId,
  ): Promise<T | null> {
    return this.model.findById(id).exec()
  }

  // ✅ AQUÍ ESTÁ EL CAMBIO CLAVE
  public async create(data: Partial<T>): Promise<T> {
    const doc = new this.model(data)
    return doc.save() as Promise<T>
  }

  public async updateById(
    id: string | Types.ObjectId,
    data: Partial<T>,
  ): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, data, { new: true }).exec()
  }

  public async deleteById(
    id: string | Types.ObjectId,
  ): Promise<T | null> {
    return this.model.findByIdAndDelete(id).exec()
  }
}
