/*
 *	tiny-bs-grid https://github.com/jeffhehe/tiny-bs-grid
 *  this works for TinyMCE4.* on Bootstrap 3.*
*  Version: v0.4
 *  Author: Jeff Wang
 *  Date: Jan 20, 2023
 */

(function () {
    tinymce.PluginManager.add('bootstrap3grid', bootstrap3GridPlugin);

    function bootstrap3GridPlugin(editor, url) {
        editor.contentCSS.push(url + '/bootstrapgrid-style.css');

        editor.addButton('bootstrap3grid', {
            type: 'button',
            text: 'BS3 Grid',
            tooltip: 'Bootstrap3 Grid System',
            stateSelector: 'div.row',
            cmd: 'tinymce_bs3_grid',
        });

        editor.addCommand('tinymce_bs3_grid', function () {
            var dialogueTitle = 'Insert Bootstrap3 Grids';
            var columnValue = ['12'];
            var screenSize = 'md';
            var node = editor.selection.getNode();
            var parentDOMS = jQuery(node).parents('div.row');
            var editMode = parentDOMS.length > 0;
            if (editMode) {
                var parentRow = parentDOMS[0];
                var oldGrids = jQuery(parentRow).children('div');
                var oldGridNumber = oldGrids.length;
                var oldGridContents = [];
                if (oldGridNumber > 0) {
                    columnValue = [];
                    for (i = 0; i < oldGridNumber; i++) {
                        var gridClasses = jQuery(oldGrids[i]).attr('class').split(/\s+/);
                        var gridContent = jQuery(oldGrids[i]).html();
                        oldGridContents.push(gridContent);
                        for (j = 0; j < gridClasses.length; j++) {
                            if (/^col-.*/i.test(gridClasses[j])) {
                                //only need to check first column for targe screen size
                                if (j == 0) {
                                    if (gridClasses[0].indexOf('col-lg') > -1) {
                                        screenSize = 'lg';
                                    } else if (gridClasses[0].indexOf('col-sm') > -1) {
                                        screenSize = 'sm';
                                    } else if (gridClasses[0].indexOf('col-xs') > -1) {
                                        screenSize = 'xs';
                                    }
                                }
                                var lastDashPos = gridClasses[j].lastIndexOf('-');
                                var widthNumb = gridClasses[j].substr(lastDashPos + 1);
                                columnValue.push(widthNumb);
                            }
                        }
                    }
                }
                dialogueTitle = 'Update Bootstrap3 Grids';
            }

            var dialogueContent = [{
                    type: 'listbox',
                    name: 'size',
                    label: 'Target Screen',
                    values: [{
                            text: 'Large => 1200px',
                            value: 'lg'
                        },
                        {
                            text: 'Medium => 992px',
                            value: 'md'
                        },
                        {
                            text: 'Small => 768px',
                            value: 'sm'
                        },
                        {
                            text: 'X Small < 768px',
                            value: 'xs'
                        },
                    ],
                    value: screenSize
                },
                {
                    type: 'listbox',
                    name: 'grid',
                    label: 'Grid',
                    values: [{
                            text: '1 Column',
                            value: '12'
                        },
                        {
                            text: '2 Columns (1:1)',
                            value: '6,6'
                        },
                        {
                            text: '2 Columns (2:1)',
                            value: '8,4'
                        },
                        {
                            text: '2 Columns (3:1)',
                            value: '9,3'
                        },
                        {
                            text: '2 Columns (1:2)',
                            value: '4,8'
                        },
                        {
                            text: '2 Columns (1:3)',
                            value: '3,9'
                        },
                        {
                            text: '3 Columns (1:1:1)',
                            value: '4,4,4'
                        },
                        {
                            text: '3 Columns (2:1:1)',
                            value: '6,3,3'
                        },
                        {
                            text: '3 Columns (1:2:1)',
                            value: '3,6,3'
                        },
                        {
                            text: '3 Columns (1:1:2)',
                            value: '3,3,6'
                        },
                        {
                            text: '4 Columns (1:1:1:1)',
                            value: '3,3,3,3'
                        }
                    ],
                    value: columnValue.toString()
                },
                {
                    type: 'checkbox',
                    name: 'leadingBreak',
                    label: 'Add a Leading Line Break'
                },
            ];

            if (editMode) {
                dialogueContent.push({
                    type: 'checkbox',
                    name: 'removeGrids',
                    label: 'Remove Bootstrap Grids', 
                    onchange: function(e){
                        var lineBreakCKB = this.parent().prev();
                        var gridLB = lineBreakCKB.prev();
                        var screenLB = gridLB.prev();
                        if(this.state.data.checked == true){
                            lineBreakCKB.hide();
                            gridLB.hide();
                            screenLB.hide();
                        }else{
                            lineBreakCKB.show();
                            gridLB.show();
                            screenLB.show();
                        }
                        
                    }
                });
            }

            editor.windowManager.open({
                title: dialogueTitle,
                width: 450,
                height: 150,
                body: dialogueContent,
                onsubmit: function (e) {
                    var leadingHtml = '';
                    var htmlContents = '';
                    var endingHtml = '<p>&nbsp;</p>';
                    if (e.data.leadingBreak == true) {
                        leadingHtml = '<p>&nbsp;</p>';
                    };
                    if(e.data.removeGrids == true && editMode){
                        // get contents from the grids
                        htmlContents = oldGridContents.join('<p>&nbsp;</p>') ;
                        jQuery(parentDOMS).replaceWith(leadingHtml + htmlContents + endingHtml);
                        return;
                    }
                    
                    var generateHtmlContents = function (gridWidthValues) {
                        const newGridNumber = gridWidthValues.length;
                        if (!editMode) {
                            // create new grids 
                            for (var n = 0; n < newGridNumber; n++) {
                                htmlContents += '<div class="col-' + e.data.size + '-' + gridWidthValues[n] + '"><p>&nbsp;</p></div>';
                            }
                        } else {
                            // update existing grids
                            if (oldGridNumber > 0 && oldGridNumber < newGridNumber) {
                                // if the number of new grids is more than the number of old grids
                                for (var k = 0; k < oldGridNumber; k++) {
                                    htmlContents += '<div class="col-' + e.data.size + '-' + gridWidthValues[k] + '">' + oldGridContents.shift() + '</div>';
                                }
                                // create empity girds
                                for (var m = oldGridNumber; m < newGridNumber; m++) {
                                    htmlContents += '<div class="col-' + e.data.size + '-' + gridWidthValues[m] + '"><p>&nbsp;</p></div>';
                                }
                            } else if (oldGridNumber >= newGridNumber) {
                                // if the number of new grids is less than the number of old grids
                                for (var k = 0; k < newGridNumber; k++) {
                                    htmlContents += '<div class="col-' + e.data.size + '-' + gridWidthValues[k] + '">' + oldGridContents.shift() + '</div>';
                                }
                                // create a new container for all remaining contents below the row
                                if (oldGridNumber > newGridNumber) {
                                    endingHtml = '<p>&nbsp;</p>' + oldGridContents.join('<p>&nbsp;</p>') + '<p>&nbsp;</p>';
                                }
                            }
                        }
                    };

                    generateHtmlContents(e.data.grid.split(','));

                    if (editMode) {
                        jQuery(parentDOMS).replaceWith(leadingHtml + '<div class="row">' + htmlContents + '</div>' + endingHtml);
                    } else {
                        editor.insertContent(leadingHtml + '<div class="row">' + htmlContents + '</div>' + endingHtml);
                    }
                }
            });
        });
    }
})();