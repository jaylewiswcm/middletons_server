const express = require('express');
var cors = require('cors')
// Routes
const distance_checker = require('./routes/distance_matrix_request')

const dotenv = require('dotenv');
dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();

function logger(req,res,next) {
    console.log(`[${Date.now()}] ${req.method} ${req.url}`)
    next();
}

var corsOptions = {
    origin: 'https://middletons.co.uk',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }


app.use(cors(corsOptions))
app.use(logger);

app.use('/postcode', distance_checker)

app.get('/test', (req, res) => {
    res.json({ ok: 'true' })
})

app.listen(PORT, () => console.log(`Server is now lsitening to post ${PORT}`))
