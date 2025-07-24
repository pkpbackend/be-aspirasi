import CommentUsulan from '../../database/models/commentusulan'
import Usulan from '../../database/models/usulan'

class UserService {
  static async syncUser({ userId, data }) {
    await Usulan.update({ User: data }, { where: { UserId: userId } })
    await CommentUsulan.update({ User: data }, { where: { UserId: userId } })
    return {
      message: 'success',
    }
  }
}

export default UserService
