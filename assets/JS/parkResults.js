<<<<<<< HEAD
const opWeatherKey = "ef52a053126f1ffad0042182f7e8f385";
const npsKey = "9fi4OHLPohhQm2w4RcbNkl8tPu6xMiqljmISBjp6";
const parkUrl = 'https://developer.nps.gov/api/v1/parks?stateCode=CA';
const passUrl = "https://developer.nps.gov/api/v1/feespasses?statecode=CA";
const searchBtn = document.getElementById("searchBtn");
const parkList = document.getElementById("parkList");
const parkDetails = document.getElementById('parkDetails');
const passesList = document.getElementById("passesList");
const cardContainer = document.getElementById("cardContainer");
const refreshBtn = document.getElementById("refreshBtn")
const backToTopBtn = document.getElementById("topBtn")



  document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('.carousel');
    var options = {
      fullWidth: true, // Makes the carousel full width
      indicators: true, // Show slide indicators (optional)
    };
    var instances = M.Carousel.init(elems, options);

    // Auto slide change every 3 seconds
    var interval = setInterval(function () {
      var instance = M.Carousel.getInstance(elems[0]);
      instance.next(); // Move to the next slide
    }, 4000);
  });

 M.AutoInit();


=======
const opWeatherKey = 'ef52a053126f1ffad0042182f7e8f385'
const npsKey = '9fi4OHLPohhQm2w4RcbNkl8tPu6xMiqljmISBjp6'
const parkUrl = 'https://developer.nps.gov/api/v1/parks?stateCode=CA'
const passUrl = 'https://developer.nps.gov/api/v1/feespasses?statecode=CA'
const searchBtn = document.getElementById('searchBtn')
const parkList = document.getElementById('parkList')
const parkDetails = document.getElementById('parkDetails')
const passesList = document.getElementById('passesList')
const cardContainer = document.getElementById('cardContainer')
const refreshBtn = document.getElementById('refreshBtn')
const backToTopBtn = document.getElementById('topBtn')
>>>>>>> 176ddc11eccc1489ba6decc1fb662bff6c9f82ca

document.addEventListener('DOMContentLoaded', function () {
  var elems = document.querySelectorAll('.carousel')
  var options = {
    fullWidth: true, // Makes the carousel full width
    indicators: true, // Show slide indicators (optional)
  }
  var instances = M.Carousel.init(elems, options)

  // Auto slide change every 3 seconds
  var interval = setInterval(function () {
    var instance = M.Carousel.getInstance(elems[0])
    instance.next() // Move to the next slide
  }, 10000)
})

M.AutoInit()

function fetchWeatherInfo(lat, lon, callback) {
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${opWeatherKey}&units=imperial`
  fetch(weatherUrl)
    .then((response) => response.json())
    .then((data) => {
      if (data && data.main && data.weather) {
        const temperature = data.main.temp
        const description = data.weather[0].description
        const iconCode = data.weather[0].icon
        const iconUrl = `http://openweathermap.org/img/w/${iconCode}.png`
        const formattedWeatherInfo = `
      Temperature: ${temperature}°F <br>
      Condition: ${description} <br>
      <img src="${iconUrl}" alt="${description} icon">`

        callback(null, formattedWeatherInfo)
      } else {
        callback('No weather information available currently')
      }
    })
    .catch((error) => {
      callback(error)
    })
}

