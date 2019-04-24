/*
 *	tiny-bs-grid https://github.com/jeffhehe/tiny-bs-grid
 *  this works for TinyMCE5.* on Bootstrap 4.*
 *  Version: v0.3
 *  Author: Jeff Wang
 *  Date: April 24, 2019
 */

(function () {
  tinymce.PluginManager.add('bootstrap4grid', bootstrap4GridPlugin);

  function bootstrap4GridPlugin(editor, url) {
    editor.contentCSS.push(url + '/bootstrapgrid-style.css');

    editor.ui.registry.addToggleButton('bootstrap4grid', {
      text: 'BS4 Grid',
      tooltip: 'Bootstrap4 Grid System',
      onAction: Tinymce_bs4_grid,
      onSetup: function (api) {
        editor.selection.selectorChanged('div.row', function (state) {
          api.setActive(state);
        });
      }
    });

    function Tinymce_bs4_grid() {
      var dialogueTitle = 'Insert Bootstrap4 Grids';
      var columnValue = '12';
      var screenSize = '-md';
      var node = editor.selection.getNode();
      var parentDOMS = jQuery(node).parents('div.row');
      var editMode = parentDOMS.length > 0;
      if (editMode) {
        var parentRow = parentDOMS[0];
        var oldGrids = jQuery(parentRow).children('div');
        var oldGridNumber = oldGrids.length;
        var oldGridContents = [];
        if (oldGridNumber > 0) {
          columnValue = '';
          for (i = 0; i < oldGridNumber; i++) {
            var gridClasses = jQuery(oldGrids[i]).attr('class').split(/\s+/);
            var gridContent = jQuery(oldGrids[i]).html();
            oldGridContents.push(gridContent);
            for (j = 0; j < gridClasses.length; j++) {
              if (/^col-.*/i.test(gridClasses[j])) {
                //only need to check first column for targe screen size
                if (j == 0) {
                  if (gridClasses[0].indexOf('col-xl') > -1) {
                    screenSize = '-xl';
                  } else if (gridClasses[0].indexOf('col-lg') > -1) {
                    screenSize = '-lg';
                  } else if (gridClasses[0].indexOf('col-md') > -1) {
                    screenSize = '-md';
                  } else if (gridClasses[0].indexOf('col-sm') > -1) {
                    screenSize = '-sm';
                  } else {
                    screenSize = '';
                  }
                }
                var lastDashPos = gridClasses[j].lastIndexOf('-');
                var widthNumb = gridClasses[j].substr(lastDashPos + 1);
                columnValue += widthNumb;
              }
            }
          }
        }
        dialogueTitle = 'Update/Remove Bootstrap4 Grids';
      }

      var mainPanelItems = [{
          type: 'selectbox',
          name: 'size',
          label: 'Target Screen',
          items: [{
              text: 'X Large >= 1200px',
              value: '-xl'
            },
            {
              text: 'Large >= 992px',
              value: '-lg'
            },
            {
              text: 'Medium >= 768px',
              value: '-md'
            },
            {
              text: 'Small >= 576px',
              value: '-sm'
            },
            {
              text: 'X Small < 576px',
              value: ''
            },
          ],
        },
        {
          type: 'selectbox',
          name: 'grid',
          label: 'Grid',
          items: [{
              text: '1 Column',
              value: '12'
            },
            {
              text: '2 Columns (1:1)',
              value: '66'
            },
            {
              text: '2 Columns (2:1)',
              value: '84'
            },
            {
              text: '2 Columns (3:1)',
              value: '93'
            },
            {
              text: '2 Columns (1:2)',
              value: '48'
            },
            {
              text: '2 Columns (1:3)',
              value: '39'
            },
            {
              text: '3 Columns (1:1:1)',
              value: '444'
            },
            {
              text: '3 Columns (2:1:1)',
              value: '633'
            },
            {
              text: '3 Columns (1:2:1)',
              value: '363'
            },
            {
              text: '3 Columns (1:1:2)',
              value: '336'
            },
            {
              text: '4 Columns (1:1:1:1)',
              value: '3333'
            }
          ],
        },
        {
          type: 'checkbox',
          name: 'leadingBreak',
          label: 'Add a Leading Line Break'
        }
      ];

      var panelBody = {
        type: 'panel',
        items: mainPanelItems
      }

      if (editMode) {
        panelBody = {
          type: 'tabpanel',
          tabs: [{
              title: 'Update Bootstrap Grids',
              items: mainPanelItems
            },
            {
              title: 'Remove Bootstrap Grids',
              items: [{
                type: 'checkbox',
                name: 'removeGrids',
                label: 'Remove Bootstrap Grids',
              }]
            }
          ]
        };
      }

      editor.windowManager.open({
        title: dialogueTitle,
        body: panelBody,
        initialData: {
          size: screenSize,
          grid: columnValue
        },
        buttons: [{
            type: 'submit',
            name: 'submitBtn',
            text: 'Submit',
          },
          {
            type: 'cancel',
            name: 'cancelBtn',
            text: 'Cancel',
          }
        ],
        onSubmit: function (e) {
          var data = e.getData();
          var leadingHtml = '';
          var htmlContents = '';
          var endingHtml = '<p>&nbsp;</p>';
          if (data.leadingBreak == true) {
            leadingHtml = '<p>&nbsp;</p>';
          };
          if (data.removeGrids == true && editMode) {
            // get contents from the grids
            htmlContents = oldGridContents.join('<p>&nbsp;</p>');
            jQuery(parentDOMS).replaceWith(leadingHtml + htmlContents + endingHtml);
            e.close();
            return;
          }
          var generateHtmlContents = function (newGridNumber, gridWidthValues) {
            if (!editMode) {
              // create new grids 
              for (var n = 0; n < newGridNumber; n++) {
                htmlContents += '<div class="col' + data.size + '-' + gridWidthValues[n] + '"><p>&nbsp;</p></div>';
              }
            } else {
              // update existing grids
              if (oldGridNumber > 0 && oldGridNumber < newGridNumber) {
                // if the number of new grids is more than the number of old grids
                for (var k = 0; k < oldGridNumber; k++) {
                  htmlContents += '<div class="col' + data.size + '-' + gridWidthValues[k] + '">' + oldGridContents.shift() + '</div>';
                }
                // create empity girds
                for (var m = oldGridNumber; m < newGridNumber; m++) {
                  htmlContents += '<div class="col' + data.size + '-' + gridWidthValues[m] + '"><p>&nbsp;</p></div>';
                }
              } else if (oldGridNumber >= newGridNumber) {
                // if the number of new grids is less than the number of old grids
                for (var k = 0; k < newGridNumber; k++) {
                  htmlContents += '<div class="col' + data.size + '-' + gridWidthValues[k] + '">' + oldGridContents.shift() + '</div>';
                }
                // create a new container for all remaining contents below the row
                if (oldGridNumber > newGridNumber) {
                  endingHtml = '<p>&nbsp;</p>' + oldGridContents.join('<p>&nbsp;</p>') + '<p>&nbsp;</p>';
                }
              }
            }
          };
          switch (data.grid) {
            case '12':
              generateHtmlContents(1, [12]);
              break;
            case '66':
              generateHtmlContents(2, [6, 6]);
              break;
            case '84':
              generateHtmlContents(2, [8, 4]);
              break;
            case '93':
              generateHtmlContents(2, [9, 3]);
              break;
            case '48':
              generateHtmlContents(2, [4, 8]);
              break;
            case '39':
              generateHtmlContents(2, [3, 9]);
              break;
            case '444':
              generateHtmlContents(3, [4, 4, 4]);
              break;
            case '633':
              generateHtmlContents(3, [6, 3, 3]);
              break;
            case '363':
              generateHtmlContents(3, [3, 6, 3]);
              break;
            case '336':
              generateHtmlContents(3, [3, 3, 6]);
              break;
            case '3333':
              generateHtmlContents(4, [3, 3, 3, 3]);
              break;
          }
          if (editMode) {
            jQuery(parentDOMS).replaceWith(leadingHtml + '<div class="row">' + htmlContents + '</div>' + endingHtml);
          } else {
            editor.insertContent(leadingHtml + '<div class="row">' + htmlContents + '</div>' + endingHtml);
          }
          e.close();
        }
      });
    };
  }
})();