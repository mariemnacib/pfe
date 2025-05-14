"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function UserCountCircleChart() {
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    async function fetchUserCount() {
      try {
        const response = await fetch("/api/user/count");
        const data = await response.json();
        setUserCount(data.count);
      } catch (error) {
        console.error("Failed to fetch user count:", error);
      }
    }
    fetchUserCount();
  }, []);

  const options: ApexOptions = {
    chart: {
      type: "radialBar",
      height: 280,
      sparkline: {
        enabled: true,
      },
    },
    plotOptions: {
      radialBar: {
        hollow: {
          size: "65%",
          background: "#f4f4f4",
          dropShadow: {
            enabled: true,
            top: 3,
            left: 0,
            blur: 4,
            opacity: 0.15,
          },
        },
        track: {
          background: "#e7e7e7",
          strokeWidth: "100%",
        },
        dataLabels: {
          name: {
            show: true,
            fontSize: "18px",
            color: "#333",
            offsetY: -10,
            fontWeight: "600",
          },
          value: {
            show: true,
            fontSize: "28px",
            color: "#111",
            offsetY: 10,
            fontWeight: "700",
            formatter: function (val: number) {
              return val.toString();
            },
          },
        },
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "light",
        type: "horizontal",
        shadeIntensity: 0.5,
        gradientToColors: ["#4f46e5"],
        inverseColors: true,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100],
      },
    },
    stroke: {
      lineCap: "round",
    },
    labels: ["Users"],
  };

  const series = [userCount];

  return (
    <div className="rounded-2xl border border-gray-300 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-900">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4 text-center">
        Total Users
      </h3>
      <ReactApexChart options={options} series={series} type="radialBar" height={280} />
    </div>
  );
}
