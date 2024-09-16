import PropTypes from "prop-types";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";

import { fNumber } from "../../utilities/format-number";

import Chart, { useChart } from "../components/chart";

// ----------------------------------------------------------------------

export default function TreemapChart({ title, subheader, chart, ...other }) {
  const { colors, series, options } = chart;

  const chartSeries = [
    {
      data: series.map((item) => ({
        x: item.label,
        y: item.value,
      })),
    },
  ];

  const chartOptions = useChart({
    colors,
    tooltip: {
      marker: { show: true },
      y: {
        formatter: (value) => fNumber(value),
        title: {
          formatter: () => "",
        },
      },
    },
    plotOptions: {
      treemap: {
        distributed: false,
        enableShades: true,
      },
    },
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: true,
    },
    ...options,
  });

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />
      <Box sx={{ mx: 3 }}>
        <Chart
          dir="ltr"
          type="treemap"
          series={chartSeries}
          options={chartOptions}
          width="100%"
          height={364}
        />
      </Box>
    </Card>
  );
}

TreemapChart.propTypes = {
  chart: PropTypes.shape({
    colors: PropTypes.arrayOf(PropTypes.string),
    series: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.number,
      })
    ),
    options: PropTypes.object,
  }),
  subheader: PropTypes.string,
  title: PropTypes.string,
};
