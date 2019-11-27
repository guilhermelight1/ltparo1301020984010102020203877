/* Author(s) = 
 * Date: 2014 Nov
 */
d3.csv("js/data.csv", function(error, datos) {
    var years = new Array("2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019");
    window.onload = search();
    var dispositivo;
    var trimestres = new Array(
	'2019TIV', '2019TIII', '2019TII', '2019TI',	'2018TIV', '2018TIII', '2018TII', '2018TI',	'2017TIV', '2017TIII', '2017TII', '2017TI',	'2016TIV', '2016TIII', '2016TII', '2016TI',	'2015TIV', '2015TIII', '2015TII', '2015TI',	'2014TIV', '2014TIII', '2014TII', '2014TI',
	'2013TIV', '2013TIII', '2013TII', '2013TI', '2012TIV', '2012TIII', '2012TII', '2012TI', '2011TIV', '2011TIII', '2011TII', '2011TI', '2010TIV', '2010TIII', '2010TII', '2010TI', '2009TIV', '2009TIII', '2009TII', '2009TI', '2008TIV', '2008TIII', '2008TII', '2008TI', '2007TIV', '2007TIII', '2007TII', '2007TI');
    trimestres.reverse();
    function addComas(n) {
        var formatValue = d3.format("0,000");
        return formatValue(n).replace('.', ',').replace('.', ',');
    }
    var div = d3.select("body")
            .append("div")
            .attr("class", "tooltip");
    function search() {
        var tipoDispositivo = navigator.userAgent.toLowerCase();
        if (tipoDispositivo.search(/iphone|ipod|ipad|android/) > -1) {
            dispositivo = "click";
        }
        else {
            dispositivo = "mouseover";
        }
    }


    function totalParo() {
        var paroData = new Array();
        var agriculturaData = new Array();
        var industriaData = new Array();
        var construccionData = new Array();
        var serviciosData = new Array();
        var sinAnt = new Array();
        for (var i = 0; i < datos.length; i++) {
            agriculturaData[i] = +datos[i].EXP;
            industriaData[i] = +datos[i].IMP;
    

            paroData[i] = +datos[i].Total;

        }
        currentYear = datos[datos.length - 1].year;
        currentMonth = datos[datos.length - 1].mes;
        numeroMes = 0;
        for (var i = 0; i < nombreMeses.length; i++) {
            if (currentMonth == datos[i].mes) {
                numeroMes = i;
            }
        }

        var datosParo = new Array();
        var fecha = new Date(2007, 0, 1);
        var cont = 0;
        for (i = 0; i < paroData.length; i++) {
            if (cont > 11) {
                cont = 0;
            }
            datosParo.push({"fecha": new Date(fecha.getFullYear(), fecha.getMonth() + i, 1), "mes": nombreMeses[cont], "Total": paroData[i], "IMP": industriaData[i], "EXP": agriculturaData[i]});
            cont++;
        }
        return datosParo;
    }


    var nombreMeses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    var datosParo = totalParo();
    var ultimaPosicion = datosParo[datosParo.length - 1];
    function addPuntos(numero) {
        var formatValue = d3.format("0,000");
        return formatValue(numero).replace(',', '.').replace(',', '.');
    }

    var height = 300, width = 950, trans = 60;
    var w = 980, h = 360;
    /* ------------------------------------------ */
    var contenedorSvg = d3.select("#contenedorGrafico").append("svg")
            .attr("width", w)
            .attr("height", h);
//Ponemos en la escala las funciones que determinen el tamaÃ±o del rango
    var escalaX = d3.time.scale()
            .domain([new Date(2007, 0, 1), new Date(currentYear, numeroMes, 1)])
            .range([0, width]);
    var escalaY = d3.scale.linear()
            .domain([0, d3.max(datosParo, function(d) {
                    return d.Total;
                })])
            .range([height, 10]);
    var ejeY = d3.svg.axis()
            .scale(escalaY)
            .orient("left")
            .ticks(4)
            .tickFormat(function(d) {
                return addPuntos(d);
            });

    var ejeX = d3.svg.axis()
            .scale(escalaX)
            .orient("bottom")
            .ticks(15);
    var area = d3.svg.area()
            .x(function(d) {
                return escalaX(d.fecha);
            })
            .y0(height)
            .y1(function(d) {
                return escalaY(d.Total);
            })
            .interpolate("linear");
    var funcionLinea = d3.svg.line()
            .x(function(d) {
                return escalaX(d.fecha);
            })
            .y(function(d) {
                return escalaY(d.Total);
            })
            .interpolate("linear");
    var dibujaLinea = contenedorSvg.append("path")
            .attr("d", funcionLinea(datosParo))
            .attr("stroke", "steelblue")
            .attr("stroke-width", 4)
            .attr("fill", "none")
            .attr("transform", "translate(" + trans + ",0)");
    contenedorSvg.append("path")
            .datum(datosParo)
            .attr("class", "area")
            .attr("d", area)
            .attr("transform", "translate(" + trans + ",0)");
    contenedorSvg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + trans + "," + height + ")")
            .call(ejeX)
            .attr("pointer-events", "none");
    contenedorSvg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + trans + ",0)")
            .call(ejeY)
            .attr("pointer-events", "none"); //grid
    contenedorSvg.append("g")
            .attr("class", "grid")
            .attr("stroke", "black")
            .attr("stroke-width", 0.5)
            .attr("opacity", 0.3)
            .attr("transform", "translate(" + trans + "," + height + ")")
            .call(ejeX.tickSize(-320, 0, 0).tickFormat(""));
    contenedorSvg.append("g")
            .attr("class", "grid")
            .attr("stroke", "black")
            .attr("stroke-width", 0.5)
            .attr("opacity", 0.3)
            .call(ejeY.tickSize(-width, 0, 0).tickFormat(""))
            .attr("transform", "translate(" + trans + ",0)");
    contenedorSvg.selectAll("rect")
            .data(datosParo)
            .enter()
            .append("rect")
            .attr("x", function(d) {
                return escalaX(d.fecha);
            })
            .attr("y", 0)
            .attr("height", height)
            .attr("width", 10)
            .attr("transform", "translate(" + 57 + ",0)")
            .attr("opacity", 0)
            .on(dispositivo, function(d) {
                d3.select(this)
                        .call(remove);
                var centroX = escalaX(d.fecha);
                var centroY = escalaY(d.Total);
                /* contenedorSvg.append("line")
                 .attr("x1", 0)
                 .attr("y1", centroY)
                 .attr("x2", width)
                 .attr("y2", centroY)
                 .attr("stroke-width", 1)
                 .attr("stroke", "steelblue")
                 .attr("transform", "translate(" + trans + ",0)")
                 .attr("id", "linea1")
                 .attr("pointer-events", "none");
                 contenedorSvg.append("line")
                 .attr("x1", centroX)
                 .attr("y1", height)
                 .attr("x2", centroX)
                 .attr("y2", 10)
                 .attr("stroke-width", 1)
                 .attr("stroke", "steelblue")
                 .attr("transform", "translate(" + trans + ",0)")
                 .attr("id", "linea2")
                 .attr("pointer-events", "none"); */
                contenedorSvg.append("circle")
                        .attr("cx", centroX)
                        .attr("cy", centroY)
                        .attr("r", 6)
                        .attr("id", "circulo")
                        .attr("transform", "translate(" + trans + ",0)")
                        .attr("fill", "#A44E35");
                div.style("opacity", .9);
                div.style("left", function() {
                    return d3.event.pageX > (w - 170) ? (d3.event.pageX - 160) + "px" : (d3.event.pageX + 20) + "px";
                })
                        .style("top", centroY + 110 + "px")
                        .html(function() {
                            return  "<div>" + d.mes + " " + d.fecha.getFullYear() + "</div>" + addPuntos(d.Total) + " kg";
                        });
                d3.select('#donut', update(d));
                d3.select('#barras', update(d));
                totValue.text(function() {
                    return addPuntos(d.Total);
                });
            })
            .on("mouseout", function() {
                return div
                        .style("opacity", 0);
            });
    d3.selectAll(".axis line").remove();
    function remove() {
        var linea1 = document.getElementById("linea1");
        var linea2 = document.getElementById("linea2");
        var circulo = document.getElementById("circulo");
        var circuloIn = document.getElementById("circuloIn");
        if (circulo) {
            var madre = circulo.parentNode;
            madre.removeChild(circulo);
        }
        if (circuloIn) {
            var madre = circuloIn.parentNode;
            madre.removeChild(circuloIn);
        }
        if (linea1 && linea2) {
            var padre = linea1.parentNode;
            padre.removeChild(linea1);
            padre.removeChild(linea2);
        }
    }
