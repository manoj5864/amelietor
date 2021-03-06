import * as d3 from 'd3';
import colorbrewer from 'colorbrewer';

function getNode(data) {
  let svg = d3.select("svg");
  svg.selectAll("*").remove();
  if(data.length >= 2) {
    let x_elements = d3.set(data.map(item => item.conceptName)).values();
    let y_elements = d3.set(data.map(item => item.personName)).values();

    let itemSize = 22,
      cellSize = itemSize - 1,
      margin = {top: 100, right: 10, bottom: 10, left: 100};

    let width = x_elements.length * 25 - margin.right - margin.left + 100,
      height = y_elements.length * 25 - margin.top - margin.bottom + 100;

    let values = d3.set(data.map(function (item) {
      return item.value;
    })).values();

    let xScale = d3.scaleBand()
      .domain(x_elements)
      .range([0, x_elements.length * itemSize]); //rangeBands

    let xAxis = d3.axisTop().scale(xScale).tickFormat(function (d) {
      return d;
    });

    let yScale = d3.scaleBand()//scale.ordinal
      .domain(y_elements)
      .range([0, y_elements.length * itemSize]); //Bands

    let yAxis = d3.axisLeft().scale(yScale).tickFormat(function (d) {
      return d;
    });

    let colors = colorbrewer.OrRd[9]
    let colorScale = d3.scaleQuantile()
      .domain(values)
      .range(colors);

    svg.attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);

    let g = svg.append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    let cells = g.selectAll('rect')
      .data(data)
      .enter().append('g').append('rect')
      .attr('class', 'cell')
      .attr('width', cellSize)
      .attr('height', cellSize)
      .attr('y', function (d) {
        return yScale(d.personName);
      })
      .attr('x', function (d) {
        return xScale(d.conceptName);
      })
      .attr('fill', function (d) {
        return colorScale(d.value);
      });

    cells.append("title").text(function (d) {
      return d.value;
    });

    g.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .selectAll('text')
      .attr('font-weight', 'normal');

    g.append("g")
      .attr("class", "x axis")
      .call(xAxis)
      .selectAll('text')
      .attr('font-weight', 'normal')
      .style("text-anchor", "start")
      .attr("dx", ".8em")
      .attr("dy", ".5em")
      .attr("transform", function (d) {
        return "rotate(-65)";
      });
  } else {
    svg.attr("width", "100%")
      .attr("height", "100%");
    svg.append('text')
      .text('This project does not have sufficient data. Please select different project.')
      .attr('x', '40%')
      .attr('y', '20%');
  }
  return svg;
}

function doubleScroll(element) {
  element.setAttribute('style', 'overflow-y: auto;');
  let scrollbar= document.createElement('div');
  scrollbar.appendChild(document.createElement('div'));
  scrollbar.style.overflow= 'auto';
  scrollbar.style.overflowY= 'hidden';
  scrollbar.firstChild.style.width= element.scrollWidth+'px';
  scrollbar.firstChild.style.paddingTop= '1px';
  scrollbar.firstChild.appendChild(document.createTextNode('\xA0'));
  scrollbar.onscroll= function() {
    element.scrollLeft= scrollbar.scrollLeft;
  };
  element.onscroll= function() {
    scrollbar.scrollLeft= element.scrollLeft;
  };

  element.parentNode.insertBefore(scrollbar, element);
}

let d3HeatMap = {
  getNode: getNode
};

export default d3HeatMap;
