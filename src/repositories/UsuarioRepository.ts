import bcrypt from 'bcryptjs'
import { Types, UpdateQuery } from 'mongoose'

import Usuario, { UsuarioAttributes } from '../database/models/Usuario'
import BaseRepository from './BaseRepository'

export default class UsuarioRepository extends BaseRepository<UsuarioAttributes> {
  public constructor() {
    super(Usuario)
  }

  // ===============================
  // CREATE
  // ===============================
  public async create(body: Record<string, any>): Promise<UsuarioAttributes> {
    if (body.password) {
      body.password = await this.encryptPassword(body.password)
    }
    return this.model.create(body)
  }

  // ===============================
  // AUTH
  // ===============================
  public async getAuthByCarnet(
    carnet: string,
  ): Promise<UsuarioAttributes | null> {
    return this.model
      .findOne({ carnet: carnet.trim() })
      .select('+password')
      .exec()
  }

  public async comparePassword(
    password: string,
    receivedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, receivedPassword)
  }

  // ===============================
  // PASSWORD
  // ===============================
  public async updatePasswordByUsuarioId(
    userId: string | Types.ObjectId,
    data: UpdateQuery<UsuarioAttributes>,
  ) {
    if (data.password) {
      data.password = await this.encryptPassword(data.password)
    }

    return this.model
      .findByIdAndUpdate(userId, data, { new: true })
      .exec()
  }

  // ===============================
  // PRIVATE
  // ===============================
  private async encryptPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10)
    return bcrypt.hash(password, salt)
  }
}
