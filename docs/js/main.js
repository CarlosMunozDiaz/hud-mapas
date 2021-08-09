//Variables globales
let mymap;
let svg, g, lines;
let currentCity = 'Asuncion';
let currentFlyTo = true;
let mapWidth = document.getElementById('buenosAiresMap').clientWidth;
let mapHeight = document.getElementById('buenosAiresMap').clientHeight;

let currentBtn = 'btnZonasVerdesBA', currentLegend = 'ldZonasVerdesBA';

//Por defecto, zonas verdes de Buenos Aires
updateMap('buenos_aires_overcrowd');

document.getElementById('BtnZonasVerdesBA').addEventListener('click', function () {
    if(currentBtn != 'btnZonasVerdesBA') {
        //Cambio variables
        currentBtn = 'btnZonasVerdesBA';
        currentLegend ='ldZonasVerdesBA';

        //Ejecución funciones
        setBtn(currentBtn);
        setLegend(currentLegend);
        updateMap('buenos_aires_overcrowd');
    }    
});

document.getElementById('btnCallesBA').addEventListener('click', function () {
    if(currentBtn != 'btnCallesBA') {
        //Cambio variables
        currentBtn = 'btnCallesBA';
        currentLegend ='ldCallesBA';

        //Ejecución funciones
        setBtn(currentBtn);
        setLegend(currentLegend);
        updateMap('buenos_aires_roads');
    }
});

document.getElementById('layers').addEventListener('change', function(e) {
    changeLayer(e.target.value);
});

//Funciones
function updateMap(ciudad_tipo) {

}

function changeLayer(layer) {
    if(layer == 'carto') {
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            //attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 19
        }).addTo(mymap);
    } else if (layer == 'carto-v') {
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png', {
            //attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 19
        }).addTo(mymap);
    } else if (layer == 'stamen') {
        L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.{ext}', {
            attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            subdomains: 'abcd',
            minZoom: 0,
            maxZoom: 20,
            ext: 'png'
        }).addTo(mymap);
    } else {
        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
            //attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
        }).addTo(mymap);
    }   
}