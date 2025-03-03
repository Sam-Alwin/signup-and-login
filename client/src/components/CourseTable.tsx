import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { Star, StarBorder } from "@mui/icons-material";
import { Course } from "../store/courseStore";


interface CourseTableProps {
  courses: Course[];
  onSelectCourse: (course: Course) => void;
  onDeleteCourse: (id: number) => void; 
}

const CourseTable: React.FC<CourseTableProps> = ({ courses, onSelectCourse, onDeleteCourse }) => {
  const renderStars = (rating: number | undefined) => {
    const safeRating = rating && rating >= 1 && rating <= 5 ? rating : 0; 
    return Array.from({ length: 5 }).map((_, index) =>
      index < safeRating ? <Star key={index} color="primary" /> : <StarBorder key={index} color="disabled" />
    );
  };

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><b>Title</b></TableCell>
            <TableCell><b>Platform</b></TableCell>
            <TableCell><b>Category</b></TableCell>
            <TableCell><b>Status</b></TableCell>
            <TableCell><b>Rating</b></TableCell>
            <TableCell><b>Actions</b></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {courses.length > 0 ? (
            courses.map((course) => (
              <TableRow key={course.id}>
                <TableCell>{course.title}</TableCell>
                <TableCell>{course.platform}</TableCell>
                <TableCell>{course.category}</TableCell>
                <TableCell>{course.status}</TableCell>
                <TableCell>{renderStars(course.rating)}</TableCell>
                <TableCell>
                  <IconButton onClick={() => onSelectCourse(course)}>
                    <Edit color="primary" />
                  </IconButton>
                  <IconButton onClick={() => onDeleteCourse(course.id)}> {/* ✅ Call delete function */}
                    <Delete color="error" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} align="center">
                No courses available.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CourseTable;