function buildCards(filteredParkList) {
  const selectedActivity = document.getElementById('activity').value
  parkList.innerHTML = ''

  function findCityAndState(addresses) {
    if (Array.isArray(addresses)) {
      for (const address of addresses) {
        if (address.type === 'Physical') {
          const city = address.city
          const state = address.stateCode
          return `${city}, ${state}`
        }
      }
    }
    return 'Location not available'
  }

  filteredParkList.forEach((park) => {
    if (
      selectedActivity === '' ||
      park.activities.some((activities) => activities.name === selectedActivity)
    ) {
      const parkName = park.fullName
      const imageUrl =
        park.images.length > 0 ? park.images[0].url : 'assets/butterfield.jpg'

      // Create the card
      const parkCard = document.createElement('div')
      parkCard.className = 'col s12 m6 l4'
      const parkLocation = findCityAndState(park.addresses)

      parkCard.innerHTML = `
          <div class="card large z-depth-4">
            <div class="card-image waves-effect waves-block waves-light">
              <img class="activator" src="${imageUrl}">
            </div>
            <div class="card-content transparent">
              <span class="card-title activator grey-text text-darken-4">${park.fullName}<i class="meduim material-icons right">add</i></span>
              <p class="park-location">${parkLocation}</p>
            </div>
            <div class="card-reveal cyan lighten-4">
              <span class="card-title grey-text text-darken-4">${park.fullName}<i class="material-icons right">close</i></span>
              <div class="card-tabs">
                <ul class="tabs tabs-fixed-width cyan lighten-2">
                  <li class="tab"><a href="#desc">Description</a></li>
                  <li class="tab"><a class="active" href="#weather-info">Weather</a></li>
                  <li class="tab"><a href="#links">Park Links</a></li>
                </ul>
              </div>
              <div class="card-content cyan lighten-3">
                <div id="desc" style="display: block;"><p>${park.description}</p></div>
                <div id="weather-info" style="display: none;"><span class="weather-info-placeholder">Loading the weather...</span></div>
                <div id="links" style="display: none;">
                  <ul>
                    <li><strong>Official Website:</strong> <a href="${park.url}" target="_blank">${park.url}</a></li>
                    <li><strong>Directions:</strong> <a href="${park.directionsUrl}" target="_blank">${park.directionsUrl}</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        `

      const lat = park.latitude
      const lon = park.longitude
      fetchWeatherInfo(lat, lon, (error, weatherInfo) => {
        if (error) {
          console.error('Failed to fetch the weather:', error)
        } else {
          const weatherDiv = parkCard.querySelector('.weather-info-placeholder')
          if (weatherDiv) {
            weatherDiv.innerHTML = weatherInfo
          }
        }
      })

      const cardTitle = parkCard.querySelector('.card-title.activator')
      const cardReveal = parkCard.querySelector('.card-reveal')
      cardTitle.addEventListener('click', () => {
        cardReveal.style.display = 'block'
      })

      const tabLinks = parkCard.querySelectorAll('.card-tabs a')
      tabLinks.forEach((tabLink) => {
        tabLink.addEventListener('click', (event) => {
          const tabId = tabLink.getAttribute('href').substring(1)
          const tabContent = parkCard.querySelector(`#${tabId}`)
          parkCard.querySelectorAll('.card-content div').forEach((content) => {
            content.style.display = 'none'
          })
          tabContent.style.display = 'block'
          event.preventDefault()
        })
      })

      // Hide weather and passes tabs initially
      parkCard.querySelector('#weather-info').style.display = 'none'
      parkCard.querySelector('#links').style.display = 'none'

      parkList.appendChild(parkCard)
    }
  })
}

function fetchParkNames() {
  fetch(parkUrl, {
    headers: {
      'X-Api-Key': npsKey,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      return response.json()
    })
    .then((data) => {
      console.log(data)
      searchParksWithinRadius(data.data)
    })

    .catch((error) => {
      console.error('There was a problem with the fetch operation:', error)
    })
}

document.addEventListener('DOMContentLoaded', function () {
  fetchParkNames()
})

function buildFeeInfoHTML(entranceFees) {
  if (!entranceFees || entranceFees.length === 0) {
    return '<div class="no-fees-info">No entrance fee information available for this park.</div>'
  }

  let feeInfoHTML = ''
  entranceFees.forEach((entranceFees) => {
    feeInfoHTML += `
      <div>
        <strong>${entranceFees.title}:</strong> $${entranceFees.cost}<br>
        ${entranceFees.description ? entranceFees.description : ''}
      </div>
    `
  })

  return feeInfoHTML
}

backToTopBtn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
})

function geocodeLocation(location) {
  var geocodeApiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=AIzaSyBOP3dL1H72x3jttlJeSVdGa0jvE5QpIyU`
  return fetch(geocodeApiUrl)
    .then(function (response) {
      return response.json()
    })
    .then(function (data) {
      var coordinates = data.results[0].geometry.location
      return coordinates
    })
    .catch(function (error) {
      console.error('Error geocoding location:', error)
      return null
    })
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  var R = 3958.8
  var dLat = (lat2 - lat1) * (Math.PI / 180)
  var dLon = (lon2 - lon1) * (Math.PI / 180)
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  var distance = R * c
  return distance
}

function searchParksWithinRadius(allParks) {
  var userLocationInput = document.getElementById('find_parks').value
  var selectedRadius = getSelectedRadius()

  if (userLocationInput !== '' && userLocationInput !== null) {
    if (!selectedRadius) {
      buildCards(allParks)
      return
    }
    geocodeLocation(userLocationInput)
      .then(function (userCoordinates) {
        if (!userCoordinates) {
          alert('Location not found. Please enter a valid city or zip code.')
        } else {
          searchPerformed = true
          var filteredParks = allParks.filter(function (park) {
            var parkCoordinates =
              park.latitude && park.longitude
                ? { lat: park.latitude, lng: park.longitude }
                : null

            if (
              parkCoordinates &&
              calculateDistance(
                userCoordinates.lat,
                userCoordinates.lng,
                parkCoordinates.lat,
                parkCoordinates.lng
              ) <= selectedRadius
            ) {
              return true
            }
            return false
          })
          buildCards(filteredParks)
        }
      })
      .catch(function (error) {
        console.error('Error searching parks within radius:', error)
      })
  } else {
    buildCards(allParks)
  }
}

function getSelectedRadius() {
  var selectedRadioBtn = document.querySelector('input[name="group1"]:checked')
  if (selectedRadioBtn) {
    return parseInt(selectedRadioBtn.value, 10)
  }
  return null
}

searchBtn.addEventListener('click', fetchParkNames)

refreshBtn.addEventListener('click', function () {
  location.reload()
})
