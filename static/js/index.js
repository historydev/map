
import {App} from './app.class.js';

// Air-datepicker => google.com
$('.date').datepicker({
    multipleDates: 2,
    inline: true,
    range: true
});

// Handler for dates
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
        fillActive: 'red',
        initial: 'rgb(212, 78, 78)'
    }
}

// Initialize map
const myApp = new App(config);

// Set background color
myApp.setBackground(config.background);

// Set list country
const countryEl = document.querySelector('#country');
const countryList = myApp.getCountryList();
countryList.then(data => countryEl.innerHTML = data.map(el => `<option value="${el.id}">${el.name}</option>`).join('')).catch(console.log);
//countryList.then(data => console.log(data))

// Load saved data
fetch('/getCountryEvents', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        email: localStorage.getItem('email'),
        name: 'AF'
    })
}).then(data => data.json())
    .then(data => {
        myApp.loadSavedData(data.events);
        myApp.centerMap('AF');
    })
    .catch(console.log);

fetch('/getEvents', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        email: localStorage.getItem('email'),
        name: 'AF'
    })
}).then(data => data.json())
    .then(data => data.events.forEach(el => {
        myApp.polygonSeries.getDataItemById(el.name)._settings.mapPolygon.setAll({
            fill: myApp.config.countryStyle.fillActive,
        });
    }));

// Set click handler for country on map
myApp.setEventOnCountry(modal, (fill, country, name) => {
    return updateDate = (date) => {
        myApp.setEvent({
            fill: fill,
            country: country,
            fullName: name,
            date: date
        });
        return date
    }
}, countryEl);

const eventEl = document.querySelector('.event');

countryEl.onclick = (e) => {
    const name = countryEl.options[countryEl.selectedIndex].textContent;
    const value = countryEl.options[countryEl.selectedIndex].value;

    fetch('/getCountryEvents', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: localStorage.getItem('email'),
            name: value
        })
    }).then(data => data.json())
        .then(data => myApp.loadSavedData(data.events))
        .catch(console.log);

    eventEl.querySelector('.title').textContent = name;

    myApp.centerMap(e.target.value);
    myApp.changeCountry({
        country: value
    });
}

// Get event inputs
document.querySelector('#send').onclick = () => {
    if(document.querySelector('#date').value) {
        myApp.setEvent({
            country: countryEl.value,
            date: document.querySelector('#date').value,
            fullName: countryEl.options[countryEl.selectedIndex].textContent
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