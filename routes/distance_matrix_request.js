const express = require('express')
const axios = require('axios');
// Store data
var store_data = require('../data/locations.json');

const router = express.Router()

// middleware that is specific to this router
router.use((req, res, next) => {
  console.log('Time: ', Date.now())
  next()
})

router.get('/:postcode', (req, res) => {
  
  const userPostcode = req.params.postcode
  
  console.log(userPostcode);

  const storesWithDistance = [...store_data];
  
  storesWithDistance.map(store => {
   
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?destinations=${store.postal}&origins=${userPostcode}&units=imperial&key=${process.env.GOOGLE_API_KEY}`
   
    var config = {
      method: 'get',
      url: url,
      headers: { }
    };
  
      axios(config)
      .then(function (response) {
        const data = JSON.stringify(response.data.rows[0].elements[0].distance.text)

        console.log(data);
      
        const distance = parseInt(data.split(' ')[0].split('"')[1])
        
        store.distance = distance

        return storesWithDistance;       
      })
      .catch(function (error) {
        console.log(error);
      });
  })

  storesWithDistance.sort(function(a, b) { 
    return a.distance - b.distance  ||  a.name.localeCompare(b.name);
  });  

  res.json(storesWithDistance)
})


module.exports = router