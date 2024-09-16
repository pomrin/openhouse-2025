import { Container, Grid, Typography, Box } from '@mui/material';
import { useState, useEffect, useMemo } from "react";
import http from "../../http";

import AppCurrentVisits from "./app-current-visits";
import AppWebsiteVisits from "./app-website-visits";
import AppWidgetSummary from "./app-widget-summary";
import TreemapChart from "./chart-treemap";

import { useLoader } from "../../../contexts/LoaderContext";
import Loader from "../../../components/Loader";

// ----------------------------------------------------------------------

export default function AppView() {
  const [users, setUsers] = useState([]);
  const [itemCategories, setItemCategories] = useState([]);
  const [itemModels, setItemModels] = useState([]);
  const [assets, setAssets] = useState([]);
  const [assetsByCategory, setAssetsByCategory] = useState({});
  const [usersByRole, setUsersByRole] = useState([]);

  const [loanRequestsChartLabels, setLoanRequestsChartLabels] = useState([]);
  const [totalLoanRequests, setTotalLoanRequests] = useState([]);
  const [approvedLoanRequests, setApprovedLoanRequests] = useState([]);
  const [rejectedLoanRequests, setRejectedLoanRequests] = useState([]);
  const [pendingLoanRequests, setPendingLoanRequests] = useState([]);
  const [newLoanRequests, setNewLoanRequests] = useState([]);

  const { loading, setLoading } = useLoader();

  const loanRequestStatus = useMemo(() => [-3, -2, -1, 0, 1, 2, 3, 4], []);

  const queryParams = useMemo(() => loanRequestStatus, [loanRequestStatus]);

  useEffect(() => {
    setLoading(true)
    const fetchData = async () => {
      try {
        const [loginRes, itemCategoryRes, itemModelRes, loansRes, assetsRes] =
          await Promise.all([
            http.get(`/Login`),
            http.get(`/ItemCategory`),
            http.get(`/ItemModel`),
            http.get(`/LoanRequestByLoanStatus?${queryParams}`),
            http.get(`/AssetItemSearch`),
          ]);

        setUsers(loginRes.data);
        setItemCategories(itemCategoryRes.data);
        setItemModels(itemModelRes.data);
        setAssets(assetsRes.data);

        // Count assets for each category and store with category names
        const assetsCountByCategory = {};
        assetsRes.data.forEach((asset) => {
          const categoryId = asset.catId;
          const categoryName = itemCategoryRes.data.find(
            (category) => category.catId === categoryId
          ).catName;
          if (categoryId in assetsCountByCategory) {
            assetsCountByCategory[categoryId].value++;
          } else {
            assetsCountByCategory[categoryId] = {
              label: categoryName,
              value: 1,
            };
          }
        });
        setAssetsByCategory(assetsCountByCategory);

        // Convert assetsByCategory to the format needed for the treemap chart
        const assetsByCatsList = Object.entries(assetsCountByCategory).map(
          ([, value]) => value
        );

        const staffRolesMapped = [
          { roleId: null, roleName: null },
          { roleId: 1, roleName: "USER" },
          { roleId: 2, roleName: "TSO" },
          { roleId: 3, roleName: "TSO-MANAGER" },
          { roleId: 4, roleName: "AD/DD" },
          { roleId: 5, roleName: "ADMIN" },
          { roleId: 6, roleName: "STORE_USER" },
          { roleId: 7, roleName: "STORE_ADMIN" },
          { roleId: 8, roleName: "STUDENT" },
        ];

        const countUsersByRole = (users, roles) => {
          const roleCount = roles.reduce((acc, role) => {
            acc[role.roleId] = { label: role.roleName, value: 0 };
            return acc;
          }, {});

          users.forEach((user) => {
            if (user.roleId in roleCount) {
              roleCount[user.roleId].value += 1;
            }
          });

          return Object.values(roleCount).filter((role) => role.value > 0);
        };

        const countedUsersByRole = countUsersByRole(users, staffRolesMapped);
        setUsersByRole(countedUsersByRole);

        // Loan Request Data
        const groupByMonth = (requests) => {
          return requests.reduce((acc, request) => {
            const month = new Date(request.dateRequest).toLocaleString(
              "default",
              { month: "long", year: "numeric" }
            );
            if (!acc[month]) {
              acc[month] = {
                requests: [],
                totalCount: 0,
                rejectedCount: 0,
                approvedCount: 0,
                newCount: 0,
                pendingCount: 0,
              };
            }
            acc[month].requests.push(request);
            acc[month].totalCount += 1;

            switch (request.status) {
              case -3:
              case -2:
              case -1:
                acc[month].rejectedCount += 1;
                break;
              case 2:
              case 3:
              case 4:
                acc[month].approvedCount += 1;
                break;
              case 0:
                acc[month].newCount += 1;
                break;
              case 1:
                acc[month].pendingCount += 1;
                break;
              default:
                break;
            }

            return acc;
          }, {});
        };

        const groupedRequests = groupByMonth(loansRes.data);

        // Formatting Loans Request Data on to the chart + Transform groupedRequests data into the format expected by the chart component
        const chartLabels = Object.keys(groupedRequests).map((key) => key);
        const totalLoanRequestsValue = Object.values(groupedRequests).map(
          (month) => month.totalCount
        );
        const approvedLoanRequestsValue = Object.values(groupedRequests).map(
          (month) => month.approvedCount
        );
        const rejectedLoanRequestsValue = Object.values(groupedRequests).map(
          (month) => month.rejectedCount
        );
        const pendingLoanRequestsValue = Object.values(groupedRequests).map(
          (month) => month.pendingCount
        );
        const newLoanRequestsValue = Object.values(groupedRequests).map(
          (month) => month.newCount
        );

        setLoanRequestsChartLabels(chartLabels);
        setTotalLoanRequests(totalLoanRequestsValue);
        setApprovedLoanRequests(approvedLoanRequestsValue);
        setRejectedLoanRequests(rejectedLoanRequestsValue);
        setPendingLoanRequests(pendingLoanRequestsValue);
        setNewLoanRequests(newLoanRequestsValue);

        console.log("groupedRequests", groupedRequests);
        console.log("Users", loginRes.data);
        console.log("Category:", itemCategoryRes.data);
        console.log("Model:", itemModelRes.data);
        console.log("Loans:", loansRes.data);
        console.log("Asset:", assetsRes.data);
        console.log("Assets by Categories", assetsCountByCategory);
        console.log("chartData", assetsByCatsList);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box sx={{
        top: 0,
        left: 250,
        bottom: 0,
        right: 0,
        position: 'fixed',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 1)',
        color: 'rgba(0, 0, 0, 1)',
        zIndex: 20,
      }}>
        <Loader loading={loading} />
      </Box>
    )
  }

  return (
    <Container maxWidth="xl" style={{ marginTop: "40px" }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Reports
      </Typography>
      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Total Assets"
            total={Object.keys(assets).length}
            color="success"
            icon={
              <img
                alt="icon"
                src="/assets/glass/ic_glass_bag.png"
              />
            }
          />
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Users"
            total={Object.keys(users).length}
            color="info"
            icon={
              <img
                alt="icon"
                src="/assets/glass/ic_glass_users.png"
              />
            }
          />
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Categories"
            total={Object.keys(itemCategories).length}
            color="warning"
            icon={
              <img
                alt="icon"
                src="/assets/glass/ic_glass_buy.png"
              />
            }
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Models"
            total={Object.keys(itemModels).length}
            color="error"
            icon={
              <img
                alt="icon"
                src="/assets/glass/ic_glass_message.png"
              />
            }
          />
        </Grid>
        <Grid xs={12} md={6} lg={8}>
          <AppWebsiteVisits
            title="Monthly Loan Requests"
            subheader=""
            chart={{
              labels: loanRequestsChartLabels,
              // Object.keys(groupedRequest)
              series: [
                {
                  name: "Total Loan Requests",
                  type: "column",
                  fill: "solid",
                  data: totalLoanRequests,
                },
                {
                  name: "Approved Loan Requests",
                  type: "area",
                  fill: "gradient",
                  data: approvedLoanRequests,
                },
                {
                  name: "Rejected Loan Requests",
                  type: "line",
                  fill: "solid",
                  data: rejectedLoanRequests,
                },
                {
                  name: "Pending Loan Requests",
                  type: "line",
                  fill: "solid",
                  data: pendingLoanRequests,
                },
                {
                  name: "New Loan Requests",
                  type: "line",
                  fill: "solid",
                  data: newLoanRequests,
                },
              ],
            }}
          />
        </Grid>
        <Grid xs={12} md={6} lg={4}>
          <AppCurrentVisits
            title="Account Types"
            chart={{
              series: usersByRole,
            }}
          />
        </Grid>
        <Grid xs={12} md={6} lg={12}>
          <TreemapChart
            title="Assets grouped by Categories"
            subheader=""
            chart={{
              series: Object.entries(assetsByCategory).map(
                ([key, value]) => value
              ),
            }}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
