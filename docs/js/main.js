//Variables globales
let mymap;
let svg, g, lines;
let currentCity = 'Asuncion';
let currentFlyTo = true;
let mapWidth = document.getElementById('buenosAiresMap').clientWidth;
let mapHeight = document.getElementById('buenosAiresMap').clientHeight;

let currentBtn = 'btnZonasVerdesBA', currentLegend = 'ldZonasVerdesBA';

//Por defecto, zonas verdes de Buenos Aires
createMap('buenos_pop_overcrowd');

document.getElementById('btnZonasVerdesBA').addEventListener('click', function () {
    if(currentBtn != 'btnZonasVerdesBA') {
        //Cambio variables
        currentBtn = 'btnZonasVerdesBA';
        currentLegend ='ldZonasVerdesBA';

        //Ejecución funciones
        setBtn(currentBtn);
        setLegend(currentLegend);
        updateMap('buenos_pop_overcrowd');
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
        updateMap('buenos_roads_distance');
    }
});

document.getElementById('layers').addEventListener('change', function(e) {
    changeLayer(e.target.value);
});

//Funciones
function createMap(ciudad_tipo) {
    //Llamada al GitHub
    Promise.all([
        window.fetch('https://raw.githubusercontent.com/CarlosMunozDiaz/hud-mapas/main/docs/data/ba_comunas_topo.json'),
        window.fetch('https://raw.githubusercontent.com/CarlosMunozDiaz/hud-mapas/main/docs/data/' + ciudad_tipo + '.json')
    ]).then(function([poligonos, dataVerde]) {
        console.log(poligonos.json());
        console.log(dataVerde.json());
            let prueba = [poligonos.json(), dataVerde.json()];
            return prueba;
        })
        .then(function(data) {
            console.log(data);
            //Características del mapa
            mymap = L.map('buenosAiresMap').setView([-34.6158037, -58.5033387], 11);

            // mymap.touchZoom.disable();
            // mymap.doubleClickZoom.disable();
            // mymap.scrollWheelZoom.disable();
            // mymap.boxZoom.disable();
            // mymap.keyboard.disable();

            L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
                subdomains: 'abcd',
                maxZoom: 22
            }).addTo(mymap);

            L.svg({clickable:true}).addTo(mymap);

            svg = d3.select("#buenosAiresMap")
                .select("svg")
                .attr("pointer-events", "auto");
                
            g = svg.select("g");

            let transform = d3.geoTransform({point: projectPoint});
            let path = d3.geoPath().projection(transform);

            let data2 = topojson.feature(data, data.objects['buenos_pop_overcrowd']);

            console.log(data2);

            let lines = g.selectAll("path")
                .data(data2.features)
                .enter()
                .append("path")
                .attr("d", path)
                .attr("fill", "red")
                .attr("fill-opacity", '1');

            mymap.on('viewreset', reset);
            mymap.on('zoomend', reset);

            function reset(){
                lines.attr("d", path);
            }
        });
}

function updateMap(ciudad_tipo) {
    //Llamada al GitHub
    window.fetch('https://raw.githubusercontent.com/CarlosMunozDiaz/hud-mapas/main/docs/data/' + ciudad_tipo + '.json')
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            let transform = d3.geoTransform({point: projectPoint});
            let path = d3.geoPath().projection(transform);

            let data2 = topojson.feature(data, data.objects[ciudad_tipo]);

            let lines = g.selectAll("path")
                .data(data2.features)
                .enter()
                .append("path")
                .attr("d", path)
                .attr("fill", '#228B22')
                .attr("fill-opacity", '1');

                mymap.on('viewreset', reset);
                mymap.on('zoom', reset);

            function reset(){
                lines
                    .data(data2.features)
                    .attr("d", path)
                    .attr("fill", '#228B22')
                    .attr("fill-opacity", '1');
            }
        });
}

function setBtn(btn) {
    let btns = document.getElementsByClassName('btn');
    for (let i = 0; i < btns.length; i++) {
        btns[i].classList.remove('active');
    }
    document.getElementById(btn).classList.add('active');
}

function setLegend(legend) {
    let legends = document.getElementsByClassName('legend');
    for (let i = 0; i < legends.length; i++) {
        legends[i].classList.remove('active');
    }
    document.getElementById(legend).classList.add('active');
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

/* Helpers */
function projectPoint(x, y) {
    let point = mymap.latLngToLayerPoint(new L.LatLng(y, x));
    this.stream.point(point.x, point.y);
}