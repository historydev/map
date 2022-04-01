
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

const userID = +window.location.pathname.replace('/user/id', '').replace('/calendar', '');

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
            yearsBox.querySelectorAll('.year').forEach(el => {
                el.querySelector('.counter').textContent = el.querySelector('.title').textContent === year ?
                    +el.querySelector('.counter').textContent+1:+el.querySelector('.counter').textContent;
            });
        });
    });

    return arr

}

const setEvents = async(year) => {
    return await getEvents(userID).then(events => events.json()).then(data => {
        const filteredData = data.events.map(el => ({
            name: el.name,
            dateStart: (() => {
                const date = el.date.split(',').map(el => el.split('.'))[0];
                return {
                    day: parseInt(date[0]),
                    month: date[1],
                    year: date[2]
                }
            })(),
            dateEnd: (() => {
                const date = el.date.split(',').map(el => el.split('.'))[1];
                return {
                    day: parseInt(date[0]),
                    month: date[1],
                    year: date[2]
                }
            })()
        }));

        const getAllDaysOfMonth = (year, month) => {
            const lastDayOfMonth = new Date(year, month , 0).getDate();
            const arr = [];
            for (let i = 1; i < lastDayOfMonth + 1; i++) {
                const date = new Date(year, month-1, i);
                arr.push(`${date.getDate() < 10 ? `0${date.getDate()}`: date.getDate()}.${date.getMonth()+1 < 10 ? `0${date.getMonth()+1}` : date.getMonth()+1}.${date.getFullYear()}`); //Here will print all days
            }
            return arr
        }

        const arr = calendarData.map(el => {
            JSON.parse(JSON.stringify(el.days = dayGenerator(getAllDaysOfMonth(year, el.id).length)));
            return el
        });
        filteredData.forEach(event => {

            const startDate = {
                minDay: event.dateStart.day,
                maxDay: event.dateEnd.month === event.dateStart.month ? event.dateEnd.day : arr.find(month => month.id === event.dateStart.month).days.length+1,
                month: event.dateStart.month,
                year: event.dateStart.year
            }

            const endDate = {
                minDay: 1,
                maxDay: event.dateEnd.day,
                month: event.dateEnd.month,
                year: event.dateEnd.year
            }

            const name = event.name;

            const mountDays = (dates) => {
                const months = [];
                const years = [];
                const startDate = dates.startDate;
                const endDate = dates.endDate;

                if(endDate.year === year && startDate.year === year) {

                    for(let i = parseInt(startDate.month)+1; i <= endDate.month; i++) {
                        months.push(i > 9 ? ''+i : '0'+i);
                    }
                    getMonths(months, endDate, arr);
                    setDays(startDate);

                } else if(endDate.year === year) {

                    for(let i = 1; i <= endDate.month; i++) {
                        months.push(i > 9 ? ''+i : '0'+i);
                    }
                    getMonths(months, endDate, arr);
                    setDays(endDate);

                } else if(startDate.year === year) {

                    for(let i = parseInt(startDate.month)+1; i <= 12; i++) {
                        months.push(i > 9 ? ''+i : '0'+i);
                    }
                    getMonths(months, startDate, arr);
                    setDays(startDate);

                } else if(year < endDate.year && year > startDate.year ) {

                    for(let i = 1; i <= 12; i++) {
                        months.push(i > 9 ? ''+i : '0'+i);
                    }
                    getMonths(months, startDate, arr);

                }

                for(let i = parseInt(startDate.year); i < endDate.year; i++) {
                    years.push(i);
                }
                console.log(year, endDate.year, startDate.year);
                console.log(years);
                console.log(years.includes(parseInt(year)));

                // if(years.includes(parseInt(year)) && year !== startDate.year && year !== endDate.year) {
                //
                //     for(let i = 1; i <= 12; i++) {
                //         months.push(i > 9 ? ''+i : '0'+i);
                //     }
                //
                //     getMonths(months, startDate, arr);
                // } else {
                //     arr.forEach(el => el.days = dayGenerator(getAllDaysOfMonth(year, el.id).length));
                //     getMonths(months, startDate, arr);
                // }




            }

            const getMonths = (months, date, arr) => {
                if(months.length >= 1) {
                    months.forEach((month, i, array) => {
                        setDays({
                            minDay: 1,
                            maxDay: i >= array.length-1 ? date.maxDay : arr.find(month => month.id === date.month).days.length+1,
                            month: month,
                            year: date.year
                        });
                    });
                }
            }

            const setDays = (date) => {
                console.log(date);
                arr.find(el => el.id === date.month).days.forEach((day, i, arr) => {
                    if(day >= date.minDay && day <= date.maxDay) {
                        return arr[i] = `<div class="flag-${name}"></div>`
                    }
                    return false
                });
            }

            mountDays({startDate, endDate});

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
