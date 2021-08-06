let tooltip = d3.select('#chartTooltip');

//Variables para colores
let one_color = '#005578';
let two_colors_first = '#FFB612', two_colors_second = '#005578';
let three_colors_first = '#FFB612', three_colors_second = '#005578', three_colors_third = '#9B918B';
let more_colors_first = '#FFB612', more_colors_second = '#7B96AA', more_colors_third = '#005578', more_colors_fourth = '#9B918B', more_colors_fifth = '#5F5C59';

function getFirstChart() {
    //Bloque de la visualización
    let chartBlock = d3.select('#chart-first');

    //Lectura de datos
    let driveFile = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTwwEw1toOPxVQ_DRPCMC5Xd_eW_kmhGQrtm9pJ5P2Ja8auGT-ITZ1772aiNHAZKI-0P0Nq8GopCyOV/pub?gid=878098539&single=true&output=csv';
    let localFile = './data/chart-one.csv';
    d3.csv(driveFile, function(d) {
        return {
            tipo: d.tipo,
            tipo_eje: d.tipo_eje,
            porcentaje: +d['porcentaje'].replace(/,/g, '.') * 100
        }
    }, function(error, data) {
        if (error) throw error;

        //Creación del elemento SVG en el contenedor
        let margin = {top: 5, right: 5, bottom: 25, left: 110};
        let {width, height, chart} = setChart(chartBlock, margin);

        //Disposición del eje X
        let x = d3.scaleLinear()
            .domain(d3.extent(data, function(d) { return d.porcentaje; }))
            .range([0, width])
            .nice();

        //Estilos para eje X
        let xAxis = function(g){
            g.call(d3.axisBottom(x).ticks(6).tickFormat(function(d) { return d + '%'; }))
            g.call(function(g){
                g.selectAll('.tick line')
                    .attr('class', function(d,i) {
                        if (d == 0) {
                            return 'line-special';
                        }
                    })
                    .attr('y1', '0%')
                    .attr('y2', `-${height}`)
            })
            g.call(function(g){g.select('.domain').remove()});
        }

        //Inicialización eje X
        chart.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        //Disposición del eje Y
        let y = d3.scaleBand()
            .domain(data.map(function(d) { return d.tipo_eje + '-' + d.tipo; }))
            .range([height, 0]);

        let yAxis = function(svg){
            svg.call(d3.axisLeft(y).tickFormat(function(d) { return d.split('-')[0]; }))
            svg.call(function(g){g.selectAll('.tick line').remove()})
            svg.call(function(g){g.select('.domain').remove()})
            svg.call(function(g){g.selectAll('.tick text').style('cursor','default')})
            svg.call(function(g){g.selectAll('.tick text').on('mouseenter mousedown mousemove mouseover', function(d) {
                //Texto tooltip
                let html = `<p class="chart__tooltip--title">${d.split('-')[1]}</p>`;                
                tooltip.html(html);

                //Tooltip
                positionTooltip(window.event, tooltip);
                getInTooltip(tooltip);
            })})
            svg.call(function(g){g.selectAll('.tick text').on('mouseleave', function(d) { 
                //Quitamos el tooltip
                getOutTooltip(tooltip); 
            })});
        }        
        
        chart.append("g")
            .call(yAxis)
            .selectAll('.tick text')
            .call(wrap, 130);

        //Visualización de datos
        window.addEventListener('scroll', function() {
            if (!chartBlock.node().classList.contains('visible')){
                if(isElementInViewport(chartBlock.node())){
                    chartBlock.node().classList.add('visible');
                    initChart();
                }                
            }
        });

        function initChart() {
            chart.selectAll(".bar")
                .data(data)
                .enter()
                .append("rect")
                .attr('class', function(d, i) { return `bar bar-${i}`; })
                .style('fill', one_color)
                .attr("x", function (d) {
                    return x(0);
                })
                .attr("y", function (d) {
                    return y(d.tipo_eje + '-' + d.tipo) + y.bandwidth() / 4;
                })            
                .attr("height", y.bandwidth() / 2)
                .on('mouseenter mousedown mousemove mouseover', function(d, i, e) {
                    let css = e[i].getAttribute('class').split('-')[1];
                    //Texto
                    let html = `<p class="chart__tooltip--title">${d.tipo}</p>
                                <p class="chart__tooltip--text">${numberWithCommas(d.porcentaje.toFixed(2))}%</p>`; //Solucionar recogida de información

                    tooltip.html(html);

                    //Posibilidad visualización línea diferente
                    let bars = chartBlock.selectAll('.bar');
                    
                    bars.each(function() {
                        this.style.opacity = '0.4';
                        if(this.getAttribute('class').indexOf(`bar-${css}`) != -1) {
                            this.style.opacity = '1';
                        }
                    });

                    //Tooltip
                    positionTooltip(window.event, tooltip);
                    getInTooltip(tooltip);
                })
                .on('mouseout', function(d, i, e) {
                    //Quitamos los estilos de la línea
                    let bars = chartBlock.selectAll('.bar');
                    bars.each(function() {
                        this.style.opacity = '1';
                    });

                    //Quitamos el tooltip
                    getOutTooltip(tooltip); 
                })
                .transition()
                .duration(3000)
                .attr("x", function (d) {
                    return x(Math.min(0, d.porcentaje));
                })
                .attr("width", function (d) {
                    return Math.abs(x(d.porcentaje) - x(0));
                });
        }                   
    });
}

function getSecondChart() {

}

function getThirdChart() {

}

getFirstChart();
getSecondChart();
getThirdChart();
/* Visualization helpers */
function wrap(text, width) {
    text.each(function() {
        var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1, // ems
            y = text.attr("y"),
            dy = words.length <= 3 ? parseFloat(text.attr("dy")) : 0,
            tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");

        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
            }
        }
    });
};

function isElementInViewport(ele) {
    const { top, bottom } = ele.getBoundingClientRect();
    const vHeight = (window.innerHeight || document.documentElement.clientHeight);
    
    return ( 
        (top > 0 || bottom > 0) && bottom < vHeight
    );
};

// PRUEBA SCROLL PARA INICIAR ANIMACIÓN CUANDO ENTRE
let charts = document.getElementsByClassName('chart__viz');

/* Inicialización del gráfico */
function setChart(chartBlock, margin) {
    let width = parseInt(chartBlock.style('width')) - margin.left - margin.right,
    height = parseInt(chartBlock.style('height')) - margin.top - margin.bottom;

    let chart = chartBlock
        .append('svg')
        .lower()
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    return {margin, width, height, chart};
}

function numberWithCommas(x) {
    //return x.toString().replace(/\./g, ',').replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ".");
    return x.toString().replace(/\./g, ',');
}

function setOpacitySwitch(id, state) {
    let elem = document.getElementById(id);
    
    if (state == true) {
        elem.previousElementSibling.style.opacity = 0.25;
        elem.nextElementSibling.style.opacity = 1;
    } else {
        elem.nextElementSibling.style.opacity = 0.25;
        elem.previousElementSibling.style.opacity = 1;
    }
}