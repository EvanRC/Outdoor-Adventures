// open weather and NPS API keys
const opWeatherKey = 'ef52a053126f1ffad0042182f7e8f385'
const npsKey = '9fi4OHLPohhQm2w4RcbNkl8tPu6xMiqljmISBjp6'
// NPS API endpoints
const parkUrl = 'https://developer.nps.gov/api/v1/parks?stateCode=CA'
const passUrl = 'https://developer.nps.gov/api/v1/feespasses?statecode=CA'
// UI elements from the HTML document
const searchBtn = document.getElementById('searchBtn')
const parkList = document.getElementById('parkList')
const parkDetails = document.getElementById('parkDetails')
const passesList = document.getElementById('passesList')
const cardContainer = document.getElementById('cardContainer')
const refreshBtn = document.getElementById('refreshBtn')
const backToTopBtn = document.getElementById('topBtn')

// Initialize the carousel component when the document loads
document.addEventListener('DOMContentLoaded', function () {
  var elems = document.querySelectorAll('.carousel')
  var options = {
    fullWidth: true, // Makes the carousel full width
    indicators: true,
  }
  var instances = M.Carousel.init(elems, options)

  // Auto slide change every 4 seconds
  var interval = setInterval(function () {
    var instance = M.Carousel.getInstance(elems[0])
    instance.next() // Move to the next slide
  }, 4000)
})
// Initialize all other Materialize components
M.AutoInit()

// Function to fetch weather information and forecasts using OpenWeather API
function fetchWeatherAndForecast(lat, lon, callback) {
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${opWeatherKey}&units=imperial`
  const foreCastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${opWeatherKey}&units=imperial`
  // Fetch the current weather
  fetch(weatherUrl)
    .then((response) => response.json())
    .then((weatherData) => {
      // If the response contains weather data
      if (weatherData && weatherData.main && weatherData.weather) {
        // Extract necessary data from the weatherData response
        const temperature = weatherData.main.temp // Current temperature
        const description = weatherData.weather[0].description // Weather condition description
        const iconCode = weatherData.weather[0].icon // Weather icon code
        const iconUrl = `http://openweathermap.org/img/w/${iconCode}.png` // URL for the weather icon

        // Process the weather data and build an HTML string for display
        const formattedWeatherInfo = `
      <strong> Today:</strong> <br>
      Temperature: ${temperature}°F, 
      Condition: ${description} <img src="${iconUrl}" alt="${description} icon"><br>` //current weather

        return Promise.all([fetch(foreCastUrl), formattedWeatherInfo]) // Returns a Promise that resolves with both the forecast data and the current weather HTML string
      } else {
        // If the weather data is not available, throw an error
        throw new Error('No weather forecast information available currently')
      }
    })
    .then(([forecastResponse, formattedWeatherInfo]) => {
      //process weather data and builds HTML string to display 5 day forecast
      return forecastResponse.json().then((forecastData) => {
        let forecastHTML = '<br><strong>5-day Forecast:</strong><br>'

        // Array to map numerical day of the week to string (e.g., 0 -> 'Sunday')
        const daysOfWeek = [
          'Sunday',
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
        ]

        // Check if forecastData has a list of forecast items
        if (forecastData && forecastData.list) {
          // Loop through the forecast list items (every 8th item represents a new day)
          for (let i = 0; i < forecastData.list.length; i += 8) {
            const dayData = forecastData.list[i]
            const dayTemp = dayData.main.temp
            const dayDescription = dayData.weather[0].description
            const dayIconCode = dayData.weather[0].icon
            const dayIconUrl = `https://openweathermap.org/img/w/${dayIconCode}.png`

            const forecastDate = new Date(dayData.dt * 1000)

            const dayOfWeek = daysOfWeek[forecastDate.getDay()]

            forecastHTML += `
     <strong>${dayOfWeek}:</strong>&nbsp;&nbsp;
      Temperature: ${dayTemp}°F, Conditions: ${dayDescription} <img src="${dayIconUrl}" alt="${dayDescription} icon"><br>` //5day forecast
          }
        }

        const combinedWeatherInfo = formattedWeatherInfo + forecastHTML

        // Execute the callback function passing the concatenated current weather and forecast HTML
        callback(null, combinedWeatherInfo)
      })
    })
    .catch((error) => {
      // If there is an error fetching the weather or forecast, execute the callback with the error
      callback(error, null)
      callback(error)
    })
}

