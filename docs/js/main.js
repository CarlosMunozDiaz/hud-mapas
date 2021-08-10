//Variables globales
let mymap;
let svg, g, lines;
let currentBtn = 'btnZonasVerdesBA', currentLegend = 'ldZonasVerdesBA';
let dataOvercrowdBA, dataDistanceBA;

initData();

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

//Funciones del mapa
function initData() {
    //Dejamos pintado el mapa por defecto
    window.fetch('https://raw.githubusercontent.com/CarlosMunozDiaz/hud-mapas/main/docs/data/buenos_pop_overcrowd.json')
        .then(function(response) {
            return response.json();
        })
        .then(function(response) {
            dataOvercrowdBA = response;
            mymap = L.map('leaflet').setView([-34.6158037, -58.5033387], 10);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(mymap);

            L.svg({clickable:true}).addTo(mymap);

            svg = d3.select("#leaflet")
                .select("svg")
                .attr("pointer-events", "auto");
                
            g = svg.select("g");

            let transform = d3.geoTransform({point: projectPoint});
            let path = d3.geoPath().projection(transform);

            let data = topojson.feature(dataOvercrowdBA, dataOvercrowdBA.objects['buenos_pop_overcrowd']);            

            let lines = g.selectAll("path")
                .data(data.features)
                .enter()
                .append("path")
                .attr("d", path)
                .attr("fill", "green")
                .attr("fill-opacity", '1');

            mymap.on('viewreset', reset);
            mymap.on('zoomend', reset);

            function reset(){
                lines.attr("d", path);
            }
        });

    //Cargamos los datos pesados (tras pintar el mapa y por debajo)
    window.fetch('https://raw.githubusercontent.com/CarlosMunozDiaz/hud-mapas/main/docs/data/buenos_roads_distance.json')
        .then(function(response) {
            return response.json();
        })
        .then(function(response) {
            dataDistanceBA = response;
        });
}

function updateMap(tipo) {
    console.log(tipo);
    if(tipo == 'buenos_pop_overcrowd') {

    } else {

    }
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
    if (layer == 'open-street') {
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(mymap);
    } else if (layer == 'carto') {
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