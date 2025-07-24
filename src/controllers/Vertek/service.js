import fs from 'fs'
import { uploadFileToS3 } from "../../helpers/s3Helper"
import ResponseError from '../../modules/Error'
import models from '../../database/models'

const { Vertek, Usulan } = models

class VertekService {
  static async findBySasaranId(SasaranId) {
    const data = await Vertek.findOne({
      where: {
        SasaranId,
      },
    })
    return data
  }

  static async updateDokumenLapangan(id, {
    type,
    dokumenName,
  }, dokumenLapangan) {
    const vertekWhere = (type == 'usulan')?{ UsulanId: id }:{ SasaranId: id }

    let vertek = await Vertek.findOne({
      where: vertekWhere,
    })

    let dokumenLapanganS3

    if (dokumenLapangan) {
      const dokumenLapanganSource = `${dokumenLapangan.destination}${dokumenLapangan.filename}`
      const dokumenLapanganName = dokumenLapangan.filename

      let s3url 
      const s3key = `aspirasi/${(vertek)?vertek.UsulanId:id}/${dokumenLapanganName}`

      try {
        s3url = await uploadFileToS3(dokumenLapanganSource, s3key)
        fs.unlinkSync(dokumenLapanganSource)
      }
      catch {
        throw new ResponseError.BadRequest('Upload Dokumen Vertek gagal!')
      }

      dokumenLapanganS3 = s3url
    }

    let data = {}
    data[dokumenName] = dokumenLapanganS3

    if (vertek) {
      await vertek.update(data)
    } else {
      vertek = await Vertek.create(data)
    }

    return vertek
  }

  static async update(id, { 
    UsulanId, 
    SasaranId,
    type, 
    keterangan,
    namaPupr,
    jabatanPupr,
    nipPupr,
    telponPupr,
    namaSnvt,
    jabatanSnvt,
    nipSnvt,
    telponSnvt,
    namaPejKabKota,
    jabatanPejKabKota,
    nipPejKabKota,
    telponPejKabKota,
    tglSurvei,
    surveyor,
    proposalAsli,
    legalitasLahan,
    sesuaiRTRW,
    sesuaiMasterPlan,
    kondisi,
    perkerasanJalan,
    sumberListrik,
    sumberAir,
    jarakKepusatKegiatan,
    kondisiTanah,
    kelayakanTeknis,
    namaLokasiDetail,
    titikKoordinat,
    peruntukan,
    tglVertek,
    statusLahan,
    rtrw,
    luasLahan,
    kondisiLahan,
    kondisiJalanAkses,
    jauhLahanDariJalanUtama,
    sumberAirBersih,
    sumberPenerbanganDanJarakGardu,
    aksesSaluranPembuangan,
    groundJarak,
    sitePlant,
    jenisTanah,
    tipologiPermukaanTanah,
    rawanBencana,
    catatan,
    status,
  }) {
    if (!UsulanId) throw new ResponseError.NotFound('Usulan ID belum diisi')

    const usulan = await Usulan.findByPk(UsulanId)
    if (!usulan) throw new ResponseError.NotFound('Usulan tidak ditemukan')

    const vertekWhere = (type == 'vertekrusun')?{ id }:{ SasaranId: id }

    let vertek = await Vertek.findOne({
      where: vertekWhere,
    })

    const data = {
      UsulanId, 
      SasaranId,
      type, 
      keterangan,
      namaPupr,
      jabatanPupr,
      nipPupr,
      telponPupr,
      namaSnvt,
      jabatanSnvt,
      nipSnvt,
      telponSnvt,
      namaPejKabKota,
      jabatanPejKabKota,
      nipPejKabKota,
      telponPejKabKota,
      tglSurvei,
      surveyor,
      proposalAsli,
      legalitasLahan,
      sesuaiRTRW,
      sesuaiMasterPlan,
      kondisi,
      perkerasanJalan,
      sumberListrik,
      sumberAir,
      jarakKepusatKegiatan,
      kondisiTanah,
      kelayakanTeknis,
      namaLokasiDetail,
      titikKoordinat,
      peruntukan,
      tglVertek,
      statusLahan,
      rtrw,
      luasLahan,
      kondisiLahan,
      kondisiJalanAkses,
      jauhLahanDariJalanUtama,
      sumberAirBersih,
      sumberPenerbanganDanJarakGardu,
      aksesSaluranPembuangan,
      groundJarak,
      sitePlant,
      jenisTanah,
      tipologiPermukaanTanah,
      rawanBencana,
      catatan,
      status,
    }

    if (vertek) {
      await vertek.update(data)
    } else {
      vertek = await Vertek.create(data)
    }

    let vertekSasarans = await Vertek.findAll({
      where: {
        UsulanId,
      },
    })

    const statusVerteks = vertekSasarans.map(({ status }) => status)
    const statusVertek = statusVerteks.includes(1)?1:status

    await usulan.update({
      statusVertek,
      statusVertekId: vertek.id,
      statusVertekUpdatedAt: vertek.updatedAt,
    })

    return vertek
  }
}

export default VertekService
