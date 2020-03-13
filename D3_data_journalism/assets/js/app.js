// @TODO: YOUR CODE HERE!
// start with defining svg dimensions
var svgWidth = 960;
var svgHeight = 600;

var axisDelay = 1000;
var circleDelay = 1000;

//set the margin
var margin = { top: 20, right: 40, bottom: 100, left: 100};

//calculate chart dimenstion by adjusting the margin
var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.bottom - margin.top;

// create svg wrapper, append an svg group that will hold scatter plot
var svg = d3
          .select('#scatter')
          .append('svg')
          .attr('width', svgWidth)
          .attr('height', svgHeight);

// append a svg group
var chartGroup = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

var url = "./assets/data/data.csv";
d3.csv(url, rowConverter)
  .then(createChart)
  .catch(function(error){
      console.log('*******unexpected error occurred*******');
      console.log(error);
  });

  function rowConverter(row){
      row.poverty = +row.poverty;
      row.povertyMoe = +row.povertyMoe;
      row.age = +row.age;
      row.ageMoe = +row.ageMoe;
      row.income = +row.income;
      row.incomeMoe = +row.incomeMoe;
      row.healthcare = +row.healthcare;
      row.healthcareLow = +row.healthcareLow;
      row.healthcareHigh = +row.healthcareHigh;
      row.obesity = +row.obesity;
      row.obesityLow = +row.obesityLow;
      row.obesityHigh = +row.obesityHigh;
      row.smokes = +row.smokes;
      row.smokesLow = +row.smokesLow;
      row.smokesHigh = +row.smokesHigh;
      // console.log(row);
      return row;
  };

function createChart(povertyData){
    // store the current information into activeInfo object
    var activeInfo = {
        data: povertyData,
        currentX: 'poverty', //poverty
        currentY: 'healthcare' //healthcare
    };

    activeInfo.xScale = d3.scaleLinear()
      .domain(getXDomain(activeInfo))
      .range([0,chartWidth]);
    
    activeInfo.yScale = d3.scaleLinear()
      .domain(getYDomain(activeInfo))
      .range([chartHeight, 0])

    activeInfo.xAxis = d3.axisBottom(activeInfo.xScale);
    activeInfo.yAxis = d3.axisLeft(activeInfo.yScale);

    createAxis(activeInfo);

    createCircles(activeInfo);

    createToolTip(activeInfo);

    createLabels();

    d3.selectAll('.aText').on('click', function() {
        handleClick(d3.select(this), activeInfo);
    });
}

function handleClick(label, activeInfo) {
    var axis = label.attr('data-axis');
    var name = label.attr('data-name');

    if (label.classed('active')) {
        //no need to do anything if clicked on active axis
        return;
    }
    updateLabel(label, axis)

    if(axis === 'x') {
        activeInfo.currentX = name;
        activeInfo.xScale.domain(getXDomain(activeInfo));
        renderXAxes(activeInfo);
        renderHorizontal(activeInfo);
        createToolTip(activeInfo);
    }
    else {
        // add logic to handle Y axis click
        activeInfo.currentY = name;
        activeInfo.yScale.domain(getYDomain(activeInfo));
        renderYAxes(activeInfo);
        renderVertical(activeInfo);
        createToolTip(activeInfo)
    }
}

