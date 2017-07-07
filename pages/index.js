/*
  The client can be accessed by heading to
  the following URL

  https://client-gsxiebtrwj.now.sh

  Notice that this URL can change in future releases
*/

import React, {Component} from 'react'
import io from 'socket.io-client'
import {LineChart} from 'react-d3-basic'
import Chart from '../components/Chart'
const d3 = require('d3')

const socket = new io('https://gateway-nnevregslr.now.sh')

function myGetTime() {
    var d = new Date();
    var hh = d.getHours();
    var mm = d.getMinutes();
    var ss = d.getSeconds();
    var ms = d.getMilliseconds();

    return [hh, mm, ss].join(':') + "," + ms;
}

const chartSeries = [
  {
    field: 'y',
    name: 'Total',
    color: '#ff7f0e'
  }
]

function x(data){
  return d3.timeParse("%H:%M:%S,%L")(data.x)
}

function datasetX(data){
  return d3.timeParse("%H:%M:%S,%L")(data.time)
}

const settings = {
  lineChart: {
    width: 700,
    height: 200,
    chartSeries,
    x,
    xScale: 'time'
  },
  datasetLineChart: {
    width: 700,
    height: 200,
    chartSeries: [
      {
        field: 'value',
        name: 'Total',
        color: '#ff7f0e'
      }
    ],
    x: datasetX,
    xScale: 'time'
  }
}

var ms = 0;

function getDatasetByCategory (dataset, categoryName) {
  return dataset.filter(set => set.category === categoryName)
}

export default class Index extends Component{
  state = { data: [], dataset: [] }

  componentDidMount = () => {
    socket.on('data', (data) => {
      if(data.user && data.category && data.value) {
        if(/(cpu|memory)/.test(data.category))
          data.value = Math.round(data.value * 100)

        data.time = myGetTime()
        const dataset = this.state.dataset
        dataset.push(data)
        if(dataset.length > 1000) dataset.shift()

        this.setState({ dataset })
      } else {
        console.log('Inavlid data format');
      }
    })

    socket.on('log', (data) => {
      console.log("Some log");
    })
  }

  render(){
    return (
      <div>
        <Chart socket={socket} threshold={120} category="cpu" label="CPU" dataset={this.state.dataset}/>
        <Chart socket={socket} threshold={10} category="memory" label="Memory" dataset={this.state.dataset}/>
      </div>
    )
  }
}
