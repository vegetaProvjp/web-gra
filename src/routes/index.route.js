const homeRouter = require('./home.route')
const userRouter = require('./user.route')
const productRouter = require('./product.route')
const adminRouter = require('./admin.route')
const { isUser, isAdmin, isSuperAdmin } = require('../middleware/roleAuth')

function route(app) {
  app.use("/", homeRouter);
  app.use('/user', userRouter)
  app.use('/product', productRouter)
  app.use('/admin', isUser, isAdmin, adminRouter)
}

module.exports = route;