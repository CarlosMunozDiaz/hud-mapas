window.fetch('https://raw.githubusercontent.com/CarlosMunozDiaz/hud-mapas/main/docs/data/buenos_pop_overcrowd_geo.json')
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        //Características del mapa
        let mymap = L.map('leaflet').setView([-34.6158037, -58.5033387], 12);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(mymap);

        L.geoJson(data).addTo(mymap);
    });