function createLabels() {
    var xlabelsGroup = chartGroup.append('g')
      .attr('class', 'xText')
      .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + 20})`);

    xlabelsGroup.append('text')
      .attr('x', 0)
      .attr('y', 20)
      .attr('data-name', 'poverty')
      .attr('data-axis', 'x')
      .attr('class', 'aText active x')
      .text('in Poverty (%)');
    
    xlabelsGroup.append('text')
      .attr('x', 0)
      .attr('y', 40)
      .attr('data-name', 'age')
      .attr('data-axis', 'x')
      .attr('class', 'aText inactive x')
      .text('Age (Median)');
    
    xlabelsGroup.append('text')
      .attr('x', 0)
      .attr('y', 60)
      .attr('data-name', 'income')
      .attr('data-axis', 'x')
      .attr('class', 'aText inactive x')
      .text('Household Income (Median)');

    var ylabelsGroup = chartGroup.append('g')
      .attr('class', 'yText')
      .attr("transform", 'rotate(-90)');

    ylabelsGroup.append('text')
      .attr('y', -40)
      .attr('x', -chartHeight/2)
      .attr('dy', '1em')
      .attr('data-name', 'healthcare')
      .attr('data-axis', 'y')
      .attr('class', 'aText active y')
      .text('Lacks Healthcare (%)');

    ylabelsGroup.append('text')
      .attr('y', -60)
      .attr('x', -chartHeight/2)
      .attr('dy', '1em')
      .attr('data-name', 'smokes')
      .attr('data-axis', 'y')
      .attr('class', 'aText inactive y')
      .text('Smokes (%)');

    ylabelsGroup.append('text')
      .attr('y', -80)
      .attr('x', -chartHeight/2)
      .attr('dy', '1em')
      .attr('data-name', 'obesity')
      .attr('data-axis', 'y')
      .attr('class', 'aText inactive y')
      .text('Obese (%)');
}

function createCircles(activeInfo) {
  var currentX = activeInfo.currentX;
  var currentY = activeInfo.currentY;
  var xScale = activeInfo.xScale;
  var yScale = activeInfo.yScale;

  chartGroup.selectAll('circle')
    .data(activeInfo.data)
    .enter()
    .append('circle')
    .attr('cx', d => xScale(d[currentX]))
    .attr('cy', d => yScale(d[currentY]))
    .attr('r', 12)
    // .attr('fill', '#b2cae1')
    .attr('opacity', '0.5')

  chartGroup.selectAll()
    .data(activeInfo.data)
    .enter()
    .append("text")
    .text(d => (d.abbr))
    .attr('class', 'stateText')
    .attr("x", d => xScale(d[currentX]))
    .attr("y", d => yScale(d[currentY]-0.2))
    .style("font-size", "12px")
    // .style("text-anchor", "middle") //this is already defined in d3Style.css
    // .style('fill', 'white'); //this is already defined in d3Style.css
}

function createAxis(activeInfo) {
  chartGroup.append('g')
    .call(activeInfo.yAxis)
    .attr('class', 'y-axis')

  chartGroup.append('g')
    .call(activeInfo.xAxis)
    .attr('class', 'x-axis')
    .attr('transform', `translate(0, ${chartHeight})`)
}

function renderXAxes(activeInfo) {
  chartGroup.select('.x-axis').transition()
    .duration(axisDelay)
    .call(activeInfo.xAxis);
}

function renderYAxes(activeInfo) {
  chartGroup.select('.y-axis').transition()
    .duration(axisDelay)
    .call(activeInfo.yAxis);
}

function getXDomain(activeInfo) {
  var min = d3.min(activeInfo.data, d => d[activeInfo.currentX]);
  var max = d3.max(activeInfo.data, d => d[activeInfo.currentX]);
  return [min * 0.95, max * 1.1]
}

function getYDomain(activeInfo) {
  var min = d3.min(activeInfo.data, d => d[activeInfo.currentY])
  var max = d3.max(activeInfo.data, d => d[activeInfo.currentY])
  return [min * 0.8, max]
}

function renderHorizontal(activeInfo) {
  d3.selectAll('circle')
    .each(adjustCircles)

  function adjustCircles() {
    d3.select(this)
      .transition()
      .attr('cx', d => activeInfo.xScale(d[activeInfo.currentX]))
      .duration(circleDelay)
  }

  d3.selectAll('.stateText')
  .each(function() {
    d3.select(this)
      .transition()
      .attr('x', d => activeInfo.xScale(d[activeInfo.currentX]))
      .duration(circleDelay)
  })
}

function renderVertical(activeInfo) {
  d3.selectAll('circle')
    .each(function() {
      d3.select(this)
        .transition()
        .attr('cy', d => activeInfo.yScale(d[activeInfo.currentY]))
        .duration(circleDelay)
    })
    d3.selectAll('.stateText')
    .each(function() {
      d3.select(this)
        .transition()
        .attr('y', d => activeInfo.yScale(d[activeInfo.currentY]-0.2))
        .duration(circleDelay)
    })
}

function updateLabel(label, axis) {
  d3.selectAll('.aText')
    .filter('.' + axis)
    .filter('.active')
    .classed('active', false)
    .classed('inactive', true);

  label.classed('inactive', false).classed('active', true)
}

function createToolTip(activeInfo) {
  var xlabel;
  var ylabel;

  if(activeInfo.currentX === 'poverty') {
    xlabel = "Poverty (%)";
  }
  else if(activeInfo.currentX === 'age'){
    xlabel = "Age (Median)";
  }
  else {
    xlabel = 'Income (Median)'
  };

  if(activeInfo.currentY === 'healthcare') {
    ylabel = "Lacks Healthcare";
  }
  else if(activeInfo.currentY === 'smokes'){
    ylabel = "Smokes (%)";
  }
  else {
    ylabel = 'Obese (%)'
  };

  var toolTip = d3.tip()
    .attr('class', 'd3-tip') //tooltip
    .offset([80, -60])
    .html(function (d) {
      var html = d.state
        + '<br> ' + xlabel
        + ': '
        + d[activeInfo.currentX]
        + '<br> ' + ylabel
        +': '
        + d[activeInfo.currentY]
      return html;
    });

  chartGroup.call(toolTip);

  var circles = d3.selectAll('circle, .stateText');

  circles.on('mouseover', function (data) {
    toolTip.show(data);
  })

  circles.on('mouseout', function (data, index) {
    toolTip.hide(data);
  })
}

