const svg = d3.select('svg');

const arrowPoints = [[0, 0], [0, 20], [20, 10]];

height = 300
width = 320
marginTop = 15, // the top margin, in pixels
marginRight = 30, // the right margin, in pixels
marginBottom = 30, // the bottom margin, in pixels
marginLeft = 100, // the left margin, in pixels

yLen = height - marginTop - marginBottom
xLen = width - marginLeft - marginRight
x0 = marginLeft
y0 = yLen + marginTop

d3.selectAll('svg')
  .attr("width", width)
  .attr("height", height)
  .attr("viewBox", [0, 0, width, height])
  .attr("overflow", "visible")
  .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

function xPos(d,i) {
  return (i + 1) * (xLen / data.length);
}

function tria(d,i) {
  if((value * i)== 0) {
    return 'none';
  } else {
    return 'url(#triangle)';
  }
}

function getVal(d,i) {
  return f(data[i]);
}

const f = d3.format(",.2f");


// Defining triangle marker
svg
  .append('defs')
  .append('marker')
  .attr('id', 'triangle')
  .attr('viewBox', [0, 0, 20, 20])
  .attr('refX', 20)
  .attr('refY', 10)
  .attr('markerWidth', 10)
  .attr('markerHeight', 10)
  .attr('orient', 'auto-start-reverse')
  .append('path')
  .attr('d', d3.line()(arrowPoints))
  .attr('stroke', 'black');  

// Defining dot marker
svg
  .append('defs')
  .append('marker')
  .attr('id', 'dot')
  .attr('viewBox', [0, 0, 20, 20])
  .attr('refX', 10)
  .attr('refY', 10)
  .attr('markerWidth', 5)
  .attr('markerHeight', 5)
  .append('circle')
  .attr('cx', 10)
  .attr('cy', 10)
  .attr('r', 10)
  .style('fill', 'black');

function yMaxCalc(valueOrig){
  let digits = Math.floor(valueOrig).toString().length;
  let yMax = 10**digits;
  if (valueOrig < 1){
    yMax = 1;
  } 
  return yMax;
}

function makeSideLabel(className, value, preText, valueOrig){
  d3.select(className).select('#arrows')
    .append('text')
    .text(preText + valueOrig)
    .attr('x', -10)
    .attr('y', -value)
    .style("text-anchor", "end")  
    .attr('alignment-baseline', 'middle')
}

function makeArrows(className, data, xPosition){
  d3.select(className).select('#arrows').selectAll('line')
  .data(data)
  .enter().append('line')
  .attr('x1', xPosition)
  .attr('y1', 0)
  .attr('x2', xPosition)
  .attr('y2', function(d,i){return data[i]})
  .attr('stroke', 'black')
  .attr('marker-end',         
  function (d,i) {
    if(data[i] == 0) {
      return 'none';
    } else {
      return 'url(#triangle)';
    }
  })
}

function makeDefaultArrows(className, data, xPosition, xLabel){
  d3.select(className).select('#arrows').selectAll('line')
    .data(data)
    .enter().append('line')
    .attr('x1', xPosition)
    .attr('y1', 0)
    .attr('x2', xPosition)
    .attr('y2', 
      function(d,i){
        if(xLabel[i] == null){
          return data[i] / 2;
        } else
          return data[i];
        })
    .attr('stroke', 
      function(d,i){
        if(xLabel[i] == null){
          return '';
        } else
          return 'black';
        })
    .attr('marker-end',         
    function (d,i) {
      if(data[i] == 0) {
        return 'none';
      } else if (xLabel[i] == null){
        return 'url(#dot)'
      } else {
        return 'url(#triangle)';
      }
    })
}

function makeTopLabel(className, data, text){
  d3.select(className).select('#arrows').selectAll('#valueLabel')  
    .data(data)
    .enter().append('text')
    .text(text)
    .style("text-anchor", "middle")  
    .attr('alignment-baseline', 'middle')  
    .attr('x', xPos)
    .attr('y', function(d,i){return data[i]  - 10})
    .attr('id', 'valueLabel')
}

