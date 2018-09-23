
d3.json("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json", function (error, dataset) {
	if (error) throw error;

	// Define format
	var timeParse = d3.timeParse("%M:%S");
	var timeFormat = d3.timeFormat("%M:%S");
	var color = d3.scaleOrdinal(d3.schemeCategory10.slice(1, 3));

	// Set the dimensions of the canvas / graph
	var w = 1000;
	var h = 500;
	var margin = 100;

	var svg = d3.select("body").
	append("svg").
	attr("width", w + margin * 2).
	attr("height", h + margin * 2).
	append("g").
	attr("transform", "translate(" + margin + "," + margin + ")");

	// Add title
	svg.append("text").
	attr("id", "title").
	attr("x", 250).
	attr("y", -50).
	text("Doping in Professional Bicycle Racing").
	style("font-size", "30px");

	// Define tooltip
	var tooltip = d3.select("body").
	append("div").
	style("visibility", "hidden").
	attr("id", "tooltip");

	// Set the ranges
	var xScale = d3.scaleLinear().
	domain([d3.min(dataset, function (d) {return d.Year;}) - 1, d3.max(dataset, function (d) {return d.Year;}) + 1]).
	range([0, w]);

	var yScale = d3.scaleTime().
	domain(d3.extent(dataset, function (d) {
		return timeParse(d.Time);
	})).
	range([0, h]);

	// Define and add the axes
	var xAxis = d3.axisBottom(xScale).tickFormat(d3.format('d'));
	var yAxis = d3.axisLeft(yScale).tickFormat(timeFormat);

	svg.append("g").
	attr("id", "x-axis").
	attr("transform", "translate(0," + h + ")").
	call(xAxis);

	svg.append("g").
	attr("id", "y-axis").
	call(yAxis);

	svg.append('text').
	attr('transform', 'rotate(-90)').
	attr('x', -320).
	attr('y', -50).
	style('font-size', 18).
	text('Time in Minutes');

	svg.append('text').
	attr('x', 480).
	attr('y', 550).
	style('font-size', 18).
	text('Years');

	// Add dots and tooltips
	svg.selectAll("circle").
	data(dataset).
	enter().
	append("circle").
	attr("class", "dot").
	attr("cx", function (d) {return xScale(d.Year);}).
	attr("cy", function (d) {return yScale(timeParse(d.Time));}).
	attr("r", 5).
	attr("data-xvalue", function (d) {return d.Year;}).
	attr("data-yvalue", function (d) {return timeParse(d.Time);}).
	on("mouseover", function (d) {
		tooltip.style("visibility", "visible").
		attr("data-year", d3.select(this).attr("data-xvalue")).
		html(d.Name + ", " + d.Nationality + "<br>Year: " + d.Year + "<br>Time: " + d.Time + "<br>" + d.Doping).
		style("left", d3.select(this).attr("cx") + "px").
		style("top", d3.select(this).attr("cy") + "px");}).
	on("mouseout", function () {return tooltip.style("visibility", "hidden");}).
	style("fill", function (d) {
		return color(d.Doping !== "");
	});

	// Add legend
	var legend = svg.selectAll(".legend").
	data(color.domain()).
	enter().
	append("g").
	attr("class", "legend").
	attr("id", "legend").
	attr("transform", function (d, i) {
		return "translate(0," + (h / 15 - i * 20) + ")";
	});

	legend.append("rect").
	attr("x", w - 18).
	attr("width", 18).
	attr("height", 18).
	style("fill", color);

	legend.append("text").
	attr("x", w - 24).
	attr("y", 9).
	attr("dy", ".35em").
	style("text-anchor", "end").
	text(function (d) {
		if (d) {return "Riders with doping allegations";} else
		{return "No doping allegations";}
	});
});