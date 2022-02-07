
import {App} from './app.class.js';

const config = {
    element: 'chartdiv',
    background: 'rgb(0, 160, 224)',
    countryStyle: {
        fill: 'rgb(255, 192, 96)',
        stroke: 'rgb(0, 160, 224)'
    }
}

const myApp = new App(config);
myApp.setBackground(config.background);
myApp.getCountryList().then(data => {
    document.querySelector('#country').innerHTML = data.map(el => `<option value="${el.id}">${el.name}</option>`).join('');
});

document.querySelector('#send').onclick = () => myApp.setEvent({
    country: document.querySelector('#country').value,
    date: document.querySelector('#date').value
});