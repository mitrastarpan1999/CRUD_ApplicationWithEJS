const multer = require('multer');

const FILE_TYPE_MIME = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpeg',
    'image/png': 'png',
    'image/gif': 'gif',
    'image/avif': 'avif'
}


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MIME[file.mimetype]
        let uploadError = new Error('There is an error')
        if(isValid) {
            uploadError = null
        }


        cb(uploadError, 'uploads')
    },

    filename: function (req, file, cb) {
        const fileName = file.originalname.split(' ').join('-');
        const extension = FILE_TYPE_MIME[file.mimetype]

        cb(null, `${fileName}-${Date.now()}.${extension}`)
    }

})


const upload = multer ({storage: storage})

module.exports = upload