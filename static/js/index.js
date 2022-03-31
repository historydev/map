
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
        id: +window.location.pathname.replace('/user/id', ''),
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
        id: +window.location.pathname.replace('/user/id', ''),
        name: 'AF'
    })
}).then(data => data.json())
    .then(data => {
        console.log(data);
        data.events.forEach(el => {
            myApp.polygonSeries.getDataItemById(el.name)._settings.mapPolygon.setAll({
                fill: myApp.config.countryStyle.fillActive,
            });
        })
    });

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

// #Country

countryEl.onchange = (e) => {
    const name = countryEl.options[countryEl.selectedIndex].textContent;
    const value = countryEl.options[countryEl.selectedIndex].value;

    fetch('/getCountryEvents', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: window.location.pathname.replace('/user/id', ''),
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
            fullName: countryEl.options[countryEl.selectedIndex].textContent,
            fill: 'red'
        });
    }
};

fetch('/isAuth', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        id: +window.location.pathname.replace('/user/id', '')
    })
}).then(data => data.json()).then(data => {
    const email = typeof data[0] === typeof {};
    console.log(data);
    const quit = document.querySelector('#quit');
    const emailBox = quit.querySelector('#email');
    document.querySelector('#send').style.display = email ? 'block' : 'none';
    quit.style.display = email ? 'block' : 'none';
    emailBox.style.display = email ? 'block' : 'none';
    emailBox.textContent = email ? data[0].email : '';
    document.querySelector('#auth').style.display = email ? 'none' : 'block';
});
// Set quit button
document.querySelector('#quit').onclick = () => {
    fetch('/quit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: +window.location.pathname.replace('/user/id', '')
        })
    }).finally(() => {
        document.querySelector('#send').style.display = 'none';
        document.querySelector('#quit').style.display = 'none';
        document.querySelector('#auth').style.display = 'block';
    });
}

document.querySelector('#auth').onclick = () => {
    window.location.href = '/auth';
}
document.querySelector('#calendar').onclick = () => {
    window.location.pathname = window.location.pathname + '/calendar';
}