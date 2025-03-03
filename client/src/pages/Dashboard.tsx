import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button, Container, TextField, MenuItem, Select, FormControl,
  Box, Snackbar, Alert, Typography, Grid, FormControlLabel,
  RadioGroup, Radio, Switch, Paper
} from "@mui/material";
import useAuthStore from "../store/authStore";
import useCourseStore from "../store/courseStore";
import CourseTable from "../components/CourseTable";
import Modal from "../components/Modal";
import CourseForm from "../components/CourseForm";
import { FetchCoursesParams } from "../store/courseStore"; 

const Dashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const { fetchCourses, courses, deleteCourse } = useCourseStore();

  const [open, setOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [resultsPerPage, setResultsPerPage] = useState(10);
  const [filterStatus, setFilterStatus] = useState("");
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("DESC");

  useEffect(() => {
    fetchCourses({
      search,
      sort: sortBy as FetchCoursesParams["sort"], 
      order: sortOrder as FetchCoursesParams["order"], 
      limit: resultsPerPage,
      page,
      status: filterStatus || undefined, 
      rating: onlyFavorites ? 5 : undefined, 
    });
  }, [search, sortBy, sortOrder, resultsPerPage, page, filterStatus, onlyFavorites, fetchCourses]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    logout();
    navigate("/login");
  };

  const handleOpenAddCourse = () => {
    setSelectedCourse(null);
    setOpen(true);
  };

  const handleShowSnackbar = (message: string, severity: "success" | "error" = "success") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  return (
    <Container maxWidth="lg">
      
      <Paper elevation={3} sx={{ p: 3, backgroundColor: "#f5f5f5", borderRadius: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h4" fontWeight="bold" color="primary">📚 Course Dashboard</Typography>
          <Button variant="contained" color="error" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      </Paper>

      
      <Paper elevation={2} sx={{ p: 3, mt: 3, backgroundColor: "#ffffff", borderRadius: 2 }}>
        <Grid container spacing={3} alignItems="center">
          {/* Search */}
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="🔍 Search Courses"
              variant="outlined"
              fullWidth
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Grid>

          
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Status Filter</Typography>
            <RadioGroup
              row
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <FormControlLabel value="" control={<Radio />} label="All" />
              <FormControlLabel value="Not Started" control={<Radio />} label="Not Started" />
              <FormControlLabel value="In Progress" control={<Radio />} label="In Progress" />
              <FormControlLabel value="Completed" control={<Radio />} label="Completed" />
            </RadioGroup>
          </Grid>

          
          <Grid item xs={12} sm={6} md={4} display="flex" alignItems="center">
            <FormControlLabel
              control={
                <Switch
                  checked={onlyFavorites}
                  onChange={() => setOnlyFavorites(!onlyFavorites)}
                  color="success"
                />
              }
              label="⭐ Show Only 5-Star Courses"
            />
          </Grid>
        </Grid>
      </Paper>

      
      <Paper elevation={2} sx={{ p: 3, mt: 3, backgroundColor: "#ffffff", borderRadius: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          
          <Box display="flex" alignItems="center" gap={3}>
            
            <Box>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Results per page</Typography>
              <FormControl style={{ width: 120 }}>
                <Select
                  value={resultsPerPage}
                  onChange={(e) => setResultsPerPage(Number(e.target.value))}
                >
                  {[5, 10, 20, 50].map((num) => (
                    <MenuItem key={num} value={num}>
                      {num}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            
            <Box>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Sort by</Typography>
              <FormControl style={{ width: 150 }}>
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <MenuItem value="title">Title</MenuItem>
                  <MenuItem value="platform">Platform</MenuItem>
                  <MenuItem value="rating">Rating</MenuItem>
                  <MenuItem value="createdAt">Date Added</MenuItem>
                </Select>
              </FormControl>
            </Box>

            
            <Box>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Sort Order by</Typography>
            <FormControl style={{ width: 120 }}>
              <Select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as "ASC" | "DESC")}
              >
                <MenuItem value="ASC">Ascending</MenuItem>
                <MenuItem value="DESC">Descending</MenuItem>
              </Select>
            </FormControl>
            </Box>
          </Box>

          
          <Button variant="contained" color="primary" onClick={handleOpenAddCourse}>
            + Add Course
          </Button>
        </Box>
      </Paper>

      
      <Box mt={3}>
        <CourseTable
          courses={courses}
          onSelectCourse={(course) => {
            setSelectedCourse(course);
            setOpen(true);
          }}
          onDeleteCourse={(id) => {
            deleteCourse(id);
            handleShowSnackbar("🗑️ Course deleted successfully!", "success");
          }}
        />
      </Box>

      
      <Box display="flex" justifyContent="center" gap={2} mt={3}>
        <Button disabled={page === 1} onClick={() => setPage(page - 1)}>
          ⬅️ Previous
        </Button>
        <Typography variant="body1">
          Page {page}
        </Typography>
        <Button disabled={courses.length < resultsPerPage} onClick={() => setPage(page + 1)}>
          Next ➡️
        </Button>
      </Box>

      
      <Modal open={open} title={selectedCourse ? "✏️ Edit Course" : "+ Add Course"} onClose={() => setOpen(false)}>
        <CourseForm
          onClose={() => setOpen(false)}
          course={selectedCourse || {}}
          onSave={() => handleShowSnackbar(selectedCourse ? "✅ Course updated successfully!" : "✅ Course added successfully!", "success")}
        />
      </Modal>

      
      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)}>
        <Alert severity={snackbarSeverity} onClose={() => setSnackbarOpen(false)}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

    </Container>
  );
};

export default Dashboard;
