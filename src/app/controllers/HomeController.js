const Account = require("../models/Account");
const {mongooseToObject} = require('../../util/mongoose')
const userinfo = require("../../util/userinfo");

class HomeController {

    index (req, res) {
        let userID = userinfo(req);
        Account.findById(userID)
        .then((user) =>
          res.render("home", {
            user: mongooseToObject(user),
          })
        )
        .catch((err) => {
          console.log(err);
        });
    }
}

module.exports = new HomeController();
