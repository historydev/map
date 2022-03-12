
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