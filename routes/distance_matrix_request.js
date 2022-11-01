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
  // Assign store data to new array in order to modify
  const storesWithDistance = [...store_data];
  
  // Loop through the store data
  storesWithDistance.map(async (store, index) => {

    store.distance = 0;

    // API URL taking in current store postcode, user's postcode and api key
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?destinations=${store.postal}&origins=${userPostcode}&units=imperial&key=${process.env.GOOGLE_API_KEY}`
   
    // Axios config object
    var config = {
      method: 'get',
      url: url,
      headers: { }
    };

    const response = await axios(config)
    const data = await response.data.rows[0].elements[0].distance.text;
    const distance = parseInt(data.split(' '))
    

    store.distance = distance;
    store.closest = false;
    store.checked = true;

    storesWithDistance.sort(function(a, b) { 
      return a.distance - b.distance  ||  a.id.localeCompare(b.id);
    });  

    
    if(storesWithDistance[0].distance !== 0) {
      storesWithDistance[0].closest = true;
      res.json(storesWithDistance)
    }

    console.log(storesWithDistance);

    return store;
  
      // Initialise axios get request
      // axios(config)
      // .then(function (response) {
      //   // Assign and format response data 
      //   const data = JSON.stringify(response.data.rows[0].elements[0].distance.text)
      //   // Find the distance value
      //   const distance = parseInt(data.split(' ')[0].split('"')[1])
        
      //   store.distance = distance

      //   console.log(store);
      //   console.log(index);
        
      //   if(index === 16) {
      //     console.log(storesWithDistance);

      //   }
        
        // if(index === (storesWithDistance.length - 1)) {
        //   storesWithDistance.sort(function(a, b) { 
        //     return a.distance - b.distance  ||  a.id.localeCompare(b.id);
        //   });  

        //   storesWithDistance.map(store => store.closest = false);
        //   storesWithDistance[0].closest = true;
        //   console.log(storesWithDistance);
        //   // res.json(storesWithDistance)
        // }

      //   return storesWithDistance;       
      // })
      // .catch(function (error) {
      //   console.log(error);
      // });
    
  })
  
})


module.exports = router