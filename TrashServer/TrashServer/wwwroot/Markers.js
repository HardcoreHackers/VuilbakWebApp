 map = new OpenLayers.Map("mapdiv");
    map.addLayer(new OpenLayers.Layer.OSM());

	function httpGet(theUrl)
	{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
	  }

	  function getIcon(level) { 
		  if (level===null) {
			  return new OpenLayers.Icon("markerNull.png"); 
		  }
		  if (level < 25) {
			  return new OpenLayers.Icon("marker0.png");
		  }
		  if (level < 50) {
			  return new OpenLayers.Icon("marker25.png");
		  }
		  if (level < 75) {
			  return new OpenLayers.Icon("marker50.png");
		  }
		  return new OpenLayers.Icon("marker75.png");
	  }

	  function getByNumber(array, number) {
		  for (i = 0; i < array.length; i++) {
			  if (array[i].NUMMER=number) {
				  return array[i];
			  }
		  }
		  return null;
	  }

	  /*
	  function isFull(trashCan) {
		  return trashCan.Level >= 75;
	  }

	  function filterFull(trashCans) {
		  return trashCans.filter(isFull);
	  }*/
	
	  var afvalmandenJSON = httpGet("afvalmanden.json");
	  var trashCansValuesJSON = httpGet("trash.json");
	  var arr_from_json = JSON.parse(afvalmandenJSON);
	  var trashCansValues = JSON.parse(trashCansValuesJSON);
	  //trashCansValues = filterFull(trashCansValues);
	  
	  

	/*
	fetch('file.txt')
  .then(response => response.text())
  .then(text => console.log(text))*/
  
  /*
  function loadJSON(callback) {   

    var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
    xobj.open('GET', 'my_data.json', true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
          }
    };
    xobj.send(null);  
	}*/

	  /*
	fetch('file.json')
  .then(response => response.json())
  .then(jsonResponse => console.log(jsonResponse));
	*/

	  var zoom = 16;
	  var markers = new OpenLayers.Layer.Markers("Markers");
	  map.addLayer(markers);
	  //var size = OpenLayers.Size(10, 10);
	  //var size = new OpenLayers.Size(25, 25);
	  //var offset = new OpenLayers.Pixel(-(size.w / 2), -size.h);
	  for (i = 0; i < arr_from_json.length; i++){
		  if (arr_from_json[i].json_geometry) { //filter corrupt entries
			  var icon = getIcon(trashCansValues[i].Level);
			  var lonLat = new OpenLayers.LonLat(arr_from_json[i].json_geometry.coordinates[0], arr_from_json[i].json_geometry.coordinates[1])
				  .transform(
					  new OpenLayers.Projection("EPSG:4326"), // transform from WGS 1984
					  map.getProjectionObject() // to Spherical Mercator Projection
			  );
			  markers.addMarker(new OpenLayers.Marker(lonLat,icon));
		  }		  
	  }

	  var lonLat = new OpenLayers.LonLat(3.224700, 51.209348)
		  .transform(
			  new OpenLayers.Projection("EPSG:4326"), // transform from WGS 1984
			  map.getProjectionObject() // to Spherical Mercator Projection
		  );

    map.setCenter (lonLat, zoom);