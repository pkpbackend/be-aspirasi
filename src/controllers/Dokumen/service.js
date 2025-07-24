import fs from 'fs'
import { uploadFileToS3 } from '../../helpers/s3Helper'
import ResponseError from '../../modules/Error'
import models from '../../database/models'
import MasterDokumenService from '../../controllers/MasterDokumen/service'

const { Dokumen, Usulan, Vermin } = models

class DokumenService {
  static async findAll({ model, ModelId }) {
    if (!model || !ModelId)
      throw new ResponseError.BadRequest('Model wajib diisi')
    const data = await Dokumen.findAll({
      where: {
        model,
        ModelId,
      },
    })
    return data
  }

  static async create({
    model,
    ModelId,
    UsulanId,
    MasterDokumenId,
    keterangan,
    lengkap,
    status,
    file,
  }, accessTokenInternal) {
    if (!model) {
      throw new ResponseError.NotFound('Model belum diisi')
    }

    if (!ModelId) {
      throw new ResponseError.NotFound('Model ID belum diisi')
    }

    if (!UsulanId) {
      throw new ResponseError.NotFound('Usulan ID belum diisi')
    }
    
    if (!MasterDokumenId) {
      throw new ResponseError.NotFound('Master Dokumen ID belum diisi')
    }

    const usulan = await Usulan.findByPk(UsulanId)

    if (!usulan) {
      throw new ResponseError.NotFound('Usulan tidak ditemukan')
    }

    const vermin = await Vermin.findOne({
      where: {
        UsulanId,
      },
    })

    if (!vermin) {
      throw new ResponseError.NotFound('Vermin tidak ditemukan')
    }

    const masterDokumen = await MasterDokumenService.getById(
      MasterDokumenId, 
      accessTokenInternal
    )

    if (!masterDokumen) {
      throw new ResponseError.NotFound('Master Dokumen tidak ditemukan')
    }

    const { maxSize, typeFile, ditRusunField } = masterDokumen

    let data = {
      model,
      ModelId,
      MasterDokumenId,
      keterangan,
      lengkap,
      status,
      MasterDokumen: masterDokumen,
    }

    if (file) {
      // const limitFile = maxSize * 1024 * 1024

      // if (file.size > limitFile) {
      //   throw new ResponseError.NotFound('Ukuran File terlalu besar')
      // }

      const fileSource = `${file.destination}${file.filename}`
      const fileName = file.filename

      let s3url 
      const s3key = `aspirasi/${UsulanId}/${fileName}`

      try {
        s3url = await uploadFileToS3(fileSource, s3key)
        fs.unlinkSync(fileSource)
      }
      catch {
        throw new ResponseError.BadRequest('Upload File gagal!')
      }

      data = {
        ...data,
        file: s3url,
      }
    }

    const dokumen = await Dokumen.create(data)
    return dokumen
  }

  static async update(id, {
    model,
    ModelId,
    UsulanId,
    MasterDokumenId,
    keterangan,
    lengkap,
    status,
    file,
  }, accessTokenInternal) {
    const dokumen = await Dokumen.findByPk(id)

    if (!dokumen) {
      throw new ResponseError.NotFound('Dokumen tidak ditemukan')
    }

    if (!UsulanId) {
      throw new ResponseError.NotFound('Usulan ID belum diisi')
    }
    
    if (!MasterDokumenId) {
      throw new ResponseError.NotFound('Master Dokumen ID belum diisi')
    }

    const usulan = await Usulan.findByPk(UsulanId)

    if (!usulan) {
      throw new ResponseError.NotFound('Usulan tidak ditemukan')
    }

    const vermin = await Vermin.findOne({
      where: {
        UsulanId,
      },
    })

    if (!vermin) {
      throw new ResponseError.NotFound('Vermin tidak ditemukan')
    }

    const masterDokumen = await MasterDokumenService.getById(
      MasterDokumenId, 
      accessTokenInternal
    )

    if (!masterDokumen) {
      throw new ResponseError.NotFound('Master Dokumen tidak ditemukan')
    }

    const { maxSize, typeFile, ditRusunField } = masterDokumen

    let data = {
      model,
      ModelId,
      MasterDokumenId,
      keterangan,
      lengkap,
      status,
      MasterDokumen: masterDokumen,
    }

    if (file) {
      // const limitFile = maxSize * 1024 * 1024

      // if (file.size > limitFile) {
      //   throw new ResponseError.NotFound('Ukuran File terlalu besar')
      // }

      const fileSource = `${file.destination}${file.filename}`
      const fileName = file.filename

      let s3url 
      const s3key = `aspirasi/${UsulanId}/${fileName}`

      try {
        s3url = await uploadFileToS3(fileSource, s3key)
        fs.unlinkSync(fileSource)
      }
      catch {
        throw new ResponseError.BadRequest('Upload File gagal!')
      }

      data = {
        ...data,
        file: s3url,
      }
    }

    await dokumen.update(data)

    return dokumen
  }

  static async delete(id) {
    const dokumen = await Dokumen.findByPk(id)
    if (!dokumen) throw new ResponseError.NotFound('Dokumen tidak ditemukan')
    await dokumen.destroy()
  }

}

export default DokumenService
