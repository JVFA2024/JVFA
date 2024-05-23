import ReactApexChart from "react-apexcharts";
import { useTranslation } from "react-i18next";

export default function LineChart({ amounts, categories }) {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === "rtl";

  if (amounts.length === 0 && categories.length === 0) {
    amounts = JSON.parse(localStorage.getItem("amounts"));
    categories = JSON.parse(localStorage.getItem("categories"));
  }

  const lineChart = {
    series: [
      {
        name: t("charts.spent"),
        data: amounts,
      },
    ],
    options: {
      chart: {
        height: 300,
        type: "line",
        toolbar: false,
      },
      colors: ["#024A52"],
      tooltip: {
        marker: false,
        y: {
          formatter(number) {
            return number + " " + t("currency.SAR");
          },
        },
      },
      stroke: {
        width: 2,
        curve: "smooth",
      },
      xaxis: {
        categories: categories,
        axisBorder: {
          color: "#e0e6ed",
        },
      },
      yaxis: {
        opposite: false,
        labels: {
          offsetX: 0,
        },
      },
      grid: {
        borderColor: "#e0e6ed",
      },
    },
  };
  return (
    <ReactApexChart
      series={lineChart.series}
      options={lineChart.options}
      className="rounded-lg bg-white overflow-hidden"
      type="line"
      height={300}
    />
  );
}
