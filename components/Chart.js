import React, { Component } from 'react'
import {LineChart} from 'react-d3-basic'
const d3 = require('d3')

function getDataByCategory (dataset, category, threshold) {
  var queue = dataset.filter(set => set.category === category)
  if(queue.length >= threshold) queue.splice(0, queue.length - threshold)
  return queue
}

function generateChartSeries(label){
  return [{ field: 'value', name: label, color: '#ff7f0e' }]
}

function getX(data){
  return d3.timeParse("%H:%M:%S,%L")(data.time)
}

const settings = {
  width: 700,
  height: 200,
  x: getX,
  xScale: 'time'
}

export default class PercentChart extends Component{
  render(){
    return (
      <div>
        <LineChart
          {...settings}
          chartSeries={generateChartSeries(this.props.label)}
          data={getDataByCategory(this.props.dataset, this.props.category, this.props.threshold)}
        />
      </div>
    )
  }
}
