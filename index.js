
import {App} from './app.class.js';

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
myApp.loadSavedData();

// Set click handler for country on map
myApp.setEventOnCountry();

// Get event inputs
document.querySelector('#send').onclick = () => myApp.setEvent({
    country: document.querySelector('#country').value,
    date: document.querySelector('#date').value
});

document.querySelector('#clear').onclick = () => myApp.clearEvents();