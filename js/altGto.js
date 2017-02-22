//Width and height of map
var width = 900,
	height = 600;

//D3 Projection
var projection =  d3.geoConicConformal()
					.rotate([102, 0])
					.center([1, 20.85])
					//.parallels([17.5, 29.5])
					.scale(1200 * 14)
					.translate([width / 2, height / 2]);

//Define path generator
var path = d3.geoPath()
			.projection(projection);

//Create SVG element and append map to the SVG
var svg = d3.select(".central")
			.append("svg")
			.attr("width", width)
			.attr("height", height);

//Load in MUN data. 
d3.csv("csv/munzip.csv", function(data){
	d3.json("jsons/gtoMUN.json", function(json){
		for(var i = 0; i < data.length; i++){
			var dataGeo = data[i].CVEGEO;
			var dataCP = data[i].CP;

			for(var j=0; j < json.features.length; j++) {
				var jsonGeo = json.features[j].properties.CVEGEO;

				if(dataGeo == jsonGeo) {
					//Copy the data value into the json
					if(typeof json.features[j].properties.zipcodes == "undefined"){
						console.log(typeof json.features[j].properties.zipcodes)
						json.features[j].properties.zipcodes = dataCP;
					}
					else {
						json.features[j].properties.zipcodes =json.features[j].properties.zipcodes + "," +  dataCP;
					}
					//Stop looking through the JSON
					break;
				}
			}
		}
		var checkDolores = function(name){
			if(name == "Dolores Hidalgo Cuna de la Independencia Nacional") {
				return "Dolores Hidalgo";
			}
			return name; 
		}
		var updateData = function(data){
			console.log("Update Function");
			console.log(data);
			var cpList = d3.select(".info")
							.selectAll("li")
							.data(data);
			cpList.attr("class", "update");

			cpList.enter()
					.append("li")
					.attr("class", "enter")
					.merge(cpList)
					.text(function(d){return d;});
			cpList.exit().remove();
		}
		//Draw the map.
		svg.selectAll("path")
			.data(json.features)
			.enter()
			.append("path")
			.attr("d", path)
			.style("stroke","#fff")
			.style("stroke-width","1")
			.style("fill","red")
			.on("click", function(d){
				var munName = d3.select(".info")
								.selectAll("h1")
								.text(checkDolores(d.properties.NOMBRE));
				var zippy = d.properties.zipcodes.split(",");
				updateData(zippy);
				
			})
			.on("mouseover", function(d){
				//Nothing Yet
			});
		svg.selectAll(".munLabel")
			.data(json.features)
			.enter()
			.append("text")
			.attr("class","munLabel")
			.style("color", "#eaedfc")
			.attr("transform", function(d){
				return "translate("+path.centroid(d)+")";
			})
			.attr("dy", function(d){
				//These two municipalities overlap labels with another, so we move them down.
				if(d.properties.NOMBRE == "Purísima del Rincón" || d.properties.NOMBRE == "Valle de Santiago"){
					return "2em";
				}
				return "0em";
			})
			.attr("dx", function(d){
				return "-2em";
			})
			.text(function(d){
				if(d.properties.NOMBRE == "Dolores Hidalgo Cuna de la Independencia Nacional") {
					return "Dolores Hidalgo";
				}
				return d.properties.NOMBRE; 
			});
	})
})
