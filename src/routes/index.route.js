const homeRouter = require('./home.route')
const userRouter = require('./user.route')
function route(app) {
  app.use("/", homeRouter);
  app.use('/user', userRouter)
}

module.exports = route;