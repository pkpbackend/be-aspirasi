import { col, fn, literal } from 'sequelize'
import models from '../../database/models'
import _ from 'lodash'

const { Usulan } = models

class FilterService {
  static async getTahunUsulan() {
    try {
      const allTahunUsulan = await Usulan.findAll({
        attributes: ['tahunProposal'],
        group: ['tahunProposal'],
        order: literal('tahunProposal DESC'),
      })
      let tahunUsulan = []
      allTahunUsulan.forEach((tah) => {
        if (
          tah.dataValues.tahunProposal != null &&
          tah.dataValues.tahunProposal != '' &&
          tah.dataValues.tahunProposal != 0
        )
          tahunUsulan.push(Number(tah.dataValues.tahunProposal))
      })

      const allTahunPSU = await Usulan.findAll({
        attributes: ['tahunBantuanPsu'],
        group: ['tahunBantuanPsu'],
        order: literal('tahunBantuanPsu DESC'),
      })
      allTahunPSU.forEach((tah) => {
        if (
          tah.dataValues.tahunBantuanPsu != null &&
          tah.dataValues.tahunBantuanPsu != '' &&
          tah.dataValues.tahunBantuanPsu != 0
        ) {
          if (!_.includes(tahunUsulan, Number(tah.dataValues.tahunBantuanPsu))) {
            tahunUsulan.push(Number(tah.dataValues.tahunBantuanPsu))
          }
        }
      })
      tahunUsulan = _.sortBy(tahunUsulan)

      const allTahunSurat = await Usulan.findAll({
        attributes: [[fn('year', col('tglSurat')), 'tahun']],
        group: ['tahun'],
        order: literal('tahun DESC'),
      })
      const tahunSurat = []
      allTahunSurat.forEach((tah) => {
        if (
          tah.dataValues.tahun != null &&
          tah.dataValues.tahun != '' &&
          tah.dataValues.tahun != 0
        ) {
          tahunSurat.push(Number(tah.dataValues.tahun))
        }
      })

      return { tahunUsulan, tahunSurat }
    } catch (err) {
      let message = ''
      if (err.message) {
        message = err.message
      } else {
        message = err
      }
      throw new Error(message)
    }
  }
}

export default FilterService
