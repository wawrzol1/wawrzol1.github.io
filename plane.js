(function(){
                     <html>
<head>
  <script src="https://cdn.anychart.com/releases/v8/js/anychart-base.min.js?hcode=c11e6e3cfefb406e8ce8d99fa8368d33"></script>
  <script src="https://cdn.anychart.com/releases/v8/js/anychart-ui.min.js?hcode=c11e6e3cfefb406e8ce8d99fa8368d33"></script>
  <script src="https://cdn.anychart.com/releases/v8/js/anychart-exports.min.js?hcode=c11e6e3cfefb406e8ce8d99fa8368d33"></script>
  <script src="https://cdn.anychart.com/releases/v8/js/anychart-map.min.js?hcode=c11e6e3cfefb406e8ce8d99fa8368d33"></script>
  <script src="https://code.jquery.com/jquery-latest.min.js"></script>
  <script src="https://cdn.anychart.com/csv-data/boeing_737.js"></script>
  <link href="https://cdn.anychart.com/playground-css/seat-map/seat-map-title.css" type="text/css" rel="stylesheet">
  <link href="https://cdn.anychart.com/releases/v8/css/anychart-ui.min.css?hcode=c11e6e3cfefb406e8ce8d99fa8368d33" type="text/css" rel="stylesheet">
  <link href="https://cdn.anychart.com/releases/v8/fonts/css/anychart-font.min.css?hcode=c11e6e3cfefb406e8ce8d99fa8368d33" type="text/css" rel="stylesheet">
  <style type="text/css">
html, body, #container {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
}
</style>
</head>
<body>
  <div id="container"></div>
  <script>
	class Plane extends HTMLElement {
		constructor() {
			super(); 
			let shadowRoot = this.attachShadow({mode: "open"});
			shadowRoot.appendChild(template.content.cloneNode(true));
			
			this.$style = shadowRoot.querySelector('style');			
			this.$svg = shadowRoot.querySelector('svg');
			
			this.addEventListener("click", event => {
				var event = new Event("onClick");
				this.dispatchEvent(event);
			});
			
			this._props = {};
		}
anychart.onDocumentReady(function () {
    var stage = acgraph.create('container');

    $('#container').append('<div class="seat-map-title">' +
            '<h1>Boeing 737</h1>' +
            '<p>Source <a href="https://cdn.anychart.com/svg-data/seat-map/boeing_737.svg"' +
            'target="_blank">SVG Image</a></p>' + '</div>');

    // get svg file
    $.ajax({
        type: 'GET',
        url: 'https://cdn.anychart.com/svg-data/seat-map/boeing_737.svg',
        // The data that have been used for this sample can be taken from the CDN
        // load SVG image using jQuery ajax
        success: function (svgData) {
            // data for creating a SeatMap
            // from the CDN https://cdn.anychart.com/csv-data/boeing_737.js to data file
            var data = boeingData();
            var chart = anychart.seatMap(data);
            // set svg data,
            chart.geoData(svgData);
            chart.padding([105, 0, 20, 0])
                    // load svg-file how it looked(colors stroke/fill except
                    // for elements of series)
                    .unboundRegions('as-is');

            series = chart.getSeries(0);
            // sets fill series
            series.fill(function () {
                        var attrs = this.attributes;

                        return attrs ? attrs.fill : this.sourceColor;
                    })
                    // sets stroke series
                    .stroke(function () {
                        var attrs = this.attributes;

                        return attrs ? attrs.stroke : this.sourceColor;
                    });

            // sets fill on hover series and select series
            series.hovered().fill(returnColorHoverAndSelect);
            series.selected().fill(returnColorHoverAndSelect);

            // Create chart tooltip own title
            series.tooltip().titleFormat('Place');

            // Create chart tooltip own text
            series.tooltip().format('{%Id}');

            // create label zoom
            var zoomLabel = chart.label(0);
            zoomLabel.text('2x Zoom.')
                    .background('#9E9E9E')
                    .fontColor('#fff')
                    .padding(5)
                    .position('center-top')
                    .offsetX(5)
                    .offsetY(60);

            zoomLabel.listen('click', function () {
                // zoom map in 2 times
                chart.zoom(2);
            });

            // set color for label hover
            zoomLabel.listen('mouseOver', mouseOverLabel);
            zoomLabel.listen('mouseOut', mouseOutLabel);

            // create label zoom to
            var zoomToLabel = chart.label(1);
            zoomToLabel.text('1x Zoom.')
                    .background('#9E9E9E')
                    .fontColor('#fff')
                    .position('center-top')
                    .padding(5)
                    .offsetX(-75)
                    .offsetY(60);

            zoomToLabel.listen('click', function () {
                // zoomTo map
                chart.zoomTo(1);
            });

            // set color for label hover
            zoomToLabel.listen('mouseOver', mouseOverLabel);
            zoomToLabel.listen('mouseOut', mouseOutLabel);

            // label hover info
            var labelHoverPlaceInfo = chart.label(2);
            var labelHoverPlaceInfoFormat = '<span style="color: #545f69; font-size: 14px">' +
                    '<b>Class</b>: %s<br/><b>Place</b>: %s<br/><b>Price</b>: %s</span>';
            labelHoverPlaceInfo.useHtml(true)
                    .padding(10)
                    .hAlign('left')
                    .position('right-top')
                    .anchor('right-top')
                    .offsetY(85)
                    .offsetX(20)
                    .width(250);
            labelHoverPlaceInfo.background({
                fill: '#FCFCFC',
                stroke: '#E1E1E1',
                corners: 3,
                cornerType: 'ROUND'
            });
            labelHoverPlaceInfo.text(anychart.format.subs(labelHoverPlaceInfoFormat, '-', '-', '0'));

            // label select info
            var labelSelectPlace = chart.label(3);
            var labelSelectPlaceFormat = '<span style="color: #545f69; font-size: 14px">' +
                    '<b>Seat Reservation<br/></b><b>Places</b>: %s<br/><b>Total Price</b>: %s</span>';
            labelSelectPlace.useHtml(true)
                    .padding(10)
                    .hAlign('left')
                    .position('right-top')
                    .anchor('right-top')
                    .offsetY(160)
                    .offsetX(20)
                    .width(250);
            labelSelectPlace.background({
                fill: '#FCFCFC',
                stroke: '#E1E1E1',
                corners: 3,
                cornerType: 'ROUND'
            });
            labelSelectPlace.text(anychart.format.subs(labelSelectPlaceFormat, '-', '0'));

            // label info
            var labelInfo = chart.label(4);
            labelInfo.useHtml(true)
                    .padding(10)
                    .hAlign('left')
                    .position('left-top')
                    .anchor('left-top')
                    .offsetY(85)
                    .offsetX(20)
                    .width(270);
            labelInfo.background({
                fill: '#FCFCFC',
                stroke: '#E1E1E1',
                corners: 3,
                cornerType: 'ROUND'
            });
            labelInfo.text('<span style="color: #545f69; font-size: 14px"><b>Please select a location.' +
                    '</b><br><br>You can do this by clicking on the<br>desired location , so you can select' +
                    '<br>multiple locations with the aid<br>of a combination of keys:<br><b><i>shift/ctrl' +
                    ' + target place</i></b>.</span>').useHtml(true);

            // add pointsHover listener to get hovered place info
            chart.listen('pointsHover', function (point) {
                var placeInfo;
                if (point.seriesStatus[0].points[0] !== undefined) {
                    placeInfo = placeInfoFunc(point.seriesStatus[0].points[0].id);
                    labelHoverPlaceInfo.text(anychart.format.subs(labelHoverPlaceInfoFormat, placeInfo.class, placeInfo.place, placeInfo.price));
                }
            });

            // add pointsSelect listener to get select place info
            chart.listen('pointsSelect', function (points) {
                var placesInfo = points.seriesStatus[0].points;
                var placesId = [];
                var totalPrice = 0;

                if (chart.getSelectedPoints().length) {

                    for (var i = 0; i < placesInfo.length; i++) {
                        placesId.push(points.seriesStatus[0].points[i].id);
                        totalPrice += parseInt(placeInfoFunc(points.seriesStatus[0].points[i].id).price);
                    }

                    totalPrice += '$';

                    labelSelectPlace.text(anychart.format.subs(labelSelectPlaceFormat, placesId, totalPrice)).background({
                        fill: '#E5EEF5'
                    });
                }

            });

            // add chartClick listener to reset labelSelectPlace values
            chart.listen('click', function () {
                if (chart.getSelectedPoints().length == 0) {
                    labelSelectPlace.background({
                        fill: '#FCFCFC'
                    });
                    labelHoverPlaceInfo.text(anychart.format.subs(labelHoverPlaceInfoFormat, '-', '-', '0'));
                    labelSelectPlace.text(anychart.format.subs(labelSelectPlaceFormat, '-', '0'));
                }
            });

            // set container id for the chart
            chart.container(stage);
            // initiate chart drawing
            chart.draw();
        }
    });
});

function returnColorHoverAndSelect() {
    return '#64b5f6';
}

function mouseOverLabel() {
    this.background(anychart.color.darken('#9E9E9E', 0.35));
}

function mouseOutLabel() {
    this.background('#9E9E9E');
}

function placeInfoFunc(id) {
    var ECONOM_PLUS_ROW_MIN = 21;
    var regBusinessClass = /[1-3]{1}-(A|B|E|F)/;
    var regeconomClass = /([7-9]{1}|[0-9]{2})-(A|B|C|D|E|F)/;

    var businessClass = id.match(regBusinessClass) ? id.match(regBusinessClass)[0] : false;
    var economPlusClass = id.match(regeconomClass) && id.match(regeconomClass)[1] <= ECONOM_PLUS_ROW_MIN ? id.match(regeconomClass)[0] : false;
    var economClass = id.match(regeconomClass) && id.match(regeconomClass)[1] > ECONOM_PLUS_ROW_MIN ? id.match(regeconomClass)[0] : false;

    switch (id) {
        case businessClass :
            return {
                place: id,
                class: 'Business Class',
                price: '350$'
            };
        case economPlusClass :
            return {
                place: id,
                class: 'Econom-Plus Class',
                price: '250$'
            };
        case economClass :
            return {
                place: id,
                class: 'Econom Class',
                price: '150$'
            };
    }
}

		onCustomWidgetBeforeUpdate(changedProperties) {
			this._props = { ...this._props, ...changedProperties };
		}

		onCustomWidgetAfterUpdate(changedProperties) {
			if ("value" in changedProperties) {
				this.$value = changedProperties["value"];
			}
			
			if ("info" in changedProperties) {
				this.$info = changedProperties["info"];
			}
			
			if ("color" in changedProperties) {
				this.$color = changedProperties["color"];
			}
			
			this.render(this.$value, this.$info, this.$color);
		}
</script>
</body>
</html>
	}
customElements.define("plane-test", Plane);
})();               