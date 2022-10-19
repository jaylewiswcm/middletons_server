const express = require('express');
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

app.use(logger);

app.use('/postcode', distance_checker)

app.get('/test', (req, res) => {
    res.json({ ok: 'true' })
})

app.listen(PORT, () => console.log(`Server is now lsitening to post ${PORT}`))
