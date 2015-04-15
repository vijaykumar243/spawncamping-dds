function Scatter2D() {}

Scatter2D.prototype = new Visualization();
Scatter2D.prototype.constructor = Visualization;
Scatter2D.prototype.parent = Visualization.prototype;

Scatter2D.prototype._draw = function(pointsWithTypes) {
	var scatterVis = this;
	function drawScatter() {
		var points = pointsWithTypes.points;
		var types = pointsWithTypes.types;

		scatterVis._chartDiv = generateDiv(document.getElementById("content"), "chart");
		scatterVis._chartDiv.className = "c3";

		var margin = scatterVis._margin;
		var width = window.innerWidth - margin.left - margin.right;
		var height = window.innerHeight - margin.top - margin.bottom;

		var x;
		if (types.x == "number") {
			var minX = d3.min(points, function(p) { return p.x; });
			var maxX = d3.max(points, function(p) { return p.x; });
			var dX = maxX - minX;
			x = d3.scale.linear()
				.domain([minX - dX * 0.01, maxX + dX * 0.01])
				.range([0, width]);
		} else {
			x = d3.scale.ordinal()
				.domain(_.uniq(points.map(function(p) { return p.x })))
				.rangeBands([0, width]);
		}

		var y;
		if (types.y == "number") {
			var minY = d3.min(points, function(p) { return p.y; });
			var maxY = d3.max(points, function(p) { return p.y; });
			var dY = maxY - minY;
			y = d3.scale.linear()
					  .domain([minY - dY * 0.02, maxY + dY * 0.02])
					  .range([height, 0]);
		} else {
			y = d3.scale.ordinal()
				.domain(_.uniq(points.map(function(p) { return p.y })))
				.rangeBands([height, 0]);
		}

		var chart = d3.select("#chart")
			.append('svg:svg')
			.attr('width', width + margin.right + margin.left)
			.attr('height', height + margin.top + margin.bottom)
			.attr('class', 'c3')

		var main = chart.append('g')
			.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
			.attr('width', width)
			.attr('height', height)
			.attr('class', 'main')

		var xAxis = d3.svg.axis()
			.scale(x)
			.orient('bottom');

		main.append('g')
			.attr('transform', 'translate(0,' + height + ')')
			.attr('class', 'x axis')
			.call(xAxis);

		var yAxis = d3.svg.axis()
			.scale(y)
			.orient('left');

		main.append('g')
			.attr('transform', 'translate(0,0)')
			.attr('class', 'y axis')
			.call(yAxis);

		var g = main.append("svg:g");

		g.selectAll("scatter-dots")
		  .data(points)
		  .enter().append("svg:circle")
			  .attr("cx", function (p) {
				if (types.x == "number") {
					return x(p.x)
				} else {
					var jitter = (document.jitterEnabled) ? (x.rangeBand() * (Math.random(1) - 0.5) * 0.4) : 0;
					return x(p.x) + (x.rangeBand() / 2) + jitter;
				}
			  })
			  .attr("cy", function (p) {
				if (types.y == "number") {
					return y(p.y)
				} else {
					var jitter = (document.jitterEnabled) ? (y.rangeBand() * (Math.random(1) - 0.5) * 0.4) : 0;
					return y(p.y) + (y.rangeBand() / 2) + jitter;
				}
			  })
			  .attr("r", 3);
	}

	var enableJitterButton = document.createElement('div');
    enableJitterButton.setAttribute("id", "enableJitterButton");
    document.getElementById("header").appendChild(enableJitterButton);
	enableJitterButton.onclick = function() {
		if (document.jitterEnabled) {
			document.jitterEnabled = false;
			enableJitterButton.setAttribute("class", "disabled");
			enableJitterButton.setAttribute("title", "Enable Jitter");
		} else {
			document.jitterEnabled = true;
			enableJitterButton.setAttribute("class", "enabled");
			enableJitterButton.setAttribute("title", "Disable Jitter");
		}
		document.getElementById("content").innerHTML = "";
		drawScatter();
	};
	if (document.jitterEnabled) {
		enableJitterButton.setAttribute("class", "enabled");
		enableJitterButton.setAttribute("title", "Disable Jitter");
	} else {
		enableJitterButton.setAttribute("class", "disabled");
		enableJitterButton.setAttribute("title", "Enable Jitter");
	}
	this._enableJitterButton = enableJitterButton;
	drawScatter();
}

Scatter2D.prototype.clear = function() {
	removeElementIfExists(this._chartDiv);
	removeElementIfExists(this._enableJitterButton);
}
