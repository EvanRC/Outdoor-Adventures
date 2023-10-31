const npsKey = "9fi4OHLPohhQm2w4RcbNkl8tPu6xMiqljmISBjp6"
const parkUrl = 'https://developer.nps.gov/api/v1/parks?stateCode=CA'
const passUrl = "https://developer.nps.gov/api/v1/feespasses?statecode=CA"
const calBtn = document.getElementById("dropbtn")
const parkList = document.getElementById("parkList")
const parkDetails = document.getElementById('parkDetails')
const passesList = document.getElementById("passesList")
const cardContainer = document.getElementById("cardContainer")

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
      console.log(data);
      data.data.forEach(park => {
        const parkName = park.fullName;
        const imageUrl = park.images.length > 0 ? park.images[0].url : 'images/sample-1.jpg';

        // Create the card
        const parkCard = document.createElement('div');
          parkCard.className = 'col s12 m6 l4';
          parkCard.innerHTML = `
            <div class="card">
              <div class="card-image waves-effect waves-block waves-light">
                <img class="activator" src="${imageUrl}">
              </div>
              <div class="card-content">
                <span class="card-title activator grey-text text-darken-4">${park.fullName}<i class="meduim material-icons right">add</i></span>
              </div>
              <div class="card-reveal">
                  <span class="card-title grey-text text-darken-4">${park.fullName}<i class="material-icons right">close</i></span>
                  <div class="card-tabs">
                    <ul class="tabs tabs-fixed-width">
                      <li class="tab"><a href="#desc">Description</a></li>
                      <li class="tab"><a class="active" href="#weather">Weather</a></li>
                      <li class="tab"><a href="#links">Park Links</a></li>
                    </ul>
                  </div>
                  <div class="card-content grey lighten-4">
                    <div id="desc" style="display: block;"><p>${park.description}</p></div>
                    <div id="weather" style="display: none;">${park.weatherInfo}</div>
                    <ul id="links" style="display: none;">
                        <li><strong>Official Website:</strong> <a href="${park.url}" target="_blank">${park.url}</a></li>
                        <li><strong>Directions:</strong> <a href="${park.directionsUrl}" target="_blank">${park.directionsUrl}</a></li>
                      </ul>
      
                    </div>

                  </div>
                </div>
              </div>
            </div>
          `;
  
        
        const cardTitle = parkCard.querySelector('.card-title.activator');
        const cardReveal = parkCard.querySelector('.card-reveal');
        cardTitle.addEventListener('click', () => {
          cardReveal.style.display = 'block';
          parkCard.querySelector('#weather').style.display = 'none';
          parkCard.querySelector('#passes').style.display = 'none';
        });

        const tabLinks = parkCard.querySelectorAll('.card-tabs a');
        tabLinks.forEach(tabLink => {
          tabLink.addEventListener('click', (event) => {
            const tabId = tabLink.getAttribute('href').substring(1);
            const tabContent = parkCard.querySelector(`#${tabId}`);
            parkCard.querySelectorAll('.card-content div').forEach(content => {
              content.style.display = 'none';
            });
            tabContent.style.display = 'block';
            event.preventDefault();
          });
        });

        // Hide weather and passes tabs initially
        parkCard.querySelector('#weather').style.display = 'none';
        parkCard.querySelector('#links').style.display = 'none';

        parkList.appendChild(parkCard);
      });
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
    });
}



function buildFeeInfoHTML(entranceFees) {
  if (!entranceFees || entranceFees.length === 0) {
    return '<div class="no-fees-info">No entrance fee information available for this park.</div>';
  }

  let feeInfoHTML = '';
  entranceFees.forEach(entranceFees => {
    feeInfoHTML += `
      <div>
        <strong>${entranceFees.title}:</strong> $${entranceFees.cost}<br>
        ${entranceFees.description ? entranceFees.description : ''}
      </div>
    `;
  });
  
  return feeInfoHTML;
} 

calBtn.addEventListener('click', fetchParkNames)

document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('.dropdown-trigger');
  var instances = M.Dropdown.init(elems, options);
});