import fs from 'fs'
import ResponseError from '../../modules/Error'
import models from '../../database/models'
import { EMPTY_ARRAY } from '../../constants/ConstType'
import { STATUS_VERMIN } from '../../constants/Vermin'
import PengusulanService from '../../controllers/Pengusulan/service'
import MasterTematikService from '../../controllers/MasterTematik/service'
import ProOutputService from '../../controllers/ProOutput/service'
import ProSubOutputService from '../../controllers/ProSubOutput/service'
import MailSmtp from '../../helpers/MailSmtp'

const { 
  Vermin, 
  Vertek,
  Usulan, 
  Sasaran, 
  UsulanLokasi, 
  UsulanPerumahan, 
  KomponenPengajuan,
  Dokumen,
  Tematik, 
} = models

class VerminService {
  static async findOneByUsulanId(usulanId) {
    const data = await Vermin.findOne({
      where: {
        UsulanId: usulanId,
      },
    })
    if (!data) throw new ResponseError.NotFound('Vermin tidak ditemukan')
    return data
  }

  static async update(id, body, accessTokenInternal) {
    let {
      ditRususVerminId,
      UsulanId,
      status,
      keterangan,
      suratPermohonan,
      proposal,
      fcSertifikatTanah,
      suratPermohonanKet,
      proposalKet,
      fcSertifikatTanahKet,
      statusTanah,
      statusTanahKet,
      luasTanah,
      catatan,
      KroId,
      RoId,
      anggaran,
      uraian,
      TematikIds,
    } = body

    if (!UsulanId) throw new ResponseError.BadRequest('Usulan ID belum diisi')

    const usulan = await Usulan.findByPk(UsulanId)
    if (!usulan) throw new ResponseError.NotFound('Usulan tidak ditemukan')

    let condition = null

    if (ditRususVerminId) {
      condition = { where: { ditRususVerminId } }
    } else {
      condition = { where: { id } }
    }

    const vermin = await Vermin.findOne(condition)
    if (!vermin) throw new ResponseError.NotFound('Vermin tidak ditemukan')

    if (TematikIds) {
      await Tematik.destroy({
        where: {
          UsulanId,
        },
      })

      for (const MasterTematikId of TematikIds) {
        const MasterTematik = await MasterTematikService.getById(
          MasterTematikId,
          accessTokenInternal
        )

        await Tematik.create({
          MasterTematikId,
          UsulanId,
          MasterTematik,
        })
      }
    }

    await vermin.update({
      status,
      keterangan,
      suratPermohonan,
      proposal,
      fcSertifikatTanah,
      suratPermohonanKet,
      proposalKet,
      fcSertifikatTanahKet,
      statusTanah,
      statusTanahKet,
      luasTanah,
      catatan,
      UsulanId,
    })

    let statusTerkirim = usulan.statusTerkirim
    
    switch (status) {
      // case STATUS_VERMIN.SESUAI:
      //   statusTerkirim = 'terkirim'
      //   break;
      case STATUS_VERMIN.TIDAK_LENGKAP:
        statusTerkirim = 'revisi'
        break;
    }

    if (!KroId) KroId = null
    if (!RoId) RoId = null

    let ProOutput = null
    let ProSubOutput = null

    if (KroId) {
      ProOutput = await ProOutputService.getById(KroId, accessTokenInternal)
    }

    if (RoId) {
      ProSubOutput = await ProSubOutputService.getById(RoId,accessTokenInternal)
    }

    await usulan.update({
      anggaran,
      KroId,
      ProOutput,
      RoId,
      ProSubOutput,
      uraian,
      statusVermin: status,
      statusVerminId: vermin.id,
      statusVerminUpdatedAt: vermin.updatedAt,
      // updatedBy: user.id,
      statusTerkirim,
    })

    if (status == STATUS_VERMIN.SESUAI) {
      const safeUsulan = (await Usulan.findByPk(usulan.id)).get({ plain: true })
      delete safeUsulan.id
      
      const safeVermins = (await Vermin.findAll({
        where: { UsulanId: usulan.id }, 
      })).map((record) => record.get({ plain: true }))

      const safeVerteks = (await Vertek.findAll({
        where: { UsulanId: usulan.id }, 
      })).map((record) => record.get({ plain: true }))

      const safeSasarans = (await Sasaran.findAll({
        where: { UsulanId: usulan.id }, 
      })).map((record) => record.get({ plain: true }))

      const safeUsulanLokasis = (await UsulanLokasi.findAll({
        where: { UsulanId: usulan.id }, 
      })).map((record) => record.get({ plain: true }))

      const safeUsulanPerumahans = (await UsulanPerumahan.findAll({
        where: { UsulanId: usulan.id }, 
      })).map((record) => record.get({ plain: true }))

      const safeKomponenPengajuans = (await KomponenPengajuan.findAll({
        where: { UsulanId: usulan.id }, 
      })).map((record) => record.get({ plain: true }))

      const safeTematiks = (await Tematik.findAll({
        where: { UsulanId: usulan.id }, 
      })).map((record) => record.get({ plain: true }))

      const safeDokumens = (await Dokumen.findAll({
        where: { 
          model: 'Vermin',
          ModelId: vermin.id,
        }, 
      })).map((record) => record.get({ plain: true }))
      
      await PengusulanService.cloneUsulan({
        usulan: safeUsulan,
        vermins: safeVermins,
        verteks: safeVerteks,
        sasarans: safeSasarans,
        usulanLokasis: safeUsulanLokasis,
        usulanPerumahans: safeUsulanPerumahans,
        komponenPengajuans: safeKomponenPengajuans,
        tematiks: safeTematiks,
        dokumens: safeDokumens,
      }, accessTokenInternal)

      // usulan.statusTerkirim = 'dipindahkan'
      usulan.statusTerkirim = 'terkirim'
      await usulan.save()
    }
  
    return usulan
  }

