
import {App} from './app.class.js';

// Air-datepicker => google.com
$('.date').datepicker({
    multipleDates: 2,
    inline: true
});

// Handler for dates
const controls = document.querySelector('.controls');
const modal = document.querySelector('.modal');

const setDate = (el) => {
    const data = el.querySelector('.date').value.split(',');
    el.querySelector('.dates').textContent = `${data[0] ? `Начало: ${data[0]}` : ''} ${data[1] ? ` | Конец: ${data[1]}` : ''}`;
}

controls.querySelector('.datepicker-inline').onclick = () => setDate(controls);
modal.querySelector('.datepicker-inline').onclick = () => setDate(modal);

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
myApp.getCountryList().then(data => {
    document.querySelector('#country').innerHTML = data.map(el => `<option value="${el.id}">${el.name}</option>`).join('');
});

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
    .then(data => data.events.forEach(el => myApp.loadSavedData(el)));

// Set click handler for country on map
myApp.setEventOnCountry(modal, (fill, country) => {
    return updateDate = (date) => myApp.setEvent({
        fill: fill,
        country: country,
        date: date
    });
});

// Get event inputs
document.querySelector('#send').onclick = () => myApp.setEvent({
    country: document.querySelector('#country').value,
    date: document.querySelector('#date').value
});

// Set clear events button
document.querySelector('#clear').onclick = () => myApp.clearEvents();
// Set clear events button
document.querySelector('#quit').onclick = () => {
    localStorage.clear();
    window.location.href = '/auth'; //1598 1740
}