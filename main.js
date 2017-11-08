// count :: [{"id": String, "prediction": String}] => [{id: {"0": Int, "1": Int}}]
// transform the prediction data into a more suitable shape: prediction counts
// indexed by id
const count = R.pipe(
  R.groupBy(R.prop('id')),
  R.map(R.countBy(R.prop('prediction'))),
)


// sort :: [id, {"0": Int, "1": Int}] => [id, {"0": Int, "1": Int}]
// sort the list of [id, counts] pairs by the count of "1", treating
// non-existent values as 0
const sort = R.sortBy(pair => pair[1][1] || 0)


// do the actual rendering using d3. This is not a pure function, as d3
// accesses the DOM heavily
const render = pairs => {
  const width = 960
  const height = 25 * pairs.length;

  const x = d3.scaleLinear().range([0, width])
  const y = d3.scaleBand().rangeRound([0, height]).paddingInner(.2)

  const svg = d3.select('body').append('svg').attr('width', width).attr('height', height)

  x.domain([0, 15])
  y.domain(R.map(R.head, pairs))

  const bar = svg.selectAll('.bar')
                 .data(pairs)
                 .enter()
                 .append('a').attr('href', d => '#id=' + d[0])
                 .append('g')
                 .attr('transform', d => 'translate(' + x(0) + ',' + y(d[0]) + ')')

  // "0" predictions
  bar.append('rect')
                 .attr('fill', 'green')
                 .attr('width', d => x(d[1][0] || 0))
                 .attr('height', y.bandwidth())
                 .attr('x', 0)

  // "1" predictions
  bar.append('rect')
                 .attr('fill', 'red')
                 .attr('width', d => x(d[1][1] || 0))
                 .attr('height', y.bandwidth())
                 .attr('x', d => x(d[1][0]))

  // labels
  bar.append('text')
        .attr('fill', 'white')
        .attr('font-family', 'sans-serif')
        .attr('x', 5)
        .attr('y', 15)
        .text(d => d[0])
}


// main :: data => null
// process the data using the above functions
const main = R.pipe(
  count,
  R.toPairs,
  sort,
  R.reverse,
  //R.tap(console.log.bind(console)),
  render,
)


// fetch data, parse, run it through the main process
fetch('/data.json').then(
  response => response.json()
).then(
  data => main(data)
)
