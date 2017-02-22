var width = 900,
	height = 600;
var active = d3.select(null);
var nestedData;
var svg = d3.select("body")
			.append("svg")
			.attr("width", width)
			.attr("height", height);
var drawMap = function() {
	var projection = d3.geoConicConformal()
					.rotate([102, 0])
					.center([1, 20.85])
					//.parallels([17.5, 29.5])
					.scale(1200 * 14)
					.translate([width / 2, height / 2]);

	var path = d3.geoPath()
				.projection(projection);

	svg.append("rect")
		.attr("class", "background")
		.attr("width", width)
		.attr("height", height);
		//.on("click", reset);

	var g = svg.append("g")
				.style("stroke-width", "1.5px");
	//The used json is gtoFinal.json
	d3.json("jsons/twoProps.json", function(error, gto) {
		//Error handling
		if (error) return console.error(error);
		//Convert back to GeoJson 
		var cpMap = topojson.feature(gto, gto.objects.gtoMUN);
		//Draw the paths for the state and municipalities
		g.selectAll("path")
			.data(cpMap.features)
			.enter()
			.append("path")
			//Makes every path of the class "mun" for styling
			.attr("class", function(d) {
				return "mun";
			})
			//Make the id of the path the name of the municipality
			.attr("id", function(d){
					return d.id;
			})
			.attr("nombre", function(d){
				return d.properties.NOMBRE;
			})
			//Call function "clicked" when clicked
			.on("click", clicked)
			.attr("d", path);

		g.append("path")
			.datum(topojson.mesh(gto, gto.objects.gtoMUN, function(a, b) { return a !== b; }))
			.attr("class", "mesh")
			.attr("d", path);

		g.selectAll(".stateLabel")
			.data(cpMap.features)
			.enter().append("text")
			.attr("class", function(d) {
				//console.log(d.id); 
				return "munLabel";
			})
			.attr("id", function(d){
				return d.id;
			})
			.attr("transform", function(d) { 
				return "translate(" + path.centroid(d) + ")"; 
			})
			.attr("dy", function(d) { 
				if(d.id == "Purísima del Rincón" || d.id == "Valle de Santiago"){
					return "2em";
				}
				return "0em";

			})
			.attr("dx", function(d) { 
				return "-2em";
			})

			.text(function(d) { 
				if(d.properties.NOMBRE == "Dolores Hidalgo Cuna de la Independencia Nacional") {
					return "Dolores Hidalgo";
				}
				return d.properties.NOMBRE; });

			function clicked(d) {
				if (active.node() === this) return reset();
				active.classed("active", false);
				active = d3.select(this).classed("active", true);

				var bounds = path.bounds(d),
				dx = bounds[1][0] - bounds[0][0],
				dy = bounds[1][1] - bounds[0][1],
				x = (bounds[0][0] + bounds[1][0]) / 2,
				y = (bounds[0][1] + bounds[1][1]) / 2,
				scale = .9 / Math.max(dx / width, dy / height),
				translate = [width / 2 - scale * x, height / 2 - scale * y];

				g.transition()
					.duration(750)
					.style("stroke-width", 1.5 / scale + "px")
					.attr("transform", "translate(" + translate + ")scale(" + scale + ")");
			}

			function reset() {
				active.classed("active", false);
				active = d3.select(null);

				g.transition()
					.duration(750)
					.style("stroke-width", "1.5px")
					.attr("transform", "");
			}

			$(document).ready(function(){
				$(".mun").hover(function(){
					var thisid = this.id;
					//console.log(thisid);
					$(this).css({fill: "yellow"});
					$(this).siblings(".munLabel").hide();
					$(this).siblings("#"+thisid).show().css({fontSize: "25px"});
				}, function() {
					$(".munLabel").show().css({fontSize: "10px"});
					$(".mun").css({fill: "#ccc"});
				});
				var keyencecsv = function()
				{
					nestedData = d3.csv("csv/munpz.csv", function(dataset)
						{
							data = dataset.map(function(d){
								return {
									"Municipio": d.Municipio,
									"Cp": +d.CP
								};
								//console.log(data);
							})
							data = d3.nest()
											.key(function(d) {
												return(d.Municipio)
											})
											.entries(data);
							return data;
						})
				}
				console.log(nestedData);
				var data = keyencecsv();
				
			});
	});
}

drawMap();