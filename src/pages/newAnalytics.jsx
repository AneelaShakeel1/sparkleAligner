"use client"

import React, { useEffect, useState } from "react"
import { fetchAllTreatmentPreviewAsync } from "../store/treatmentpreview/treatmentpreviewSlice";
import { fetchAllPatientsApprovalsAsync } from "../store/patientsApprovals/patientsApprovalsSlice";
import { fetchAllApprovalsAsync } from "../store/doctorApproval/doctorApprovalSlice";
import { fetchAllTreatmentPreviewByAgentAsync } from "../store/treatmentPreviewByAgent/treatmentPreviewByAgentSlice";
import { fetchAllFinalStagePreviewsAsync } from "../store/FinalStagePreviewForDoctorByAgent/FinalStagePreviewForDoctorByAgentSlice";
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  InputAdornment,
  Avatar,
  IconButton,
  Tabs,
  Tab,
} from "@mui/material"
import {
  Person,
  Campaign,
  AttachMoney,
  ShowChart,
  CalendarToday,
  Search,
  Visibility,
  Edit,
  Delete,
  SupportAgent,
  PrecisionManufacturing,
  Medication,
  Receipt,
  Flaky,
  Verified,
  PersonAdd,
} from "@mui/icons-material"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts"
import { useDispatch, useSelector } from "react-redux"

