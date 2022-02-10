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

        this.addEventArr = [];

    }

    setEventOnCountry(modal, f) {
            this.polygonSeries.mapPolygons.template.events.on("click", (e) => {
                const dataItem = e.target.dataItem;
                const data = dataItem.dataContext;
                //const zoomAnimation = this.polygonSeries.zoomToDataItem(dataItem);

                this.chart.zoomToGeoPoint({ longitude: 10, latitude: 52 }, 1, false);

                e.target._settings.clicked = !e.target._settings.clicked;

                if(e.target._settings.clicked) {
                    modal.style.display = 'flex';
                    const centroid = e.target.geoCentroid();
                    if (centroid) {
                        this.chart.animate({ key: "rotationX", to: -centroid.longitude, duration: 1500, easing: am5.ease.inOut(am5.ease.cubic) });
                        this.chart.animate({ key: "rotationY", to: -centroid.latitude, duration: 1500, easing: am5.ease.inOut(am5.ease.cubic) });
                    }
                    f(this.config.countryStyle.fillActive, data.id, data.name);
                } else {
                    this.setEvent({
                        fill: this.config.countryStyle.fill,
                        country: data.id,
                        fullName: '',
                        date: ''
                    });
                }

            });
    }

    loadSavedData(data) {
        setTimeout(() => {
            if(data) {
                this.addEvent(data);
                this.polygonSeries.getDataItemById(data.name)._settings.mapPolygon.setAll({
                    fill: data.fill,
                    date: data.date,
                    tooltipText: data.tooltipText
                });
            }
        })
        return data
    }

    addEvent(data) {
        const event = document.querySelector('.event');
        if(data) {
            if(!this.addEventArr.find(el => el.date === data.date)) this.addEventArr.push(data);
            event.querySelector('.title').innerText = data.fullName;
            event.querySelector('.dateslist').innerHTML =
                this.addEventArr.filter(el => el.name === data.name).map((el, i) => {
                    return `<div class="dateItem">${el.date.replace(',', ' - ')}<button class="removeDate" title="remove">X</button></div>`
                }).join('');
            event.querySelectorAll('.dateItem .removeDate').forEach((el, i) => {
                this.removeEvent(data, i);
            });
        }
    }

    removeEvent(event, i) {
        document.querySelectorAll('.event .dateItem .removeDate')[i].onclick = () => {
            const index = this.addEventArr.findIndex(ev => ev.date === event.date);
            if(index >= 0) {
                this.addEventArr.splice(index, 1);
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
                    if(data.events.length) return data.events.forEach(el => this.loadSavedData(el));
                    document.querySelector('.event .dateslist').innerHTML = '';
                }).catch(console.log);
                //window.location.reload()
            }
        }
    }

    setEvent(config) {
        const name = this.polygonSeries.getDataItemById(config.country).dataContext.name;

        fetch('/setEvent', {
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
            .then(data => data.events.forEach(el => this.loadSavedData(el)))
            .catch(console.log);

        const centroid = this.polygonSeries.getDataItemById(config.country)._settings.mapPolygon.geoCentroid();
        if (centroid) {
            this.chart.animate({ key: "rotationX", to: -centroid.longitude, duration: 1500, easing: am5.ease.inOut(am5.ease.cubic) });
            this.chart.animate({ key: "rotationY", to: -centroid.latitude, duration: 1500, easing: am5.ease.inOut(am5.ease.cubic) });
        }

        return this.polygonSeries.getDataItemById(config.country)._settings.mapPolygon.setAll({
            fill: config.fill || this.config.countryStyle.fillActive,
            date: config.date,
            tooltipText: `${name}`
        });

    }

    clearEvents() {
        fetch('/clearEvents', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: localStorage.getItem('email')
            })
        }).then(data => console.log(data.json()))
        this.polygonSeries.mapPolygons._values.map(el => el.setAll({
            clicked: false,
            fill: this.config.countryStyle.fill,
            tooltipText: '{name}'
        }));
    }

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