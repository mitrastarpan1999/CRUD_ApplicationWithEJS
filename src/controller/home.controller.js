class homeController {
    async home(req, res) {
        return res.render('home', {
            title: 'CRUD application'
        })
    }
}


module.exports = new homeController()