export default function HRDashboard() {
  // Get data from Redux store

  const dispatch = useDispatch();

  const users = useSelector((state) => (state.user ? state.user.users : []))
  const { treatmentpreviews } = useSelector((state) => state.treatmentpreview);
  const { patientapprovals } = useSelector((state) => state.patientsApprovals);
  const { doctorapprovals } = useSelector((state) => state.doctorsApproval);
  const { treatmentpreviewsbyagent } = useSelector(
    (state) => state.treatmentpreviewbyagent
  );
  const { finalStagePreviews } = useSelector(
    (state) => state.finalStagePreview
  );
  // Example: compute dynamic counts based on user roles
  const totalUsers = users.length
  const totalPatients = users.filter((user) => user.role === "Patient").length
  const totalDoctors = users.filter((user) => user.role === "Doctor").length
  const totalManufacturers = users.filter((user) => user.role === "Manufacturer").length
  const totalAgents = users.filter((user) => user.role === "Agent").length

  // For demo purposes, we assign the four boxes as:
  // Box 1: Total Employees (using totalUsers)
  // Box 2: Campaign Sent (using totalDoctors as a placeholder)
  // Box 3: Annual Profit (we leave a hard-coded value here)
  // Box 4: Lead Conversation (hard-coded percentage)
  //
  // You can change these mappings as needed.
  const cardData = [
    {
      title: "Total Users",
      value: totalUsers.toLocaleString(),
      subtitle: `${totalUsers % 100} for last month`, // placeholder subtitle
      icon: <Person sx={{ color: "#2196f3", fontSize: 32 }} />,
    },
    {
      title: "Total Doctors",
      value: totalDoctors.toLocaleString(),
      subtitle: `${totalDoctors % 10} for last month`, // placeholder subtitle
      icon: <Medication      sx={{ color: "#2196f3", fontSize: 32 }} />,
    },
    {
      title: "Total Manufacturers",
      value: totalManufacturers.toLocaleString(),
      subtitle: `${totalManufacturers % 10} for last month`, // placeholder subtitle
      icon: <PrecisionManufacturing sx={{ color: "#2196f3", fontSize: 32 }} />,
    },
    {
      title: "Total Agents",
      value: totalAgents.toLocaleString(),
      subtitle: `${totalAgents % 10} for last month`, // placeholder subtitle
      icon: <SupportAgent sx={{ color: "#2196f3", fontSize: 32 }} />,
    },
  ]

  const statusCounts = {
    "Total Treatment Previews (TP) uploaded": treatmentpreviews.length,
    "TPs waiting for patient approval": treatmentpreviewsbyagent?.filter(
      (treatmentpreviewByAgent) =>
        !patientapprovals.some(
          (patientApproval) =>
            patientApproval.patientId._id ===
            treatmentpreviewByAgent.linkedPatientId._id
        )
    ).length,
    "TPs pending doctor review": finalStagePreviews?.filter(
      (finalStagePreview) =>
        !doctorapprovals.some(
          (doctorapproval) =>
            doctorapproval.patientId._id ===
            finalStagePreview.linkedPatientId._id
        )
    ).length,
  };



  const cardData2 = [
    {
      title: "Total Treatment previews uploaded",
      value: statusCounts["Total Treatment Previews (TP) uploaded"],
      subtitle: `${statusCounts["Total Treatment Previews (TP) uploaded"] % 100} until now`, // placeholder subtitle
      icon: <Receipt sx={{ color: "#2196f3", fontSize: 32 }} />,
    },
    {
      title: "TPs waiting for patient approval",
      value: statusCounts["TPs waiting for patient approval"],
      subtitle: `${statusCounts["TPs waiting for patient approval"] % 100} until now`, // placeholder subtitle
      icon: <Flaky      sx={{ color: "#2196f3", fontSize: 32 }} />,
    },
    {
      title: "TPs pending doctor review",
      value: statusCounts["TPs pending doctor review"],
      subtitle: `${statusCounts["TPs pending doctor review"] % 100} until now`, // placeholder subtitle
      icon: <Verified sx={{ color: "#2196f3", fontSize: 32 }} />,
    },
    {
      title: "Total Patients",
      value: totalPatients.toLocaleString(),
      subtitle: `${totalPatients % 10} until now`, // placeholder subtitle
      icon: <PersonAdd sx={{ color: "#2196f3", fontSize: 32 }} />,
    },
  ]




  useEffect(() => {
    dispatch(fetchAllTreatmentPreviewAsync());
    dispatch(fetchAllPatientsApprovalsAsync());
    dispatch(fetchAllApprovalsAsync());
    dispatch(fetchAllTreatmentPreviewByAgentAsync());
    dispatch(fetchAllFinalStagePreviewsAsync());
  }, [dispatch]);


  const [tabValue, setTabValue] = useState(0)
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  // Chart data (hard-coded demo)
  const chartData = [
    { date: "19 Dec", stock: 30, order: 70 },
    { date: "20 Dec", stock: 40, order: 60 },
    { date: "21 Dec", stock: 30, order: 70 },
    { date: "22 Dec", stock: 50, order: 90 },
    { date: "23 Dec", stock: 40, order: 80 },
    { date: "24 Dec", stock: 110, order: 150 },
    { date: "25 Dec", stock: 90, order: 240 },
    { date: "26 Dec", stock: 40, order: 90 },
    { date: "27 Dec", stock: 30, order: 120 },
    { date: "28 Dec", stock: 50, order: 60 },
    { date: "29 Dec", stock: 110, order: 160 },
  ]

  return (
    <Box sx={{ p: 3, bgcolor: "#f5f5f5", minHeight: "100vh" }}>
      {/* Header */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h5" fontWeight="bold">
            Dashboard
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <TextField size="small" value="03/21/2025 - 03/21/2025" sx={{ mr: 1 }} />
            <Button variant="contained" color="primary">
              <CalendarToday />
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* First Row of Metric Cards */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        {cardData.map((card, index) => (
          <Grid key={index} item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2, display: "flex", justifyContent: "space-between" }}>
              <Box>
                <Typography color="textSecondary" variant="subtitle1">
                  {card.title}
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  {card.value}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {card.subtitle}
                </Typography>
              </Box>
              <Box
                sx={{
                  bgcolor: "#f0f7ff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  p: 2,
                  borderRadius: 1,
                }}
              >
                {card.icon}
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Second Row of Metric Cards (duplicated same info) */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        {cardData2.map((card, index) => (
          <Grid key={`dup-${index}`} item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2, display: "flex", justifyContent: "space-between" }}>
              <Box>
                <Typography color="textSecondary" variant="subtitle1">
                  {card.title}
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  {card.value}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {card.subtitle}
                </Typography>
              </Box>
              <Box
                sx={{
                  bgcolor: "#f0f7ff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  p: 2,
                  borderRadius: 1,
                }}
              >
                {card.icon}
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Main Content */}
      <Grid container spacing={2}>
        {/* Chart Section */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Typography variant="h6">Audience Overview</Typography>
              <Box>
                <Tabs value={tabValue} onChange={handleTabChange}>
                  <Tab label="Week" />
                  <Tab label="Month" />
                  <Tab label="Year" />
                </Tabs>
              </Box>
            </Box>
            <Box sx={{ height: 300, width: "100%" }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="stock" stackId="1" stroke="#2196f3" fill="#2196f3" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="order" stackId="1" stroke="#90caf9" fill="#90caf9" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Paper>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Notice Board
                </Typography>
                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                  <Box
                    sx={{
                      bgcolor: "#f5f5f5",
                      p: 1,
                      borderRadius: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      minWidth: 60,
                    }}
                  >
                    <Typography variant="h6" fontWeight="bold">
                      14
                    </Typography>
                    <Typography variant="body2">Feb</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="medium">
                      Meeting for campaign with sales team
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      12:00am - 03:30pm
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Paper sx={{ p: 2 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                  <Typography variant="h6">Attendance</Typography>
                  <TextField
                    size="small"
                    placeholder="Search..."
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ width: 200 }}
                  />
                </Box>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>S.No</TableCell>
                        <TableCell>Employee</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Check In</TableCell>
                        <TableCell>Check Out</TableCell>
                        <TableCell>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>01</TableCell>
                        <TableCell>Diane Nolan</TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            size="small"
                            sx={{
                              bgcolor: "#2196f3",
                              color: "white",
                              textTransform: "none",
                              fontSize: "0.75rem",
                              py: 0.5,
                            }}
                          >
                            Present
                          </Button>
                        </TableCell>
                        <TableCell>09:30 am</TableCell>
                        <TableCell>06:30 pm</TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", gap: 1 }}>
                            <IconButton size="small">
                              <Visibility fontSize="small" />
                            </IconButton>
                            <IconButton size="small">
                              <Edit fontSize="small" />
                            </IconButton>
                            <IconButton size="small">
                              <Delete fontSize="small" />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>
          </Grid>
        </Grid>

        {/* Activity Section */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Typography variant="h6">Recent Activity</Typography>
              <Button variant="contained" color="primary">
                View All
              </Button>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {[
                { title: "Leave Approval Request", time: "6 min ago" },
                { title: "Work Update", time: "16 min ago" },
                { title: "Leave Approval Request", time: "6 min ago" },
                { title: "Work Update", time: "16 min ago" },
                { title: "Leave Approval Request", time: "6 min ago" },
              ].map((item, index) => (
                <Box key={index} sx={{ display: "flex", gap: 2 }}>
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      bgcolor: "#90caf9",
                      mt: 1,
                    }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography variant="subtitle1">{item.title}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        {item.time}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="textSecondary">
                      From "RuthDyer" UIDesign Leave On Monday 12 Jan 2020.
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Paper>

          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Typography variant="h6">Upcoming Interviews</Typography>
              <Button variant="contained" color="primary">
                View All
              </Button>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar src="/placeholder.svg?height=60&width=60" alt="Natalie Gibson" sx={{ width: 60, height: 60 }} />
              <Box>
                <Typography variant="subtitle1" fontWeight="medium">
                  Natalie Gibson
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  UI/UX Designer
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}
