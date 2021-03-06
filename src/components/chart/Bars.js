import React, { Component } from "react";
import { Bar } from "react-chartjs-2";
const ApiService = require("../../services/Api").default;
const Api = new ApiService();
const Spinner = require('../../images/spinner.svg');

export default class Bars extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chartData: {},
    };
  }

  componentDidUpdate(prevProps) {
    if(prevProps.value === this.props.value) {
      return;
    }
    //API calls here
    const action = "observations/histogram";
    const query = "";
    const taxon_id = this.props.value.taxon_id;
    const per_page = "31";
    const date_field = "observed";
    const interval = "day";
    let month = this.props.month;
    let year = this.props.year;

    const url = `${action}?&q=${query}&taxon_id=${taxon_id}&date_field=${date_field}&page=2&interval=${interval}&month=${month}&year=${year}&per_page=${per_page}`;
    Api.get(url).then(data => {
      // Check if returns results than set a valid state
      const observation = data.results.day;

      const labels = Object.keys(observation).map((e) => parseInt(e.slice(-2), 10));
      const values = Object.keys(observation).map((e) => observation[e]);

      this.setState({
        chartData: {
          labels: labels,
          datasets: [
            {
              label: "Number of sightings",
              data: values,
              backgroundColor: "rgb(77,175,165)"
            }
          ]
        }
      });
    });
  }

  render() {
    if (Object.keys(this.state.chartData).length > 0) {
      return (
        <div className="chart-container">
          <Bar
            data={this.state.chartData}
            options={{
              title: {
                display: true,
                text: 'Number of sightings',
                fontSize: 25,
                fontFamily: "'Open Sans', 'sans serif'"
              },
              legend: {
                display: false,
                position: "top"
              },
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                yAxes: [
                  {
                    ticks: {
                      beginAtZero: true
                    }
                  }
                ]
              }
            }}
            redraw={true}
          />
        </div>
      );
    } else {
      return (
        <div><img className='spinner' src={Spinner} alt="Loading"/></div>
      );
    }
  }
}