// Function to create park cards with fetched data
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

      // Creates the card
      const parkCard = document.createElement('div')
      parkCard.className = 'col s12 m6 l4'
      const parkLocation = findCityAndState(park.addresses)
      //park card template
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

      const lat = park.latitude // Extract the latitude and longitude from the park object.
      const lon = park.longitude

      // Fetch weather and forecast data using the extracted latitude and longitude.
      fetchWeatherAndForecast(lat, lon, (error, weatherInfo) => {
        // Check if there was an error during the fetch
        if (error) {
          // Log the error to the console if a fetch error occurs.
          console.error('Failed to fetch the weather:', error)
        } else {
          // Find the DOM element for displaying weather information within the park card.
          const weatherDiv = parkCard.querySelector('.weather-info-placeholder')
          if (weatherDiv) {
            weatherDiv.innerHTML = weatherInfo
          }
        }
      })

      const cardTitle = parkCard.querySelector('.card-title.activator') // Select the element that serves as the trigger to reveal additional park information.
      const cardReveal = parkCard.querySelector('.card-reveal') // Select the element that contains the additional park information.
      cardTitle.addEventListener('click', () => {
        // Display the additional park information when the title is clicked.
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
          // Display the content of the clicked tab.
          tabContent.style.display = 'block'
          event.preventDefault()
        })
      })

      // Hide weather and passes tabs initially
      parkCard.querySelector('#weather-info').style.display = 'none'
      parkCard.querySelector('#links').style.display = 'none'

      parkList.appendChild(parkCard) // Append the park card to the list of parks.
    }
  })
}
// Function to fetch park names from NPS API
function fetchParkNames() {
  // Make a GET request to the park URL with the API key in the headers.
  fetch(parkUrl, {
    headers: {
      'X-Api-Key': npsKey,
    },
  })
    .then((response) => {
      // Throw an error if the response status is not ok to catch it later.
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      // Parse the response body as JSON.
      return response.json()
    })
    .then((data) => {
      // Log the received data to the console for debugging.
      console.log(data)
      // Call the function to process parks within the specified radius using the received data.
      searchParksWithinRadius(data.data)
    })

    .catch((error) => {
      // Log any errors that occur during the fetch operation.
      console.error('There was a problem with the fetch operation:', error)
    })
}
// Attach event listener to fetch park names on document load
document.addEventListener('DOMContentLoaded', function () {
  fetchParkNames()
})
// Function to construct HTML for entrance fees information
function buildFeeInfoHTML(entranceFees) {
  // If there are no entrance fees provided, return a message indicating this.
  if (!entranceFees || entranceFees.length === 0) {
    return '<div class="no-fees-info">No entrance fee information available for this park.</div>'
  }

  let feeInfoHTML = '' // Initialize an empty string to hold the HTML content for entrance fees.
  entranceFees.forEach((entranceFees) => {
    // Loop through each entrance fee item and append its information to the HTML string.
    feeInfoHTML += `
      <div>
        <strong>${entranceFees.title}:</strong> $${entranceFees.cost}<br>
        ${entranceFees.description ? entranceFees.description : ''}
      </div>
    `
  })

  return feeInfoHTML // Return the constructed HTML content for the entrance fees.
}

// Event listener for the 'Back to Top' button
backToTopBtn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
})

// Function to geocode a location using Google Maps API
function geocodeLocation(location) {
  // Construct the URL for the geocoding API with the location query and API key
  var geocodeApiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=AIzaSyBOP3dL1H72x3jttlJeSVdGa0jvE5QpIyU`
  // Make a request to the geocode API URL.
  return fetch(geocodeApiUrl)
    .then(function (response) {
      return response.json() // Parse the response as JSON.
    })
    .then(function (data) {
      // Extract the coordinates from the geocode data.
      var coordinates = data.results[0].geometry.location
      return coordinates
    })
    .catch(function (error) {
      // Log an error if geocoding fails.
      console.error('Error geocoding location:', error)
      return null // Return null if there was an error.
    })
}

// Function to calculate distance between two points on Earth
function calculateDistance(lat1, lon1, lat2, lon2) {
  var R = 3958.8 // Radius of the Earth in miles.
  // Convert the differences in latitude and longitude from degrees to radians.
  var dLat = (lat2 - lat1) * (Math.PI / 180)
  var dLon = (lon2 - lon1) * (Math.PI / 180)
  // Apply the Haversine formula to calculate the distance.
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) // Calculate the distance and return it.
  var distance = R * c
  return distance
}
// Function to filter parks within a certain radius from user's location
function searchParksWithinRadius(allParks) {
  var userLocationInput = document.getElementById('find_parks').value // Get the user's location input from an input field.
  var selectedRadius = getSelectedRadius() // Get the selected search radius.
  var errorMessageElement = document.getElementById('error-message') // Get the element where error messages will be displayed.

  // Clear any existing error messages
  errorMessageElement.innerHTML = ''

  if (userLocationInput !== '' && userLocationInput !== null) {
    if (!selectedRadius) {
      // If no search radius is selected, display all parks and exit the function.
      buildCards(allParks)
      return
    }

    // Geocode the user's location input to obtain geographic coordinates.
    geocodeLocation(userLocationInput)
      .then(function (userCoordinates) {
        searchPerformed = true
        // Filter the list of all parks to find those within the selected radius of the user's location.
        var filteredParks = allParks.filter(function (park) {
          var parkCoordinates =
            park.latitude && park.longitude
              ? { lat: park.latitude, lng: park.longitude }
              : null

          if (
            // If the park has coordinates and is within the selected radius of the user's location, include it in the filtered list.
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
          return false // Otherwise, do not include the park in the filtered list.
        })

        if (filteredParks.length === 0) {
          // If no parks are found within the selected radius, display an error message.
          errorMessageElement.textContent =
            'No parks found within the selected radius.'
        } else {
          // Build UI cards to display the filtered parks.
          buildCards(filteredParks)
        }
      })
      .catch(function () {
        // If an error occurs during the geocoding process or filtering, display an error message.
        errorMessageElement.textContent =
          'Error searching parks. Check your location and try again.'
      })
  } else {
    // If the user hasn't entered a location, display all parks.
    buildCards(allParks)
  }
}

// Function to get the selected radius from the user input
function getSelectedRadius() {
  var selectedRadioBtn = document.querySelector('input[name="group1"]:checked')
  if (selectedRadioBtn) {
    return parseInt(selectedRadioBtn.value, 10)
  }
  return null
}
// Attach event listener to the search button to initiate park name fetch
searchBtn.addEventListener('click', fetchParkNames)

// Event listener to refresh the page when the refresh button is clicked
refreshBtn.addEventListener('click', function () {
  location.reload()
})
