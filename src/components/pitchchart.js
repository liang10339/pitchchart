import React, { useEffect, useState } from "react";
import { Scatter } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import "./pitchchart.css";

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

const PitchChart = () => {
  const [chart, setChart] = useState({});
  // const baseUrl ="https://statsinsight-code-interview.herokuapp.com/get/Get_Balls_CI";
  // const baseUrl ="http://localhost:8080/api/";
  var baseUrl = "https://polastats.herokuapp.com/";
  var proxyUrl = "https://cors-anywhere.herokuapp.com/";

  useEffect(() => {
    const fetchStats = async () => {
      await fetch(`${proxyUrl}${baseUrl}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      })
        .then((response) => {
          if (response.ok) {
            response.json().then((data) => {
              setChart(data);
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };
    fetchStats();
  }, [baseUrl, proxyUrl]);

  let positions = [];
  for (let i = 0; i < chart.length; i++) {
    positions.push({
      type: chart[i].TaggedPitchType,
      x: chart[i].APP_KZoneY,
      y: chart[i].APP_KZoneZ,
    });
  }

  const color = {
    FB: "#FF0000",
    CB: "#0080FF",
    CH: "#007500",
    FT: "#b62170",
    SL: "#FFFF37",
    SP: "#FF8000",
    CT: "#613030",
    SFF: "#D94600",
    KN: "#6F00D2",
    SC: "#00f2ff",
  };

  let backgroundColor = [];
  for (let i = 0; i < positions.length; i++) {
    for (let j = 0; j < Object.keys(color).length; j++) {
      if (positions[i].type === Object.keys(color)[j]) {
        positions[i].type = Object.values(color)[j];
      }
    }
  }
  for (let i = 0; i < positions.length; i++) {
    backgroundColor.push(positions[i].type);
  }

  const options = {
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        display: true,
      },
      x: {
        beginAtZero: true,
        display: true,
      },
    },
  };
  const data = {
    datasets: [
      {
        data: [...positions],
        backgroundColor: [...backgroundColor],
      },
    ],
  };

  const plugin = {
    id: "custom_canvas_background",
    beforeDraw: (chart) => {
      let imageObj = new Image();
      imageObj.src = require("../strikezone.png");
      const { ctx } = chart;
      ctx.save();
      ctx.globalCompositeOperation = "destination-over";
      imageObj.onload = function () {
        ctx.drawImage(imageObj, -320, -400);
      };
      ctx.restore();
    },
  };

  return (
    <div className="wrapper">
      <div className="box">
        <Scatter width={1796} height={2083} options={options} data={data} plugins={[plugin]} />
      </div>
    </div>
  );
};

export default PitchChart;
