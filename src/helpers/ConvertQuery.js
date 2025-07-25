import { Op } from 'sequelize'

function convertQueryFilter(filtered) {
  let resultObj = {}
  if (typeof filtered !== 'object') {
    throw new Error('Filtered must be an object, expected ' + typeof filtered)
  }

  for (let i = 0; i < filtered.length; i++) {
    let { id, value } = filtered[i]
    if (id.split('.').length > 1) {
      id = `$${id}$`
    }
    if (value === 'null') {
      resultObj[id] = { [Op.eq]: null }
    } else if (Array.isArray(value)) {
      resultObj[id] = { [Op.in]: value }
    } else if (value.hasOwnProperty('type')) {
      resultObj[id] = { [Op.ne]: value.value }
    } else {
      resultObj[id] = { [Op.like]: `%${value}%` }
    }
  }

  return resultObj
}

function convertQueryCondition(condition) {
  let resultObj = {}
  if (typeof condition !== 'object') {
    throw new Error('Condition must be an object, expected ' + typeof condition)
  }

  for (let i = 0; i < condition.length; i++) {
    let { id, value } = condition[i]
    if (id.split('.').length > 1) {
      id = `$${id}$`
    }
    if (value === 'null') {
      resultObj[id] = { $eq: null }
    } else {
      resultObj[id] = value
    }
  }

  return resultObj
}

export { convertQueryFilter, convertQueryCondition }
