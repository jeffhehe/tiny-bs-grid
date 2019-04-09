# tiny-bs-grid 
This plugin enables users to create or update Bootstrap (v3, v4) grid system within TinyMCE (v4, v5) editor. 

There are 4 versions of this plugin customized for different combinations of TinyMCE (v4 or v5) and Bootstrap (v3 or v4).

## Limitation
This plugin only creates or updates simple Bootstrap grids. Nested grids or mulitiple target screen grids are not supported. 

## Project Folders
- demo
    - Tiny4BS3.html (demo configuration of using this plugin for TinyMCE V4 and Bootstrap 3)
    - Tiny4BS4.html (demo configuration of using this plugin for TinyMCE V4 and Bootstrap 4)
    - Tiny5BS3.html (demo configuration of using this plugin for TinyMCE V5 and Bootstrap 3)
    - Tiny5BS4.html (demo configuration of using this plugin for TinyMCE V5 and Bootstrap 4)
-plugins
    - TinyMCE4
        - bootstrap3grid (TinyMCE4 plugin to create Bootstrap3 grid system)
        - bootstrap4grid (TinyMCE4 plugin to create Bootstrap4 grid system)
    - TinyMCE5
        - bootstrap3grid (TinyMCE5 plugin to create Bootstrap3 grid system)
        - bootstrap4grid (TinyMCE5 plugin to create Bootstrap4 grid system)

## Installation
1. Using TinyMCE CDN
    1. Select the plugin for your environment, for example if you have TinyMCE v4.* and you would like to create Bootstrap3 grid, select the folder plugins/TinyMCE4/bootstrap3grid.
    2. Copy the plugin folder and paste it into the application folder.
    3. Initialized the editor with following configurations (please check demos)
    
    
     ```javascript
     tinyMCE.init({
            selector: "textarea",
            external_plugins: {
                'bootstrap3grid': '/plugins/TinyMCE4/bootstrap3grid/plugin.min.js' //local path to plugin.min.js file
            },
            theme: 'modern',
            plugins: [
                ... ' bootstrap3grid'
            ],
            toolbar: ... 'bootstrap3grid',
            content_css: [
                'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css' 
            ],
        });
     ```
2. Using TinyMC locally
    1. Select the plugin for your environment, for example if you have TinyMCE v5.* and you would like to create Bootstrap4 grid, select the folder plugins/TinyMCE5/bootstrap4grid.
    2. Copy the plugin folder and paste it into the tinymce/plugins/ folder along with other tinymce official plugins in the application.
    3. Initialized the editor with following configurations:
    
    
     ```javascript
          tinyMCE.init({
            selector: "textarea",
            theme: 'modern',
            plugins: [
                ... ' bootstrap4grid'
            ],
            toolbar: ... 'bootstrap4grid',
            content_css: [
                'https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css' 
            ],
        });
     ```
## Dependancies
1. TinyMCE 4+
2. Bootstrap 3+
3. jQuery 3 +

## Chnage Log
- V0.1 Initial Commit - Mar 29, 2019
- V0.2 Enhancements & Bug fixes - April 9, 2019
    - Update the CSS styles to show grid borders only in Edit mode
    - Update the CSS styles to automatically show the grid width label in Edit mode
    - Disable the resize handler in IE11
    - Update the JS files to not show static width info in text
    - Update the function in JS files to detect the grid classes
    - Fix the demo/Tiny5BS4.html ending title tag typo

## Credits:
This project was inspired and modified from tiny-grid https://github.com/aaroniker/tiny-grid author: Aaron Iker.
