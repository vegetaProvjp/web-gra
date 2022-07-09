const homeRouter = require('./home.route')
const userRouter = require('./user.route')
const productRouter = require('./product.route')
const adminRouter = require('./admin.route')
function route(app) {
  app.use("/", homeRouter);
  app.use('/user', userRouter)
  app.use('/product', productRouter)
  app.use('/admin', adminRouter)
}

module.exports = route;