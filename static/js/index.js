
import {App} from './app.class.js';

// Air-datepicker => google.com
$('.date').datepicker({
    multipleDates: 2,
    inline: true,
    range: true
});

// Handler for dates
const controls = document.querySelector('.controls');
const modal = document.querySelector('.modal');

// Modal close button
modal.querySelector('.close').onclick = () => modal.style.display = 'none';

let updateDate;

// Modal send button
modal.querySelector('#sendModal').onclick = () => {
    modal.style.display = 'none';
    updateDate(modal.querySelector('.date').value);
}

// Map config
const config = {
    element: 'chartdiv',
    background: 'rgb(0, 160, 224)',
    countryStyle: {
        fill: 'rgb(255, 192, 96)',
        stroke: 'rgb(2, 93, 184)',
        fillActive: 'red'
    }
}

// Initialize map
const myApp = new App(config);

// Set background color
myApp.setBackground(config.background);

// Set list country
const countryList = myApp.getCountryList();
countryList.then(data => document.querySelector('#country').innerHTML = data.map(el => `<option value="${el.id}">${el.name}</option>`).join('')).catch(console.log);
//countryList.then(data => console.log(data))

// Load saved data
fetch('/getEvents', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        email: localStorage.getItem('email')
    })
}).then(data => data.json())
    .then(data => data.events.forEach(el => myApp.loadSavedData(el)))
    .catch(console.log);

// Set click handler for country on map
myApp.setEventOnCountry(modal, (fill, country, name) => {
    return updateDate = (date) => myApp.setEvent({
        fill: fill,
        country: country,
        fullName: name,
        date: date
    });
});

document.querySelector('#country').onclick = (e) => {
    const name = document.querySelector('#country').options[document.querySelector('#country').selectedIndex].textContent;
    document.querySelector('.event .title').innerText = name;
    //myApp.addEventArr.filter(el => console.log(el.name === name));
    document.querySelector('.event .dateslist').innerHTML =
        myApp.addEventArr.filter(el => el.fullName === name).map((el, i) => {
            return `<div class="dateItem">${el.date.replace(',', ' - ')}
                       <div class="buttons">
                            <button class="updateDate" title="update"><i class="fa-solid fa-pen-to-square"></i></button>
                            <button class="removeDate" title="remove">X</button>
                        </div>
                    </div>`
        }).join('');
    const centroid = myApp.polygonSeries.getDataItemById(e.target.value)._settings.mapPolygon.geoCentroid();
    if (centroid) {
        myApp.chart.animate({ key: "rotationX", to: -centroid.longitude, duration: 1500, easing: am5.ease.inOut(am5.ease.cubic) });
        myApp.chart.animate({ key: "rotationY", to: -centroid.latitude, duration: 1500, easing: am5.ease.inOut(am5.ease.cubic) });
    }
}

// Get event inputs
document.querySelector('#send').onclick = () => {
    if(document.querySelector('#date').value) {
        myApp.setEvent({
            country: document.querySelector('#country').value,
            date: document.querySelector('#date').value,
            fullName: document.querySelector('#country').options[document.querySelector('#country').selectedIndex].textContent
        });
    }
};

// Set clear events button
//document.querySelector('#clear').onclick = () => myApp.clearEvents();

// Set clear events button
document.querySelector('#quit').onclick = () => {
    localStorage.clear();
    window.location.href = '/auth'; //1598 1740
}