
const dayGenerator = count => {
    const arr = [];
    for(let i = 0; i < count; i++) {
        arr.push(i+1);
    }
    return arr;
}

const calendarData = [
    {
        id: '01',
        name: 'Январь',
        days: dayGenerator(31)
    },
    {
        id: '02',
        name: 'Февраль',
        days: dayGenerator(28)
    },
    {
        id: '03',
        name: 'Март',
        days: dayGenerator(31)
    },
    {
        id: '04',
        name: 'Апрель',
        days: dayGenerator(30)
    },
    {
        id: '05',
        name: 'Май',
        days: dayGenerator(31)
    },
    {
        id: '06',
        name: 'Июнь',
        days: dayGenerator(30)
    },
    {
        id: '07',
        name: 'Июль',
        days: dayGenerator(31)
    },
    {
        id: '08',
        name: 'Август',
        days: dayGenerator(31)
    },
    {
        id: '09',
        name: 'Сентябрь',
        days: dayGenerator(30)
    },
    {
        id: '10',
        name: 'Отктябрь',
        days: dayGenerator(31)
    },
    {
        id: '11',
        name: 'Ноябрь',
        days: dayGenerator(30)
    },
    {
        id: '12',
        name: 'Декабрь',
        days: dayGenerator(31)
    }
];

const userID = window.location.pathname.replace('/user/id', '').replace('/calendar', '');

// Set calendar items

const calendar = document.querySelector('.calendar');

const setCalendarData = (data) => {
    calendar.innerHTML = data.map(month => `
        <div class="item">
            <div class="name">${month.name}</div>
            <div class="days">
                ${month.days.map(day => `<div class="day">${day}</div>`).join('')}
            </div>
        </div>
    `).join('');
}

setCalendarData(calendarData);

// Generate Years

function YearGenerator(count) {
    this.arr = [];
    this.last_year = new Date().getFullYear()-count;

    this.next = () => {
        this.arr = [];
        for(let i = this.last_year; i < this.last_year+count+1; i++) {
            this.arr.push(i);
        }
        this.last_year = this.arr[this.arr.length-1];
        this.arr = [];
        for(let i = this.last_year; i < this.last_year+count+1; i++) {
            this.arr.push(i);
        }

        return this.arr;
    }

    this.prev = () => {
        this.arr = [];
        for(let i = this.last_year; i > this.last_year-count-1; i--) {
            this.arr.unshift(i);
        }
        this.last_year = this.arr[0];
        return this.arr;
    }

}

// Show years

const yearsBox = document.querySelector('.years .content');
const controlLeft = document.querySelector('.years .left');
const controlRight = document.querySelector('.years .right');

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
            eventsYears.push(event.date.split(',')[0].split('.')[2]);
        });
    });
    return eventsYears
}

function setYears(arr) {

    yearsBox.innerHTML = arr.sort().map(year =>
        `<div class="year">
            <div class="title">${year}</div>
            <div class="counter">0</div>
        </div>`
    ).join('');

    yearsData(userID).then(years => {
        years.forEach(year => {
            console.log(year);
            yearsBox.querySelectorAll('.year').forEach(el => {
                console.log(el.querySelector('.title').textContent === year);
                el.querySelector('.counter').textContent = el.querySelector('.title').textContent === year ?
                    +el.querySelector('.counter').textContent+1:+el.querySelector('.counter').textContent;
            });
        });
    });

    return arr

}

const setEvents = async(year) => {
    console.log(calendarData);
    return await getEvents(userID).then(events => events.json()).then(data => {
        const filteredData = data.events.map(el => ({
            name: el.name,
            date: el.date.split(',').map(el => el.split('.'))
        }));
        const arr = calendarData.map(el => JSON.parse(JSON.stringify(el)));
        filteredData.forEach(event => {

            const minDay = +event.date[0][0].replace('0', '');
            const maxDay = +event.date[1][0].replace('0', '');
            const months = [event.date[0][1], event.date[1][1]];
            const years = [event.date[0][2], event.date[1][2]];
            const name = event.name;

            if(years.includes(year)) {
                for(let i = minDay-1; i < maxDay; i++) {
                    months.forEach(month => {
                        arr.find(el => el.id === month).days[i] = `<div class="flag-${name}"></div>`;
                    });
                }
            }

        });
        return arr
    });
}

setEvents('2022').then(data => setCalendarData(data));

const yearHandler = () => yearsBox.querySelectorAll('.year').forEach(el => {
    el.onclick = () => {
        setEvents(el.querySelector('.title').textContent).then(data => setCalendarData(data));
    }
});

const yearGenerator = new YearGenerator(6);

setYears(yearGenerator.next());

controlLeft.onclick = () => {
    setYears(yearGenerator.prev());
    yearHandler();
}
controlRight.onclick = () => {
    setYears(yearGenerator.next());
    yearHandler();
}

yearHandler();

document.querySelector('#back').onclick = () => window.location.pathname = window.location.pathname.replace('/calendar', '');
