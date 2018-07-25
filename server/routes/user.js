const {
  controller,
  get,
  post,
  put,
  auth,
  required,
  admin
} = require('../lib/decorator')
const {
  checkPassword,
  adminMovieList
} = require('../service/user')

@controller('/admin')
export class userController {
  @post('/login')
  @required({
    body: ['email', 'password', 'abc']
  })
  async login (ctx, next) {
    const { email, password } = ctx.request.body
    const matchData = await checkPassword(email, password)
    console.log(matchData)
    if (!matchData.user) {
      return (ctx.body = {
        success: false,
        err: '用户不存在'
      })
    }

    if (matchData.match) {
      ctx.session.user = {
        _id: matchData.user._id,
        eamil: matchData.user.email,
        role: matchData.user.role,
        username: matchData.user.username
      }
      return (ctx.body = {
        success: true,
        data: true
      })
    }

    return (ctx.body = {
      success: false,
      err: '密码不正确'
    })
  }

  @get('/movie/list')
  @auth
  async getList (ctx, next) {
    const movieData = await adminMovieList()
    // if (movieData.length <= 0 ) return
    console.log(movieData.length)
    return (ctx.body = {
      success: true,
      data: movieData
    })
  }

}