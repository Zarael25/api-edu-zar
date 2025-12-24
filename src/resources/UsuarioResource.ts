import { UsuarioAttributes } from '../database/models/Usuario'

export default class UsuarioResource {
  private instance: UsuarioAttributes

  constructor(instance: UsuarioAttributes) {
    this.instance = instance
  }

  /**
   * Transforma el documento Usuario en un objeto seguro
   * listo para ser devuelto por la API
   */
  public item() {
    return {
      id: this.instance._id?.toString() ?? this.instance.id,

      // Datos personales
      email: this.instance.email,
      nombre: this.instance.nombre,
      appaterno: this.instance.appaterno,
      apmaterno: this.instance.apmaterno,
      carnet: this.instance.carnet,
      complemento: this.instance.complemento,
      expedido: this.instance.expedido,
      fechaNacimiento: this.instance.fechaNacimiento,
      avatar: this.instance.avatar,
      genero: this.instance.genero,
      celular: this.instance.celular,
      estado: this.instance.estado,

      // Roles y niveles
      roles: this.instance.roles,
      niveles: this.instance.niveles,

      // Metadatos
      createdAt: this.instance.createdAt,
      updatedAt: this.instance.updatedAt,
    }
  }
}
