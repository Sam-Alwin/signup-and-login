import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { TextField, Button, MenuItem, Container, Box, FormControl, InputLabel, Select, Typography, Rating, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import useCourseStore from "../store/courseStore";

interface Course {
  id?: number;
  title: string;
  platform: string;
  category: string;
  status: string;
  rating: number;
}

interface CourseFormProps {
  onClose: () => void;
  onSave?: () => void;
  course?: Course;
}

const CourseForm = ({ onClose, onSave, course }: CourseFormProps) => {
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<Course>({
    defaultValues: {
      title: "",
      platform: "",
      category: "",
      status: "Not Started",
      rating: 1,
    },
  });

  const { addCourse, updateCourse } = useCourseStore();

  useEffect(() => {
    if (course) {
      reset(course);
    } else {
      reset({
        title: "",
        platform: "",
        category: "",
        status: "Not Started",
        rating: 1,
      });
    }
  }, [course, reset]);

  const onSubmit = (data: Course) => {
    if (course?.id) {
      updateCourse(course.id, data);
    } else {
      addCourse(data);
    }

    if (onSave) {
      onSave();
    }

    reset();
    onClose();
  };

  return (
    <Container>
      
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
      <Typography>Your course details</Typography>
        <IconButton onClick={onClose} color="error"> 
          <CloseIcon />
        </IconButton>
      </Box>

    
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          fullWidth
          label="Title"
          {...register("title", { required: "Title is required" })}
          margin="normal"
          error={!!errors.title}
          helperText={errors.title?.message}
        />
        <TextField
          fullWidth
          label="Platform"
          {...register("platform", { required: "Platform is required" })}
          margin="normal"
          error={!!errors.platform}
          helperText={errors.platform?.message}
        />
        <TextField
          fullWidth
          label="Category"
          {...register("category", { required: "Category is required" })}
          margin="normal"
          error={!!errors.category}
          helperText={errors.category?.message}
        />

        
        <FormControl fullWidth margin="normal">
          <InputLabel></InputLabel>
          <Select
            defaultValue={course?.status || "Not Started"} 
            {...register("status", { required: "Status is required" })}
          >
            <MenuItem value="Not Started">Not Started</MenuItem>
            <MenuItem value="In Progress">In Progress</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
          </Select>
        </FormControl>

        {/* ⭐ Rating as Star Icons */}
        <Box display="flex" alignItems="center" mt={2}>
          <Typography variant="subtitle1" sx={{ mr: 2 }}>Rating:</Typography>
          <Rating
            defaultValue={course?.rating || 1}
            onChange={(_, newValue) => setValue("rating", newValue || 1)}
            size="large"
          />
        </Box>

        <Box mt={2} display="flex" justifyContent="center" gap={2}>
          <Button variant="contained" color="primary" type="submit">
            Save
          </Button>
          <Button variant="outlined" color="secondary" onClick={onClose}>
            Cancel
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default CourseForm;
