
const getEvents = (id) => fetch('/getEvents', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        id: id,
    })
});

const yearsData = async(id) => {
    const eventsYears = [];
    await getEvents(id).then(events => events.json()).then(events => {
        events.events.forEach(event => {
            eventsYears.push({
                name: event.name,
                start: parseInt(event.date.split(',')[0].split('.')[2]),
                end: parseInt(event.date.split(',')[1].split('.')[2])
            });
        });
    });
    return eventsYears
}

const userID = +window.location.pathname.replace('/user/id', '').replace('/years', '');

yearsData(userID).then(data => {

    const yearsBox = document.querySelector('.years');

    yearsBox.insertAdjacentHTML( 'afterbegin', data.map(event => {
        const years = [];
        for(let i = event.start; i <= event.end; i++) {
            if(event.start !== event.end) years.push(i);
        }

        return years.map(el => `<div class="year">${el}</div>`).join('');
    }).join(''));

    yearsBox.querySelectorAll('.year').forEach(el => {
        const years = [];
        const names = [];
        data.forEach(event => {
            for(let i = event.start; i <= event.end; i++) {
                years.push(i);
                names.push(event.name);
            }
        });

        years.forEach((year, i) => {
            if(year === parseInt(el.textContent)) {
                console.log(el.textContent);
                el.insertAdjacentHTML('beforeend', `<div class="flag flag-${names[i]}"></div>`);
            }
        });
    });

});

document.querySelector('#back_to_map').onclick = () => window.location.replace(`/user/id${userID}`);
document.querySelector('#back_to_calendar').onclick = () => window.location.replace(`/user/id${userID}/calendar`);