// To make a top label based on an array
function makeDefaultTopLabel(className, data, gLabel){
  d3.select(className).select('#arrows').selectAll('#valueLabel')  
    .data(data)
    .enter().append('text')
    .text(function(d,i){
      if(gLabel[i] == null){
        return;
      } else
        return gLabel[i];
      })
    .style("text-anchor", "middle")  
    .attr('alignment-baseline', 'middle')  
    .attr('x', xPos)
    .attr('y', function(d,i){return data[i]  - 10})
    .attr('id', 'valueLabel')
}

function makeDashedLine(className, data, xStart){
  d3.select(className).select('#arrows')
  .append('line')
  .attr('x1', xStart)
  .attr('y1', function(d,i){return data[0]})
  .attr('x2', xLen)
  .attr('y2', function(d,i){return data[data.length - 1]})
  .attr('stroke', 'black') 
  .attr('stroke-dasharray', '4')
}

function makeXLabel(className, data, valueOrig){
  d3.select(className).select('#arrows').selectAll('#xLabel')
    .data(data)
    .enter().append('text')
    .text(function(d,i){return data[i]})
    .style("text-anchor", "middle")  
    .attr('alignment-baseline', 'middle')  
    .attr('x', xPos)
    .attr('y', 15 * Math.sign(valueOrig))  
    .attr('id', 'xLabel')
}

// listens for changes in form to update graphs
const selectElement = document.querySelector('.form');
selectElement.addEventListener('input', (event) => {
  d3.selectAll('#arrows').remove();
  let P = +document.getElementById('P').value
  let n = +document.getElementById('n').value
  let i = +document.getElementById('i').value
  
  if (!P || !i || !n){
    console.log('please enter all three values')
    makeDefaultGraphs('#PtoP', 6, 7000, 'P')
    makeDefaultGraphs('#PtoA', 6, 1428.91, 'A')
    makeDefaultGraphs('#PtoF', 6, 9997.27, 'F')
    makeDefaultGraphs('#PtoG', 6, 614.02, '')
  } else {
    let f = (1 + i) ** n
    F = P * f
    A = P * [(i * f)/(f - 1)]
    G = P / [(f - i*n - 1) / ((i ** 2)*f)]
    if (n > 10){
      makeDefaultGraphs('#PtoP', n, P, d3.format(",.2f")(P))
      makeDefaultGraphs('#PtoA', n, A, d3.format(",.2f")(A))
      makeDefaultGraphs('#PtoF', n, F, d3.format(",.2f")(F))
      makeDefaultGraphs('#PtoG', n, G, 'G=' + d3.format(",.2f")(G))
    } else {
      makeGraphs('#PtoP', n, P)
      makeGraphs('#PtoA', n, A)
      makeGraphs('#PtoF', n, F)
      makeGraphs('#PtoG', n, G)
    }
  }
});

let makeGraphs = (className, n, valueOrig) => {
  if (className == '#PtoG') {
    yMax = yMaxCalc(valueOrig * n)
  } else {
    yMax = yMaxCalc(valueOrig)
  }
  let value = (valueOrig / yMax) * (yLen)
  // Sub group for adding the arrows, axis labels, and data labels
  arrows = d3.select(className).select('#axes').append('g').attr('id', 'arrows')
  // yMax label
  arrows
    .append('text')
    .text(d3.format("$~s")(yMax))
    .attr('x', 0)
    .attr('y', -yLen - 20)
    .style("text-anchor", "middle")
    .attr('alignment-baseline', 'hanging')  
  // Making the x-axis labels
  data = Array(n).fill(0);
  for(let i=0; i<n; i++){
    data[i] = i + 1;
  }
  makeXLabel(className, data, valueOrig)

  // creates data, arrows
  if (className == '#PtoA') {
    data = Array(n).fill(-value);
    makeArrows(className, data, xPos)
    makeSideLabel(className, value, '', d3.format(",.2f")(valueOrig))
    makeDashedLine(className, data, 0)
  } 
  else if (className == '#PtoG') {
    data = Array(n).fill(-value);
    for(let i=0; i<n; i++){
      data[i] = data[i] * i;
    }
    makeArrows(className, data, xPos)
    makeTopLabel(className, data, function(d,i){return i + "G"})
    makeSideLabel(className, value, 'G=', d3.format(",.2f")(valueOrig))
    makeDashedLine(className, data, xPos)
  } 
  else if (className == '#PtoF') {
    data = Array(1).fill(-value);
    makeArrows(className, data, xPos)
    makeTopLabel(className, data, d3.format(",.2f")(valueOrig))
  } 
  else { // #PtoP
    data = Array(1).fill(-value);
    makeArrows(className, data, 0)
    makeSideLabel(className, value, '', d3.format(",.2f")(valueOrig))
  }
}

