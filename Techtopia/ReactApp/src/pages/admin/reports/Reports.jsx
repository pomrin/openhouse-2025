// import "./Reports.css";
import { useEffect, useMemo } from "react";
import http from "../../http";
// import {
//   AnimatedAxis,
//   AnimatedGrid,
//   AnimatedLineSeries,
//   Tooltip,
//   XYChart,
// } from "@visx/xychart";

const data1 = [
  {
    x: "2018-03-01",
    y: 30,
  },
  {
    x: "2018-04-01",
    y: 16,
  },
  {
    x: "2018-05-01",
    y: 17,
  },
  {
    x: "2018-06-01",
    y: 24,
  },
  {
    x: "2018-07-01",
    y: 47,
  },
  {
    x: "2018-08-01",
    y: 32,
  },
  {
    x: "2018-09-01",
    y: 8,
  },
  {
    x: "2018-10-01",
    y: 27,
  },
  {
    x: "2018-11-01",
    y: 31,
  },
  {
    x: "2018-12-01",
    y: 105,
  },
  {
    x: "2019-01-01",
    y: 166,
  },
  {
    x: "2019-02-01",
    y: 181,
  },
  {
    x: "2019-03-01",
    y: 232,
  },
  {
    x: "2019-04-01",
    y: 224,
  },
  {
    x: "2019-05-01",
    y: 196,
  },
  {
    x: "2019-06-01",
    y: 211,
  },
];

// const tickLabelOffset = 10;

// const accessors = {
//   xAccessor: (d) => new Date(`${d.x}T00:00:00`),
//   yAccessor: (d) => d.y,
// };

// const LineChart = () => {
//   return (
//     <div className="chart-container">
//       <XYChart
//         height={270}
//         margin={{ left: 60, top: 35, bottom: 38, right: 27 }}
//         xScale={{ type: "time" }}
//         yScale={{ type: "linear" }}
//       >
//         <AnimatedGrid
//           columns={false}
//           numTicks={4}
//           lineStyle={{
//             stroke: "#e1e1e1",
//             strokeLinecap: "round",
//             strokeWidth: 1,
//           }}
//           strokeDasharray="0, 4"
//         />
//         <AnimatedAxis
//           hideAxisLine
//           hideTicks
//           orientation="bottom"
//           tickLabelProps={() => ({ dy: tickLabelOffset })}
//           left={30}
//           numTicks={4}
//         />
//         <AnimatedAxis
//           hideAxisLine
//           hideTicks
//           orientation="left"
//           numTicks={4}
//           tickLabelProps={() => ({ dx: -10 })}
//         />
//         <AnimatedLineSeries
//           stroke="#008561"
//           dataKey="primary_line"
//           data={data1}
//           {...accessors}
//         />
//         <Tooltip
//           snapTooltipToDatumX
//           snapTooltipToDatumY
//           showSeriesGlyphs
//           glyphStyle={{
//             fill: "#008561",
//             strokeWidth: 0,
//           }}
//           renderTooltip={({ tooltipData }) => {
//             return (
//               <div className="tooltip-container">
//                 {Object.entries(tooltipData.datumByKey).map((lineDataArray) => {
//                   const [key, value] = lineDataArray;
//                   return (
//                     <div className="row" key={key}>
//                       <div className="date">
//                         {format(accessors.xAccessor(value.datum), "MMM d")}
//                       </div>
//                       <div className="value">
//                         <div
//                           className="colored-square"
//                           style={{ background: "#008561" }}
//                         />
//                         {accessors.yAccessor(value.datum)}
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             );
//           }}
//         />
//       </XYChart>
//     </div>
//   );
// };

// export default function ReportsTest() {
//   const [itemCategoryData, setItemCategoryData] = useState([]);
//   const [itemModelData, setItemModelData] = useState([]);

//   // inclues all the statuses to get every loan request
//   const loanRequestStatus = [-3, -2, -1, 0, 1, 2, 3, 4]; // You can change this array to include the desired statuses

//   // Convert the array to a query string
//   const queryParams = loanRequestStatus
//     .map((status) => `loanRequestStatus=${status}`)
//     .join("&");

//   useEffect(() => {
//     const token = localStorage.getItem("accessToken");
//     const fetchData = async () => {
//       const [itemCategoryRes, itemModelRes, loansRes] = await Promise.all([
//         http.get(`/ItemCategory`, {
//           headers: { Authorization: "Bearer " + token },
//         }),
//         http.get(`/ItemModel`, {
//           headers: { Authorization: "Bearer " + token },
//         }),
//         http.get(`/LoanRequestByLoanStatus?${queryParams}`, {
//           headers: { Authorization: "Bearer " + token },
//         }),
//       ]);

//       setItemCategoryData(itemCategoryRes.data);
//       console.log(itemCategoryRes.data);
//       console.log(itemModelRes.data);
//       console.log(loansRes.data);
//     };
//     fetchData();
//   }, []);

const ReportsTest = () => {
  const loanRequestStatus = useMemo(() => [-3, -2, -1, 0, 1, 2, 3, 4], []);

  const queryParams = useMemo(
    () =>
      loanRequestStatus
        .map((status) => `loanRequestStatus=${status}`)
        .join("&"),
    [loanRequestStatus]
  );

  const token = useMemo(() => localStorage.getItem("accessToken"), []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [itemCategoryRes, itemModelRes, loansRes] = await Promise.all([
          http.get(`/ItemCategory`),
          http.get(`/ItemModel`),
          http.get(`/LoanRequestByLoanStatus?${queryParams}`),
        ]);

        // setItemCategoryData(itemCategoryRes.data);
        console.log("Category:", itemCategoryRes.data);
        console.log("Model:", itemModelRes.data);
        console.log("Loans:", loansRes.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [queryParams, token]);

  return <div className="App">{/* <LineChart /> */}</div>;
};

export default ReportsTest;
