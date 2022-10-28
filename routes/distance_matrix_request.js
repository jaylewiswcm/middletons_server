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
  
  // Get user postcode from params
  const userPostcode = req.params.postcode
  // Assign data to new array to modify
  const storesWithDistance = [...store_data];
  

  storesWithDistance.map((store, index) => {
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?destinations=${store.postal}&origins=${userPostcode}&units=imperial&key=${process.env.GOOGLE_API_KEY}`
   
    var config = {
      method: 'get',
      url: url,
      headers: { }
    };
  
      axios(config)
      .then(function (response) {
        const data = JSON.stringify(response.data.rows[0].elements[0].distance.text)

        const distance = parseInt(data.split(' ')[0].split('"')[1])
        
        store.distance = distance

        if(index === (storesWithDistance.length - 1)) {
          storesWithDistance.sort(function(a, b) { 
            return a.distance - b.distance  ||  a.name.localeCompare(b.name);
          });  

          storesWithDistance[0].closest = true;
          console.log(storesWithDistance);
          res.json(storesWithDistance)
        }

        return storesWithDistance;       
      })
      .catch(function (error) {
        console.log(error);
      });
  })


})


module.exports = router