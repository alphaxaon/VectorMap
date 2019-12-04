# Vector Map

A simple WordPress plugin that gives you a vector-based regions editor for Google Maps to aid in creating better Contact Us pages. Can easily be edited and extended for your own use case.

## Requirements

A [Google Maps API key](https://developers.google.com/maps/documentation/javascript/get-api-key) will be necessary to get rid of the "For development purposes only" overlay and access limits set by Google for their maps API.

## Installation

1. Copy the `vector-map` folder to your WordPress website's `wp-content/plugins` folder.
2. Activate the plugin from your site's Admin panel.

## How To Edit Regions

![enter image description here](https://thumbs.gfycat.com/FortunateElatedAdouri-size_restricted.gif)

## How To Display Map Data

1. Use the helper function to get an array of all the region objects.
	```php
	$regions = vector_map_get_regions();
	```
	```javascript
	[
		{ 
			id: 1,
			shape_id: "1575483597283_380",
			type: "polygon",
			path: "mtiqGpdxdT?}zdj@bpiWria@q}Kt}yh@",
			meta: {
				name: "Wyoming",
				address1: "123 Sesame Street",
				address2: "",
				citystatezip: "New York, NY 10001",
				phone: "",
				fax: "",
				email: "",
				website: "",
				lat: "42.85731395377183",
				lon: "-105.37962711406249",
				color: "#5c5c5c"
			}
		}
	]
	```
2. Pass this data into your map Javascript from within the page, or using a WordPress hook.
	```html
	<script>let regions = <?php echo json_encode($regions); ?></script>
	```
	-- OR --
	```php
	wp_localize_script('google-maps-script', 'regions', $regions);
	```
3. Loop through the regions and create polygons for them, or do whatever else you want to.
	```javascript
	// Loop through all the regions
	for (let i in regions) {
		
		// Grab our metadata
		let metadata = JSON.parse(data.meta);

		// Create a new polygon
		let polygon = new google.maps.Polygon({
			strokeWeight: 2,
			strokeColor: metadata['color'],
			fillColor: metadata['color'],
			fillOpacity: 1
		});

		// Set the polygon's shape
		polygon.setPath(google.maps.geometry.encoding.decodePath(data.path.replace(/\\\\/g, '\\')));

		// Add region to map
		shape.setMap(this.map);

		// Listen for click events
		google.maps.event.addListener(shape, 'click', function(e) {
			that.showInfoWindow(metadata, id);
		});

		// Change color on mouse over
		google.maps.event.addListener(shape, 'mouseover', function(e) {
			this.set('fillColor', '#00ab5e');
			this.set('strokeColor', '#00ab5e');
		});

		// Reset color on mouse out
		google.maps.event.addListener(shape, 'mouseout', function(e) {
			this.set('fillColor', metadata['color']);
			this.set('strokeColor', metadata['color']);
		});
	}
	```

## License

This project is licensed under the MIT License - see the [LICENSE.md](https://github.com/alphaxaon/VectorMap/blob/master/LICENSE.md) file for details