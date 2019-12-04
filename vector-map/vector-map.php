<?php
/*
Plugin Name: Vector Map
Plugin URI: http://wordpress.org/extend/plugins/#
Description: Create editable vector regions for Google Maps.
Author: alphaxaon
Version: 1.0
Author URI: https://github.com/alphaxaon
*/
class Vector_Map
{
	/**
	* Construct for a new Vector Map.
	*/
	public function __construct() {
		$this->url = plugins_url() . '/vector-map';
		$this->setupDatabaseTable();
		$this->registerAssets();
		$this->setupAdminPage();
		$this->registerAjaxCalls();
	}

	/**
	* Create a table to store our map data.
	*/
	public function setupDatabaseTable()
	{
		register_activation_hook(__FILE__, function() {
		   	global $wpdb;
		  	$table = $wpdb->prefix . 'vector_map';
		 
			if ($wpdb->get_var("show tables like '$table'") != $table) {
				$sql = "CREATE TABLE " . $table . " (
				`id` mediumint(9) NOT NULL AUTO_INCREMENT,
				`shape_id` tinytext NOT NULL,
				`type` tinytext NOT NULL,
				`path` mediumtext NOT NULL,
				`meta` mediumtext NOT NULL,
				UNIQUE KEY id (id)
				);";
		 
				require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
				dbDelta($sql);
			}
		});
	}

	/**
	* Register plugin styles and scripts.
	*/
	public function registerAssets()
	{
        add_action('admin_enqueue_scripts', function($hook) {

        	// Main Plugin Page
        	if ($hook == 'toplevel_page_vector-map') {
        		$options = get_option('vector_map_options');

        		if (isset($options['api-key']))
        			$maps = 'http://maps.google.com/maps/api/js?key='.$options['api-key'].'&libraries=drawing,geometry';
        		else
        			$maps = 'http://maps.google.com/maps/api/js?libraries=drawing,geometry';

        		wp_enqueue_script('vector-map-admin-googlemaps', $maps, false);
        		wp_enqueue_script('vector-map-simplify-script', $this->url . '/assets/simplify.js', false);
        		wp_enqueue_script('vector-map-admin-script', $this->url . '/assets/admin.js', false);
        		wp_enqueue_style('vector-map-admin-bootstrap-style', 'https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css', false);
        		wp_enqueue_script('vector-map-admin-bootstrap-script', 'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.3.1/js/bootstrap.bundle.js', false);
        		wp_enqueue_style('vector-map-admin-style', $this->url . '/assets/admin.css', false);

        		global $wpdb;
    		 	$query = "SELECT * FROM " . $wpdb->prefix . "vector_map";
				$shapes = $wpdb->get_results($query, OBJECT);

				wp_localize_script('vector-map-admin-script', 'mapdata', $shapes);
        	}

        	// Settings Page
        	if ($hook == 'vector-map_page_vector-map-settings') {
        		wp_enqueue_style('vector-map-admin-style', $this->url . '/assets/admin.css', false);
        	}
        });
	}

	/**
	* Define the main page for the plugin.
	*/
	public function setupAdminPage()
	{
		add_action('admin_init', function() {
			register_setting('vector-map-settings', 'vector_map_options');
		 
			// Register a new section
			add_settings_section(
				'vector-map-settings-section',
				'',
				function() {},
				'vector-map-settings'
			);
		 
			// Register a new field
			add_settings_field(
				'vector-map-google-maps-api-key-field',
				'Google Maps API Key',
				function($args) {
					$options = get_option('vector_map_options');
					?>
						<input name="vector_map_options[api-key]" value="<?php echo isset($options['api-key']) ? $options['api-key'] : '' ?>" />
					<?php
				},
				'vector-map-settings',
				'vector-map-settings-section'
			);
		});

		add_action('admin_menu', function (){
        	add_menu_page('Vector Map', 'Vector Map', 'manage_options', 'vector-map', function() {

        		if (! current_user_can('manage_options'))
		 			return;

	        	?>
	        		<div class="heading">
	        			<img class="logo" src="<?php echo $this->url . '/assets/logo.png' ?>" />
	        		</div>
	        		<div class="alerts"></div>
			        <div class="map-editor">
				        <div id="panel" class="toolbar">
				            <div id="color-palette"></div>
				            <div class="dropdown show-when-selected">
								<a class="btn btn-secondary dropdown-toggle" id="load-button" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
									Load State
								</a>
								<div class="dropdown-menu" aria-labelledby="load-button">
									<a class="dropdown-item">Alabama</a>
									<a class="dropdown-item">Alaska</a>
									<a class="dropdown-item">Arizona</a>
									<a class="dropdown-item">Arkansas</a>
									<a class="dropdown-item">California</a>
									<a class="dropdown-item">Colorado</a>
									<a class="dropdown-item">Connecticut</a>
									<a class="dropdown-item">Delaware</a>
									<a class="dropdown-item">Florida</a>
									<a class="dropdown-item">Georgia</a>
									<a class="dropdown-item">Hawaii</a>
									<a class="dropdown-item">Idaho</a>
									<a class="dropdown-item">Illinois</a>
									<a class="dropdown-item">Indiana</a>
									<a class="dropdown-item">Iowa</a>
									<a class="dropdown-item">Kansas</a>
									<a class="dropdown-item">Kentucky</a>
									<a class="dropdown-item">Louisiana</a>
									<a class="dropdown-item">Maine</a>
									<a class="dropdown-item">Maryland</a>
									<a class="dropdown-item">Massachusetts</a>
									<a class="dropdown-item">Michigan</a>
									<a class="dropdown-item">Minnesota</a>
									<a class="dropdown-item">Mississippi</a>
									<a class="dropdown-item">Missouri</a>
									<a class="dropdown-item">Montana</a>
									<a class="dropdown-item">Nebraska</a>
									<a class="dropdown-item">Nevada</a>
									<a class="dropdown-item">New Hampshire</a>
									<a class="dropdown-item">New Jersey</a>
									<a class="dropdown-item">New Mexico</a>
									<a class="dropdown-item">New York</a>
									<a class="dropdown-item">North Carolina</a>
									<a class="dropdown-item">North Dakota</a>
									<a class="dropdown-item">Ohio</a>
									<a class="dropdown-item">Oklahoma</a>
									<a class="dropdown-item">Oregon</a>
									<a class="dropdown-item">Pennsylvania</a>
									<a class="dropdown-item">Rhode Island</a>
									<a class="dropdown-item">South Carolina</a>
									<a class="dropdown-item">South Dakota</a>
									<a class="dropdown-item">Tennessee</a>
									<a class="dropdown-item">Texas</a>
									<a class="dropdown-item">Utah</a>
									<a class="dropdown-item">Vermont</a>
									<a class="dropdown-item">Virginia</a>
									<a class="dropdown-item">Washington</a>
									<a class="dropdown-item">West Virginia</a>
									<a class="dropdown-item">Wisconsin</a>
									<a class="dropdown-item">Wyoming</a>
								</div>
							</div>
							<div class="search-button-container show-when-selected">
								<button type="button" class="btn btn-secondary open-search-box">Search Shape</button>
								<div class="search-menu">
									<input class="form-control" id="location" placeholder="ex. Orange County, FL" />
									<button class="btn btn-sm btn-primary" href="#null" id="search-button">Search</button>
									<div class="response" id="response"></div>
									<div class="search-results" id="results"></div>
								</div>
							</div>
				            <button type="button" id="duplicate-button" class="btn btn-info show-when-selected">Duplicate</button>
				            <button type="button" id="delete-button" class="btn btn-danger show-when-selected">Delete</button>
			                <button id="save-button" class="btn btn-success">Save Map</button>
				        </div>

				        <div class="map-container">
			        		<div id="map"></div>

			        		<div class="side-panel">
				        		<form id="form" class="show-when-selected">
				        			<h3>Location Info</h3>
								</form>
							</div>
			        	</div>
			        </div>
	        	<?php
			}, 'dashicons-location-alt', 25);

			add_submenu_page('vector-map', 'Settings', 'Settings', 'manage_options', 'vector-map-settings', function() {

				if (! current_user_can('manage_options'))
		 			return;

		 		if (isset($_GET['settings-updated'])) {
					add_settings_error('vector_map_messages', 'vector_map_message', 'Settings Saved', 'updated');
				}

				settings_errors('vector_map_messages');

				?>
					<div class="heading">
	        			<img class="logo" src="<?php echo $this->url . '/assets/logo.png' ?>" />
	        		</div>
			        <div class="settings">
			        	<div class="wrap">
							<h2>Settings</h2>
							<form action="options.php" method="post">
								<?php
						 			settings_fields('vector-map-settings');
								 	do_settings_sections('vector-map-settings');
								 	submit_button('Save Settings');
						 		?>
							</form>
						</div>
			        </div>
				<?php
			});
		});
	}

	/**
	* Register ajax callbacks.
	*/
	public function registerAjaxCalls()
	{
		add_action('wp_ajax_save_vector_map', function() {
			global $wpdb;
			$table = $wpdb->prefix . 'vector_map';
			$shapes = $_POST['shapes'];

			try {
			    foreach ($shapes as $shape) {
			    	// Update existing shape
			    	$existingShape = $wpdb->get_results("SELECT * FROM $table WHERE shape_id='".$shape['id']."'");
			    	if (!empty($existingShape))
			    	{
			    		$wpdb->update($table, [
							'path' => $shape['path'],
							'meta' => json_encode($shape['meta'], JSON_UNESCAPED_UNICODE)
						], [
							'shape_id' => $shape['id']
						]);
			    	}

			    	// Insert a new shape
			    	else
			    	{
						$wpdb->insert($table, [
							'shape_id' => $shape['id'],
							'type' => $shape['type'],
							'path' => $shape['path'],
							'meta' => json_encode($shape['meta'], JSON_UNESCAPED_UNICODE)
						], ['%s', '%s', '%s', '%s']);
			    	}
				}

				// Delete shapes that are no longer on the map
				$remainingIds = [];
				foreach ($shapes as $shape)
					$remainingIds[] = $shape['id'];

				$rows = $wpdb->get_results("SELECT shape_id FROM $table");
				foreach ($rows as $row) {
					if (!in_array($row->shape_id, $remainingIds))
						$wpdb->delete($table, ['shape_id' => $row->shape_id]);
				}
			} catch (Exception $e) {
				echo $e->getMessage();
			}

			echo 1;

			wp_die();
		});
	}
}

$vectorMap = new Vector_Map();

/**
* Helper Functions
*/
function vector_map_get_regions() {
	global $wpdb;

	$table = $wpdb->prefix . 'vector_map';
	$regions = $wpdb->get_results("SELECT * FROM $table");

	return $regions;
}