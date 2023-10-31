const npsKey = "9fi4OHLPohhQm2w4RcbNkl8tPu6xMiqljmISBjp6"
const parkUrl = 'https://developer.nps.gov/api/v1/parks?stateCode=CA'
const passUrl = "https://developer.nps.gov/api/v1/feespasses?statecode=CA"
const calBtn = document.getElementById("dropbtn")
const parkList = document.getElementById("parkList")
const parkDetails = document.getElementById('parkDetails')
const passesList = document.getElementById("passesList")

function fetchParkNames() {
  parkList.innerHTML = '';

  fetch(parkUrl, {
    headers: {
      'X-Api-Key': npsKey
    }
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log(data)
      data.data.forEach(park => {
        const parkName = park.fullName;
        const parkButton = document.createElement('button');
        parkButton.textContent = parkName;
        parkButton.addEventListener('click', () => {
          displayParkDetails(park);
        });
        parkList.appendChild(parkButton);
      });
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
    });
}

function displayParkDetails(park) {
  parkDetails.innerHTML = '';
  const nameElement = document.createElement('h2');
  nameElement.textContent = park.fullName;

  const descriptionElement = document.createElement('p');
  descriptionElement.textContent = park.description;

  const weatherElement = document.createElement('p');
  weatherElement.textContent = park.weatherInfo;

  const entranceFeesSection = document.createElement('div');
  entranceFeesSection.innerHTML = '<h3>Entrance Fees</h3>';

  park.entranceFees.forEach(entranceFee => {
    const feeItem = document.createElement('div');
    
    const feeInfo = document.createElement('strong');
    feeInfo.textContent = `${entranceFee.title}: $${entranceFee.cost}`;

    const feeDescription = document.createElement('p');
    feeDescription.textContent = `Description: ${entranceFee.description}`;

    feeItem.appendChild(feeInfo);
    feeItem.appendChild(feeDescription);
    entranceFeesSection.appendChild(feeItem);
  });

  parkDetails.appendChild(nameElement);
  parkDetails.appendChild(descriptionElement);
  parkDetails.appendChild(weatherElement);
  parkDetails.appendChild(entranceFeesSection);
}


calBtn.addEventListener('click', fetchParkNames)

function fetchPasses () {
  passesList.innerHTML = ''
  fetch(passUrl, {
    headers: {
      'X-Api-Key': npsKey
    }
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log(data)
    })
}
