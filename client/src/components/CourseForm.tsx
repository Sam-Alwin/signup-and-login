import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { TextField, Button, MenuItem, Container } from "@mui/material";
import useCourseStore from "../store/courseStore";

interface Course {
  id?: number;
  title: string;
  platform: string;
  category: string;
  status: string;
  rating?: number;
}

interface CourseFormProps {
  onClose: () => void;
  course?: Course;
}

const CourseForm = ({ onClose, course }: CourseFormProps) => {
  const { register, handleSubmit, reset, setValue } = useForm<Course>({
    defaultValues: {
      title: "",
      platform: "",
      category: "",
      status: "Not Started",
      rating: 0,
    },
  });

  const { addCourse, updateCourse } = useCourseStore();

  
  useEffect(() => {
    if (course) {
      reset(course);
    }
  }, [course, reset]);

  const onSubmit = (data: Course) => {
    if (course?.id) {
      updateCourse(course.id, data);
    } else {
      addCourse(data);
    }
    reset();
    onClose();
  };

  return (
    <Container>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField fullWidth label="Title" {...register("title")} margin="normal" defaultValue="" />
        <TextField fullWidth label="Platform" {...register("platform")} margin="normal" defaultValue="" />
        <TextField fullWidth label="Category" {...register("category")} margin="normal" defaultValue="" />
        
        <TextField select fullWidth label="Status" {...register("status")} margin="normal" defaultValue="Not Started">
          <MenuItem value="Not Started">Not Started</MenuItem>
          <MenuItem value="In Progress">In Progress</MenuItem>
          <MenuItem value="Completed">Completed</MenuItem>
        </TextField>

        <TextField fullWidth label="Rating" type="number" {...register("rating")} margin="normal" defaultValue={0} />

        <Button variant="contained" color="primary" type="submit">Save</Button>
      </form>
    </Container>
  );
};

export default CourseForm;
