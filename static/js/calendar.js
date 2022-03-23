
const dayGenerator = count => {
    const arr = [];
    for(let i = 0; i < count; i++) {
        arr.push(i+1);
    }
    return arr;
}

const calendarData = [
    {
        id: '1',
        name: 'Сентябрь',
        days: dayGenerator(30)
    },
    {
        id: '2',
        name: 'Отктябрь',
        days: dayGenerator(31)
    },
    {
        id: '3',
        name: 'Ноябрь',
        days: dayGenerator(30)
    },
    {
        id: '4',
        name: 'Декабрь',
        days: dayGenerator(31)
    },
    {
        id: '5',
        name: 'Январь',
        days: dayGenerator(31)
    },
    {
        id: '6',
        name: 'Февраль',
        days: dayGenerator(28)
    },
    {
        id: '7',
        name: 'Март',
        days: dayGenerator(31)
    },
    {
        id: '8',
        name: 'Апрель',
        days: dayGenerator(30)
    },
    {
        id: '9',
        name: 'Май',
        days: dayGenerator(31)
    },
    {
        id: '10',
        name: 'Июнь',
        days: dayGenerator(30)
    },
    {
        id: '11',
        name: 'Июль',
        days: dayGenerator(31)
    },
    {
        id: '12',
        name: 'Август',
        days: dayGenerator(31)
    }
];

const userID = window.location.pathname.replace('/user/id', '').replace('/calendar', '');

// Generate calendar items

const calendar = document.querySelector('.calendar');

calendarData[11].days[1] = `<div class="flag-AF"></div>`;
calendarData[11].days[5] = `<div class="flag-RU"></div>`;

calendar.innerHTML = calendarData.map(month => `
    <div class="item">
        <div class="name">${month.name}</div>
        <div class="days">
            ${month.days.map(day => `<div class="day">${day}</div>`).join('')}
        </div>
    </div>
`).join('');

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

const yearsData = async (id) => {
    const eventsYears = [];
    await fetch('/getEvents', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: id,
        })
    }).then(events => events.json()).then(events => {
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
            yearsBox.querySelectorAll('.year').forEach(el => {
                el.querySelector('.counter').textContent = el.querySelector('.title').textContent === year ?
                    +el.querySelector('.counter').textContent+1:0;
            });
        });
    });

    return arr

}

const yearGenerator = new YearGenerator(6);

setYears(yearGenerator.next());

controlLeft.onclick = () => setYears(yearGenerator.prev());
controlRight.onclick = () => setYears(yearGenerator.next());