let makeDefaultGraphs = (className, n, valueOrig, valueLabel) => {
  if (className == '#PtoG') {
    yMax = yMaxCalc(valueOrig * n)
  } else {
    yMax = yMaxCalc(valueOrig)
  }
  let value = (valueOrig / yMax) * (yLen)

  // Sub group for adding the arrows, axis labels, and data labels
  arrows = d3.select(className).select('#axes').append('g').attr('id', 'arrows')
  // yMax label for n > 10
  if(n > 10) {
    arrows
    .append('text')
    .text(d3.format("$~s")(yMax))
    .attr('x', 0)
    .attr('y', -yLen - 20)
    .style("text-anchor", "middle")
    .attr('alignment-baseline', 'hanging') 

    nLabel = n
  } else {
    nLabel = 'n'
  }
  
  // Making the x-axis labels
  if (className == '#PtoA') {
    xLabel = [1, , , , ,nLabel];
    data = Array(6).fill(-value);
    makeDefaultArrows(className, data, xPos, xLabel)
    makeSideLabel(className, value, '', valueLabel)
    makeDashedLine(className, data, 0)
  } 
  else if (className == '#PtoG') {
    xLabel = [1,2, , , ,nLabel];
    gLabel = [0,'G', , , ,'G(n-1)'];
    data = Array(6).fill(-value);
    for(let i=0; i<6; i++){
      data[i] = data[i] * n * i / 6;
    }
    makeDefaultArrows(className, data, xPos, xLabel)
    makeDefaultTopLabel(className, data, gLabel)
    makeSideLabel(className, value, '', valueLabel)
    makeDashedLine(className, data, xPos)
  } 
  else if (className == '#PtoF') {
    xLabel = [nLabel];
    data = Array(1).fill(-value);
    makeArrows(className, data, xPos)
    makeTopLabel(className, data, valueLabel)
  } 
  else { // #PtoP
    xLabel = [nLabel];
    data = Array(1).fill(-value);
    makeArrows(className, data, 0)
    makeSideLabel(className, value, '', valueLabel)
  }
  data = xLabel
  makeXLabel(className, data, valueOrig)
}

let makeAxes = (className) => {
  // Making the axes
  axes = d3.select(className).append('g')
  .attr('transform', `translate(${x0}, ${y0})`)
  .attr('id', 'axes')
  x = axes.append('line')
  .attr('x1', 0)
  .attr('y1', 0)
  .attr('x2', xLen)
  .attr('y2', 0)
  .attr('stroke', 'black')
  y = axes.append('line')
  .attr('x1', 0)
  .attr('y1', 0)
  .attr('x2', 0)
  .attr('y2', -yLen)
  .attr('stroke', 'black')

}

makeAxes('#PtoP')
makeAxes('#PtoA')
makeAxes('#PtoF')
makeAxes('#PtoG')

makeDefaultGraphs('#PtoP', 6, 7000, 'P')
makeDefaultGraphs('#PtoA', 6, 1428.91, 'A')
makeDefaultGraphs('#PtoF', 6, 9997.27, 'F')
makeDefaultGraphs('#PtoG', 6, 614.02, '')