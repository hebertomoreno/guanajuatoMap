#Zipcode Viewer
##Uses HTML5, javascript and css.

An HTML page to view zipcodes by municipalities in Mexico. 

###Libraries used:

* d3.js - For csv parsing and scales. 
* jQuery - For event handling. 
* topojson - Part of d3, for geographical projections. 
* ogr2ogr - Part of GDAL. For converting shapefiles into json. Usage explained below.

###Fonts used:

* [Montserrat](https://fonts.google.com/specimen/Montserrat)

###Scripts:

* Index.html - Main HTML page. Calls the js scripts. 
* gtoMapcsv.js - Main js script. Parses the csv data and draws the map. 

###Sources: 

* gto_municipal.shp

###Preparing the files

1. Download the desired shapefile from your website of choice. I downloaded the agebsymas package from [Diego Valle's Website](https://www.diegovalle.net/). 
2. Identify the shapefile you need. I used gto_municipal.shp. 
3. Convert the shapefile to JSON using ogr2ogr. This was tricky to learn. 
	* You have to navigate, using the commandline, to the folder where your .shp is stored. .dbf, .prj and .shx files *must be in the same folder as the .shp file*.

	* ogr2ogr -f GeoJSON gto.json gto_municipal.shp *(where "gto.json" is the output file, and "gto_municipal.shp" is the input file.)*
4. Convert the GeoJSON to topoJSON. 
	*If you haven't, download topoJSON using npm. I used version 1.x. The command line input is "npm install -g topojson".
	*Navigate to the folder your GeoJSON is in and use:
	*topojson -o gtoFinal.json --id-property=NOMBRE -p CVEGEO -- gto.json *(where gtoFinal.json is the output file, NOMBRE is the properties in the JSON file that you want to use as your id, CVEGEO is a property to pull from the JSON file, and gto.json is the input file.)*

5. Your file is ready to be used. 