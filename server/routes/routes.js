const express = require('express'),
    multer = require('multer'),
    path = require('path'),
    fs = require('fs')

const router = express.Router()

//middleware
const diskstorage = multer.diskStorage({
    destination: path.join(__dirname, '../images'),
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-monkeywit-' + file.originalname)
    }
})

const fileUpload = multer({
    storage: diskstorage
}).single('image')


//routes
router.get('/', (req, res) => {
    res.send('Welcome to my image crud')
})

router.post('/images/post', fileUpload, (req, res) => {

    req.getConnection((err, conn) => {
        if(err) return res.status(500).send(err)

        const type = req.file.mimetype,
            name = req.file.originalname,
            data = fs.readFileSync(path.join(__dirname, '../images/' + req.file.filename))

        conn.query('INSERT INTO image SET ?', [{type, name, data}], (err, rows) => {
            if(err) return res.status(500).send(err)

            res.send('Image saved')
        })
    })    
})

router.get('/images/get', (req, res) => {

    req.getConnection((err, conn) => {
        if(err) return res.status(500).send(err)

        conn.query('SELECT * FROM image', (err, rows) => {
            if(err) return res.status(500).send(err)

            rows.map(img => {
                fs.writeFileSync(path.join(__dirname, '../dbimages/' + img.id + '-monkeywit.png'), img.data)
            })

            const imagedir = fs.readdirSync(path.join(__dirname, '../dbimages/'))
            
            res.json(imagedir)
        })
    })    
})

router.delete('/images/delete/:id', (req, res) => {

    req.getConnection((err, conn) => {
        if(err) return res.status(500).send(err)

        conn.query('DELETE FROM image WHERE id = ?', [req.params.id], (err, rows) => {
            if(err) return res.status(500).send(err)
            
            fs.unlinkSync(path.join(__dirname, '../dbimages/' + req.params.id + '-monkeywit.png'))
            
            res.send('Image deleted')
        })
    })    
})

module.exports = router