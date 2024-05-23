import ReactApexChart from "react-apexcharts";
import { useTranslation } from "react-i18next";

export default function DonutChart({ amounts, categories }) {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === "rtl";

  const donutChart = {
    series: amounts,
    options: {
      chart: {
        height: 300,
        type: "donut",
        zoom: {
          enabled: false,
        },
        toolbar: {
          show: false,
        },
      },
      stroke: {
        show: false,
      },
      labels: categories,
      colors: [
        "#990000",
        "#b36b00",
        "#ac3973",
        "#2d5986",
        "#339966",
        "#008080",
      ],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
          },
        },
      ],
      legend: {
        position: "bottom",
      },
    },
  };
  return (
    <ReactApexChart
      series={donutChart.series}
      options={donutChart.options}
      className="rounded-lg bg-white  overflow-hidden"
      type="donut"
      height={300}
    />
  );
}