  static async notificationEmail({ 
    VerminId,
    ditRususVerminId, 
  }, filePdf) {
    const verminWhere = ditRususVerminId?{ ditRususVerminId }:{ id: VerminId }
    const vermin = await Vermin.findOne({ where: verminWhere })

    if (!vermin) throw new ResponseError.NotFound('Vermin tidak ditemukan')
    
    const {
      status: statusVermin,
      keterangan: keteranganVermin,
      UsulanId,
    } = vermin

    const usulan = await Usulan.findByPk(UsulanId)
    if (!usulan) throw new ResponseError.NotFound('Usulan tidak ditemukan')

    let pengusul = usulan.User
    if (!pengusul) throw new ResponseError.NotFound('Pengusul tidak ditemukan')

    let statusVerminLabel = 'Belum Ditentukan'

    switch (statusVermin) {
      case 1:
        statusVerminLabel = 'Sesuai'
        break 
      case 2:
        statusVerminLabel = 'Tidak Lengkap'
    }

    let html = this.renderTemplateEmail({
      keteranganVermin,
      statusVermin: statusVerminLabel,
    })

    let reqEmail = {
      to: usulan.email ? usulan.email : pengusul.email,
      subject: `Notifikasi Dokumen Vermin`,
      html,
    }

    if (filePdf) {
      const filePdfSource = `${filePdf.destination}${filePdf.filename}`

      const encoding = 'base64'
      const filename = filePdf.filename

      try {
        const content = fs.readFileSync(filePdfSource, { encoding })
        fs.unlinkSync(filePdfSource)

        reqEmail.attachments = [
          {
            encoding,
            filename,
            content,
          },
        ]
      }
      catch {
        throw new ResponseError.BadRequest('File PDF tidak terbaca!')
      }
    }

    await MailSmtp.sendMail(reqEmail)

    const { to, subject } = reqEmail
    return { to, subject }
  }

  static renderTemplateEmail(params) {
    let { statusVermin, keteranganVermin } = params

    if (EMPTY_ARRAY.indexOf(keteranganVermin) !== -1) {
      keteranganVermin = '-'
    }

    let html = `<h2><b>Status vermin: </b>${statusVermin}</h2>`
    html += `<h2><b>Komentar: </b>${keteranganVermin}</h2>`
    html += '<hr />'
    return html
  }
}

export default VerminService
