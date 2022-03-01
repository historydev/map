export class App {

    constructor(config) {

        this.config = config;
        this.root = am5.Root.new(config.element);

        this.root.setThemes([
            am5themes_Animated.new(this.root)
        ]);

        this.chart = this.root.container.children.push(
            am5map.MapChart.new(this.root, {
                panX: "rotateX",
                panY: "rotateY",
                projection: am5map.geoOrthographic(),
                maxZoomLevel: 1,
                interactive: true
            })
        );

        this.backgroundSeries = this.chart.series.unshift(
            am5map.MapPolygonSeries.new(this.root, {})
        );

        this.polygonSeries = this.chart.series.push(
            am5map.MapPolygonSeries.new(this.root, {
                geoJSON: am5geodata_worldLow,
                fill: config.countryStyle.fill,
                stroke: config.countryStyle.stroke
            })
        );

        this.tooltip = am5.Tooltip.new(this.root, {
            pointerOrientation: "up",
            getFillFromSprite: false
        });
        this.tooltip.get("background").setAll({
            fill: am5.color(0xffffff),
            stroke: 'rgb(0, 160, 224)'
        });
        this.tooltip.label.setAll({
            fill: 'rgb(255, 192, 96)'
        });

        this.polygonSeries.mapPolygons.template.setAll({
            tooltipText: "{name}",
            clicked: false,
            tooltip: this.tooltip,
            interactive: true
        });

        this.chart.appear(1000, 100);

        this.lastCountryElement = '';

    }

    centerMap(item) {
        const centroid = this.polygonSeries.getDataItemById(item)._settings.mapPolygon.geoCentroid();
        if (centroid) {
            this.chart.animate({
                key: "rotationX",
                to: -centroid.longitude,
                duration: 1500,
                easing: am5.ease.inOut(am5.ease.cubic)
            });
            this.chart.animate({
                key: "rotationY",
                to: -centroid.latitude,
                duration: 1500,
                easing: am5.ease.inOut(am5.ease.cubic)
            });
        }
    }

    setEventOnCountry(modal, f) {
        this.polygonSeries.mapPolygons.template.events.on("click", (e) => {
            const dataItem = e.target.dataItem;
            const data = dataItem.dataContext;
            //const zoomAnimation = this.polygonSeries.zoomToDataItem(dataItem);

            this.chart.zoomToGeoPoint({ longitude: 10, latitude: 52 }, 1, false);

            fetch('/getCountryEvents', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: localStorage.getItem('email'),
                    name: data.id
                })
            }).then(data => data.json())
                .then(res => {
                    this.loadSavedData(res.events)
                })
                .catch(console.log);

            [...document.querySelector('#country').options].find(el => el.value === data.id).selected = true;
            document.querySelector('.event').querySelector('.title').innerText = data.name;

            this.centerMap(data.id);
            this.changeCountry({
                country: data.id
            });
            f(this.config.countryStyle.fillActive, data.id, data.name);

        });
    }

    loadSavedData(data) {
        const event = document.querySelector('.event');
        setTimeout(() => {
            if(data.length) {

                event.querySelector('.title').innerText = data[0].fullName;
                event.querySelector('.dateslist').innerHTML =
                    data.map((el, i) => {
                        return `<div class="dateItem">${el.date.replace(',', ' - ')}
                                    <div class="buttons">
                                        <button class="updateDate" title="update"><i class="fa-solid fa-pen-to-square"></i></button>
                                        <button class="removeDate" title="remove">X</button>
                                    </div>
                                </div>`
                    }).join('');

                data.forEach((el, index) => document.querySelectorAll('.event .dateItem .removeDate')[index].onclick = () => this.removeEvent(el));
                data.forEach((el, index) => document.querySelectorAll('.event .dateItem .updateDate')[index].onclick = () => {
                    const item = document.querySelectorAll('.event .dateItem')[index];
                    document.querySelector('#update').style.display = 'block';
                    document.querySelector('#send').style.display = 'none';
                    item.style.background = 'rgba(0,0,0, .1)';
                    this.updateEvent(el, item);
                });

                this.polygonSeries.getDataItemById(data[0].name)._settings.mapPolygon.setAll({
                    fill: data[0].fill,
                    date: data[0].date,
                    tooltipText: data[0].tooltipText
                });

            } else {
                event.querySelector('.dateslist').innerHTML = '';
            }
        })
        return data
    }

    updateEvent(event, item) {
        document.querySelector('#update').onclick = () => {
            fetch('/updateEvent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: localStorage.getItem('email'),
                    event: event,
                    date: document.querySelector('#date').value
                })
            }).then(data => data.json()).then(data => {
                this.loadSavedData(data.events);
                document.querySelector('#update').style.display = 'none';
                document.querySelector('#send').style.display = 'block';
                item.style.background = 'none';
            }).catch(console.log);
        }
    }

    removeEvent(event) {
        fetch('/removeEvent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: localStorage.getItem('email'),
                event: event
            })
        }).then(data => data.json()).then(data => {
            if(!data.length) {
                this.polygonSeries.getDataItemById(event.name)._settings.mapPolygon.setAll({
                    fill: this.config.countryStyle.fill,
                })
            }
            this.loadSavedData(data.events)
        }).catch(console.log);
    }

    setEvent(config) {
        const name = this.polygonSeries.getDataItemById(config.country).dataContext.name;

        return fetch('/setEvent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: localStorage.getItem('email'),
                event: {
                    name: config.country,
                    fullName: config.fullName,
                    fill: config.fill || this.config.countryStyle.fillActive,
                    date: config.date,
                    tooltipText: `${name}`
                }
            })
        }).then(data => data.json())
            .then(data => {
                this.loadSavedData(data.events);
                console.log(data);
                if(data.events.length) {
                    this.polygonSeries.getDataItemById(config.country)._settings.mapPolygon.setAll({
                        fill: config.fill || this.config.countryStyle.fillActive,
                        tooltipText: `${name}`
                    });
                } else {
                    console.log(this.polygonSeries.mapPolygons);
                    this.changeCountry(config);
                }
                this.centerMap(config.country);
            })
            .catch(console.log);
    }

    changeCountry(config) {
        console.log(config);
        this.polygonSeries.mapPolygons._values.map(el => el.setAll({
            fill: this.config.countryStyle.fill,
            tooltipText: `${name}`
        }));
        this.polygonSeries.getDataItemById(config.country)._settings.mapPolygon.setAll({
            fill: this.config.countryStyle.initial,
            tooltipText: `${name}`
        });
    }

    // clearEvents() {
    //     fetch('/clearEvents', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify({
    //             email: localStorage.getItem('email')
    //         })
    //     }).then(data => console.log(data.json()))
    //     this.polygonSeries.mapPolygons._values.map(el => el.setAll({
    //         clicked: false,
    //         fill: this.config.countryStyle.fill,
    //         tooltipText: '{name}'
    //     }));
    // }

    getCountryList() {
        return new Promise((resolve, reject) => {

            if(this.polygonSeries.allChildren()) return setTimeout(() => resolve(this.polygonSeries.allChildren()));
            return reject(new Error('In polygonSeries'));

        })
        .then(data => data.map(el => el.dataItem).filter(el => !!el))
        .then(data => data.map(el => el.dataContext).sort((a, b) => {
            if (a.name > b.name) return 1;
            if (a.name < b.name) return -1;
            return 0;
        })).catch(console.log);
    }

    setBackground(color) {

        this.backgroundSeries.mapPolygons.template.setAll({
            fill: color,
            stroke: color
        });
        this.backgroundSeries.data.push({
            geometry: am5map.getGeoRectangle(90, 180, -90, -180)
        });

    }

}