////-----//////---/////////-----/////////----//////////-----///////----////////----/////-----/////////-----/////---///------////---/////
    /*var barras = new Array();
     for (i = 0; i < datosParo.length; i++) {
     if (datosParo[i].mes === select.value) {
     barras.push({"fecha": datosParo[i].fecha, "mes": datosParo[i].mes, "Total": datosParo[i].Total});
     }
     } */
    var svg = d3.select("#barras").append("svg")
            .attr("width", 1000)
            .attr("height", 230)
            .attr("class", "barr")
			
            .append("g");
//var x0 = d3.scaleBand()
   // .rangeRound([0, width])
//.padding(0.5);			
			
    var x = d3.scale.linear()
            .domain([2007, 2019])
            .range([10, 400]);
    var y = d3.scale.linear()
            .domain([0, 60000]) // em Millones // divididos por anos
            .range([0, 4]);
    var yBarras = d3.scale.linear()
            .domain([0, 6000000])
            .range([220, 5]);
    var ejeXBarras = d3.svg.axis()
            .scale(x);

    var ejeYBarras = d3.svg.axis()
            .orient("left")
            .scale(yBarras)
            .ticks(5);
    /* var xAxisGroupBarras = svg.append("g")
     .attr("class", "axis")
     .attr("transform", "translate(3,210.5)")
     .call(ejeXBarras); */
    svg.selectAll(".xLabel")
            .data(x.ticks(10))
            .enter().append("svg:text")
            .attr("class", "xLabel")
            .text(function(d, i) {
                return years[i];
            })
            .attr("x", function(d) {
                return x(d) - 7;
            })
            .attr("y", 230);
    var lineas = [-5, 25, 55, 85, 115, 145, 175, 210];
    for (i = 0; i < lineas.length; i++) {
        svg.append("g")
                .attr("class", "grid")
                .append("line")
                .attr("x1", -10)
                .attr("y1", lineas[i])
                .attr("x2", 410)
                .attr("y2", lineas[i])
                .attr("transform", "translate(" + 10 + ",0)")
                .attr("pointer-events", "none");
    }
    var vis = d3.select("#donut")
            .append("svg")
            .attr("width", 520)
            .attr("height", 230)
            .append("svg:g")
            .attr("transform", "translate(" + 270 + "," + 120 + ")");
    vis.append("g")
            .attr("class", "slices");
    vis.append("g")
            .attr("class", "labels");
    vis.append("g")
            .attr("class", "lines");
    var radius = 135;
    var radius2 = 120;
    var pie = d3.layout.pie()
            .sort(null)
            .value(function(d) {
                return d.value;
            });
    var arc = d3.svg.arc()
            .outerRadius(radius * 0.8)
            .innerRadius(radius * 0.4);
    var outArc = d3.svg.arc()
            .innerRadius(radius * 0.85)
            .outerRadius(radius * 0.85);
    var c_group = vis.append("svg:g")
            .attr("class", "c_group");
    var c_Circle = c_group.append("svg:circle")
            .attr("fill", "white")
            .attr("r", radius * 0.4);
    var totLabel = c_group.append("svg:text")
            .attr("class", "label")
            .attr("dy", -15)
            .attr("text-anchor", "middle")
            .text("TOTAL");
    var totValue = c_group.append("svg:text")
            .attr("class", "total")
            .attr("dy", 7)
            .attr("text-anchor", "middle")
            .text(function() {
                return addPuntos(ultimaPosicion.Total);
            });
    var totalUnits = c_group.append("svg:text")
            .attr("class", "units")
            .attr("dy", 21)
            .attr("text-anchor", "middle") // text-align: right
            .text("kg");
