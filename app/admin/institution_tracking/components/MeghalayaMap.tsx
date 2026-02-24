"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Chart as ChartJS,
  Tooltip,
  Legend,
  ChartOptions
} from "chart.js";

import {
  ChoroplethController,
  GeoFeature,
  ColorScale,
  ProjectionScale,
  IGeoChartOptions
} from "chartjs-chart-geo";

import { Chart } from "react-chartjs-2";

ChartJS.register(
  ChoroplethController,
  GeoFeature,
  ColorScale,
  ProjectionScale,
  Tooltip,
  Legend
);

const normalize = (name: string) =>
  name?.toLowerCase().replace(/\s/g, "");

export default function MeghalayaMap({ districts }: any) {
  const [geoData, setGeoData] = useState<any>(null);

  useEffect(() => {
    fetch("/maps/meghalaya.geojson")
      .then(res => res.json())
      .then(data => {
        console.log(
          "Geo districts:",
          data.features.map((f: any) => f.properties.district)
        );
        setGeoData(data);
      })
      .catch(err => console.error("GeoJSON error:", err));
  }, []);

  const config = useMemo(() => {
    if (!geoData) return null;

    const dataset = geoData.features.map((feature: any) => {
      const districtName = feature.properties?.district;

      const match = districts?.find(
        (d: any) =>
          normalize(d.name) === normalize(districtName)
      );

      return {
        feature,
        value: match?.approval_percent_shgs ?? 0
      };
    });

    const options: ChartOptions<"choropleth"> & IGeoChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      showGraticule: false,

      scales: {
        projection: {
          axis: "x",
          projection: "mercator"
        },
        color: {
          axis: "x",
          interpolate: (v: number) => {
            if (v > 85) return "#16a34a";
            if (v > 70) return "#22c55e";
            if (v > 50) return "#facc15";
            return "#ef4444";
          }
        }
      },

      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx: any) =>
              `${ctx.label}: ${ctx.raw.value}% approval`
          }
        }
      }
    };

    return {
      data: {
        labels: dataset.map(
          (d: any) => d.feature.properties?.district
        ),
        datasets: [
          {
            label: "Approval %",
            data: dataset,
            outline: geoData,
            showOutline: true
          }
        ]
      },
      options
    };
  }, [geoData, districts]);

  if (!config) {
    return <div className="p-6">Loading map...</div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h2 className="text-lg font-semibold mb-4">
        Meghalaya District Approval Map
      </h2>

      <div className="h-[600px] w-full">
        <Chart
          type="choropleth"
          data={config.data}
          options={config.options}
        />
      </div>
    </div>
  );
}
