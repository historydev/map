export class App {

    constructor(config) {

        this.root = am5.Root.new(config.element);
        this.chart = this.root.container.children.push(
            am5map.MapChart.new(this.root, {
                panX: "rotateX",
                panY: "rotateY",
                projection: am5map.geoOrthographic()
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
            tooltip: this.tooltip
        });

        this.polygonSeries.mapPolygons.template.states.create("click", {
            fill: '#fff'
        });

        this.polygonSeries.mapPolygons.template.events.on("click", (e) => {
            // const dataItem = e.target.dataItem;
            // const data = dataItem.dataContext;
            // const zoomAnimation = polygonSeries.zoomToDataItem(dataItem);

            e.target._settings.clicked = !e.target._settings.clicked;

            if(e.target._settings.clicked) {
                e.target.states.applyAnimate("click");
            } else {
                e.target.states.applyAnimate("default");
            }

        });

    }

    setEvent(config) {
        const name = this.polygonSeries.getDataItemById(config.country)._settings.mapPolygon._settings.tooltipText;
        this.polygonSeries.getDataItemById(config.country)._settings.mapPolygon.setAll({
            fill: 'red',
            date: config.date,
            tooltipText: `${name} ${config.date}`
        });
    }

    async getCountryList() {
        return new Promise((resolve, reject) => {

            if(this.polygonSeries.allChildren()) return setTimeout(() => resolve(this.polygonSeries.allChildren(), 1000));
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