////-----//////---/////////-----/////////----//////////-----///////----////////----/////-----/////////-----/////---///------////---/////
    contenedorSvg
            .append("circle")
            .attr("cx", escalaX(ultimaPosicion.fecha))
            .attr("cy", escalaY(ultimaPosicion.Total))
            .attr("r", 6)
            .attr("id", "circuloIn")
            .attr("fill", "#A44E35")
            .attr("transform", "translate(" + trans + ",-1)");
    div
            .style("opacity", .9)
            .style("left", escalaX(ultimaPosicion.fecha) - 90 + "px")
            .style("top", escalaY(ultimaPosicion.Total) + 110 + "px")
            .html(function() {
                return  "<div>" + datosParo[datosParo.length - 1].mes + " " + datosParo[datosParo.length - 1].fecha.getFullYear() + "</div>" + addPuntos(datosParo[datosParo.length - 1].Total) + " kg";
            });
    function update(d) {
        var barras = new Array();
        for (i = 0; i < datosParo.length; i++) {
            if (datosParo[i].mes === d || datosParo[i].mes === d.mes) {
                barras.push({"fecha": datosParo[i].fecha, "mes": datosParo[i].mes, "Total": datosParo[i].Total});
            }
        }
        var bars = svg.selectAll("rect")
                .data(barras);
        bars
                .enter()
                .append("rect")
                .attr("transform", "translate(17,-15)")
                .attr("width", "0");
        bars
                .exit()
                .transition()
                .duration(300)
                .attr("transform", "translate(30,-15)")
                .attr("width", 0)
                .remove();
        bars
                .transition()
                .duration(300)
                .attr("transform", "translate(-10,-15)")
                .attr("fill", "#5295C5")
                .attr("x", function(d) {
                    return x(d.fecha.getFullYear());
                })
                .attr("y", function(d) {
                    return 230 - y(d.Total);
                })
                .attr("width", 35)
                .attr("height", function(d) {
                    return y(d.Total);
                })
                .attr("value", function(d) {
                    return d.Total;
                })
                .text(function(d) {
                    return d.mes;
                });
        bars
                .on(dispositivo, function(d) {
                    d3.select(this)
                            .attr('fill', "#5295C5");
                    div.style("opacity", 1)
                            .style("left", 540 + "px")
                            .style("top", 565 + "px")
                            .html(function() {
                                return  "<div>Ano:  " + d.fecha.getFullYear() + "</div>" + addPuntos(d.Total) + " kg";
                            });
                })
                .on('mouseout', function() {
                    d3.select(this)
                            .attr('fill', "#5295C5");
                });
        var textBar = svg.selectAll(".textBar")
                .data(barras);
        textBar
                .enter()
                .append("text")
                .attr("class", "textBar")
                .attr("transform", "translate(7,15)")
                .attr("opacity", 0)
                .attr("pointer-events", "none")
                .attr("text-anchor", "middle");
        textBar.exit()
                .transition()
                .duration(120)
                .remove();
        textBar
                .transition()
                .duration(400)
                .attr("opacity", 1)
                .text(function(d, i) {
                    var format = String(d.Total / 1000000);
                    return format.substring(0, 4);
                })
                .attr({
                    x: function(d) {
                        return x(d.fecha.getFullYear());
                    },
                    y: function(d) {
                        return 220 - y(d.Total);
                    }
                })
                .attr("font-size", "12px")
                .attr("dy", "-25");
////-----//////---/////////-----/////////----//////////-----///////----////////----/////-----/////////-----/////---///------////---/////
        var fecha = d.mes + " de " + d.fecha.getFullYear();
        var total = d.Total;
        var color = d3.scale.linear().range(["#d0d1e6", "#a6bddb", "#74a9cf", "#045a8d", "#2b8cbe"]);
        var data = [
            {"label": "Import", "value": d.IMP},
            {"label": "Export", "value": d.EXP}
        ];
        var key = function(d) {
            return d.data.label;
        };
        var slice = vis.select(".slices").selectAll("path.slice")
                .data(pie(data), key);
        slice.enter()
                .insert("path")
                .attr("fill", function(d, i) {
                    return color(i);
                })
                .attr("id", function(d, i) {
                    return "id_" + i;
                })
                .attr("class", "slice");
        slice
                .transition().duration(300)
                .attrTween("d", function(d) {
                    this._current = this._current || d;
                    var interpolate = d3.interpolate(this._current, d);
                    this._current = interpolate(0);
                    return function(t) {
                        return arc(interpolate(t));
                    };
                });
        slice
                .on(dispositivo, function() {
                    d3.select(this)
                            .attr("opacity", 0.8);
                    var z = this.getAttribute("id");
                    var id = z.substring(z.length - 1, z.length);
                    totValue.text(function() {
                        return addPuntos(data[id].value);
                    });
                    totLabel.text(function() {

                        return data[id].label.toUpperCase();
                    });
                })
                .on('mouseout', function() {
                    d3.select(this)
                            .attr("opacity", 1);
                    var z = this.getAttribute("id");
                    var id = z.substring(z.length - 1, z.length);
                    totValue.text(function() {
                        return addPuntos(total);
                    });
                    totLabel.text("TOTAL");
                    ;
                });
        c_group.on(dispositivo, function() {
            vis.select(".slices").selectAll("path.slice")
                    .attr("opacity", 1);
            totLabel.text("TOTAL");
            totValue.text(function() {
                return addPuntos(d.Total);
            });
        });
        slice.exit()
                .remove();
        /* ------- TEXT LABELS -------*/
        var text = vis.select(".labels").selectAll("text")
                .data(pie(data), key);
        text.enter()
                .append("text")
                .attr("fill", "#777")
                .attr("dy", ".35em");
        text
                .text(function(d) {
                    return d.data.label + " | " + d3.round((d.data.value * 100) / total, 1) + "%";
                });
        function midAngle(d) {
            return d.startAngle + (d.endAngle - d.startAngle) / 2;
        }

        text.transition().duration(300)
                .attrTween("transform", function(d) {
                    this._current = this._current || d;
                    var interpolate = d3.interpolate(this._current, d);
                    this._current = interpolate(0);
                    return function(t) {
                        var d2 = interpolate(t);
                        var pos = outArc.centroid(d2);
                        pos[0] = radius2 * (midAngle(d2) < Math.PI ? 1 : -1);
                        return "translate(" + pos + ")";
                    };
                })
                .styleTween("text-anchor", function(d) {
                    this._current = this._current || d;
                    var interpolate = d3.interpolate(this._current, d);
                    this._current = interpolate(0);
                    return function(t) {
                        var d2 = interpolate(t);
                        return midAngle(d2) < Math.PI ? "start" : "end";
                    };
                });
        text.exit()
                .remove();
        /* ------- SLICE TO TEXT POLYLINES -------*/

        var polyline = vis.select(".lines").selectAll("polyline")
                .data(pie(data), key);
        polyline.enter()
                .append("polyline")
                .attr("pointer-events", "none");
        polyline.transition().duration(300)
                .attrTween("points", function(d) {
                    this._current = this._current || d;
                    var interpolate = d3.interpolate(this._current, d);
                    this._current = interpolate(0);
                    return function(t) {
                        var d2 = interpolate(t);
                        var pos = outArc.centroid(d2);
                        pos[0] = radius2 * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
                        return [arc.centroid(d2), outArc.centroid(d2), pos];
                    };
                });
        polyline.exit()
                .remove();
        document.getElementById('mes').innerHTML = fecha;
        document.getElementById('mesBar').innerHTML = d.mes;
    }
    document.getElementById("rangoFechas").innerHTML = "EVOLUÇÃO DE MOVIMENTAÇÃO | DOMÉSTICO<br>" + datosParo[0].mes + " de " + datosParo[0].fecha.getFullYear() + " - " + datosParo[datosParo.length - 1].mes + " de " + ultimaPosicion.fecha.getFullYear() + "";
    update(ultimaPosicion);
});