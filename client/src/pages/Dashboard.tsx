import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Container, TextField, MenuItem, Select, FormControl, InputLabel, Box } from "@mui/material";
import useAuthStore from "../store/authStore";
import useCourseStore from "../store/courseStore";
import CourseTable from "../components/CourseTable";
import Modal from "../components/Modal";
import CourseForm from "../components/CourseForm";

const Dashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const { fetchCourses, courses } = useCourseStore();

  const [open, setOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [resultsPerPage, setResultsPerPage] = useState(10);

  useEffect(() => {
    fetchCourses();
  }, []);

  
  const handleLogout = () => {
    localStorage.removeItem("token"); 
    logout(); 
    navigate("/login"); 
  };

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(search.toLowerCase())
  );

  const paginatedCourses = filteredCourses.slice(
    (page - 1) * resultsPerPage,
    page * resultsPerPage
  );

  return (
    <Container maxWidth="md">
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Dashboard</h1>

      
      <Box display="flex" justifyContent="center" mb={2}>
        <TextField
          label="Search Courses"
          variant="outlined"
          fullWidth
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Box>

      
      <Box display="flex" justifyContent="center" gap={2} mb={2}>
        <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
          Add Course
        </Button>
        <Button variant="contained" color="secondary" onClick={handleLogout}>
          Logout
        </Button>
      </Box>

      
      <Box display="flex" justifyContent="center" mb={2}>
        <FormControl style={{ width: 150 }}>
          <InputLabel>Results per page</InputLabel>
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

      
      <CourseTable
        courses={paginatedCourses}
        onSelectCourse={(course) => {
          setSelectedCourse(course);
          setOpen(true);
        }}
      />

      
      <Box display="flex" justifyContent="center" gap={2} mt={2}>
        <Button disabled={page === 1} onClick={() => setPage(page - 1)}>
          Previous
        </Button>
        <span> Page {page} </span>
        <Button
          disabled={page * resultsPerPage >= filteredCourses.length}
          onClick={() => setPage(page + 1)}
        >
          Next
        </Button>
      </Box>

      
      <Modal open={open} title={selectedCourse ? "Edit Course" : "Add Course"} onClose={() => setOpen(false)}>
        <CourseForm onClose={() => setOpen(false)} course={selectedCourse} />
      </Modal>
    </Container>
  );
};

export default Dashboard;
