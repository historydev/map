let root = am5.Root.new("chartdiv");
let chart = root.container.children.push(
    am5map.MapChart.new(root, {
        panX: "rotateX",
        panY: "rotateY",
        projection: am5map.geoOrthographic()
    })
);

const backgroundSeries = chart.series.unshift(
    am5map.MapPolygonSeries.new(root, {})
);

backgroundSeries.mapPolygons.template.setAll({
    fill: 'rgb(0, 160, 224)',
    stroke: 'rgb(0, 160, 224)'
});

backgroundSeries.data.push({
    geometry: am5map.getGeoRectangle(90, 180, -90, -180)
});

const countryList = [];

for(let key in am5geodata_data_countries2) {
    countryList.push(am5geodata_data_countries2[key]);
}

document.querySelector('#country').innerHTML = countryList.map(el => `<option>${el.country}</option>`).join('');

let polygonSeries = chart.series.push(
    am5map.MapPolygonSeries.new(root, {
        geoJSON: am5geodata_worldLow,
        fill: 'rgb(255, 192, 96)',
        stroke: 'rgb(0, 160, 224)'
    })
);

polygonSeries.mapPolygons.template.setAll({
    tooltipText: "{name}",
    interactive: true
});

polygonSeries.mapPolygons.template.states.create("hover", {
    fill: am5.color(0x677935)
});

polygonSeries.mapPolygons.template.events.on("click", (e) => {
    const dataItem = e.target.dataItem;
    const data = dataItem.dataContext;
    const zoomAnimation = polygonSeries.zoomToDataItem(dataItem);
});