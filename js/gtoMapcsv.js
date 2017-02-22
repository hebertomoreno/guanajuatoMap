var width = 900,
	height = 600;
var active = d3.select(null);
var svg = d3.select("body")
			.append("svg")
			.attr("width", width)
			.attr("height", height);

var drawMap = function(data) {
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
			//Make the "nombre" equall to the NOMBRE property. 
			.attr("nombre", function(d){
				return d.properties.NOMBRE;
			})
			//Call function "clicked" when clicked
			.on("click", clicked)
			.attr("d", path);

		//Draw the white line dividing the munipalities. 
		g.append("path")
			.datum(topojson.mesh(gto, gto.objects.gtoMUN, function(a, b) { return a !== b; }))
			.attr("class", "mesh")
			.attr("d", path);
		//Draw the text for the labels.
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
				//These two municipalities overlap labels with another, so we move them down.
				if(d.properties.NOMBRE == "Purísima del Rincón" || d.properties.NOMBRE == "Valle de Santiago"){
					return "2em";
				}
				return "0em";

			})
			//bring everything slightly to the left so it is centered.
			.attr("dx", function(d) { 
				return "-2em";
			})
			//Shorten Dolores Hidalgo's name.
			.text(function(d) { 
				if(d.properties.NOMBRE == "Dolores Hidalgo Cuna de la Independencia Nacional") {
					return "Dolores Hidalgo";
				}
				return d.properties.NOMBRE; 
			});

			function clicked(d) {
				//TO-DO: Get the id of whatever was clicked.
				//TO-DO: Get the zipcode from the data. 
				//Display the csv data. 
			}

			function reset() {
				active.classed("active", false);
				active = d3.select(null);

				g.transition()
					.duration(750)
					.style("stroke-width", "1.5px")
					.attr("transform", "");
			}
			//Function for when the mouse hovers above the MUN. Uses JQuery. 
			$(".mun").hover(function(){
				//Fill the MUN with yellow. 
				$(this).css({fill: "yellow"});
				//Hide all labels. 
				$(this).siblings(".munLabel").hide();
				//Show the label of the hovered MUN and make it bigger. 
				$(this).siblings("#"+this.id).show().css({fontSize: "25px"});
				//off click function
				}, function() {
				//Make the labels smaller. 
				$(".munLabel").show().css({fontSize: "10px"});
				//Make the fill a uniform gray. 
				$(".mun").css({fill: "#ccc"});

			});
	});
}

var keyenceCsvMap = function() {
	d3.csv("csv/munzip.csv", function(dataset){
		data = dataset.map(function(d){
			return {
				"CVEGEO": +d.CVEGEO,
				"Municipio": d.Municipio,
				"Cp": +d.CP
			};
			//console.log(data);
		})
		//Nesting function for getting the zipcodes in the json based on the CVEGEO. 
		data = d3.nest()
				.key(function(d) {
					return(d.CVEGEO)
				})
				.entries(data);
		console.log(data);
		drawMap(data);
	})
}
$(document).ready(function(){
	keyenceCsvMap();
})
