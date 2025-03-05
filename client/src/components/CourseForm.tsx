import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { TextField, Button, MenuItem, Container, Box, FormControl, InputLabel, Select, Typography, Rating, Alert } from "@mui/material";
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
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<Course>({
    defaultValues: {
      title: "",
      platform: "",
      category: "",
      status: "Not Started",
      rating: 0, 
    },
  });

  const { addCourse, updateCourse, courses } = useCourseStore();
  const statusValue = watch("status"); 

  useEffect(() => {
    if (course) {
      
      reset(course);
    } else {
      
      reset({
        title: "",
        platform: "",
        category: "",
        status: "Not Started",
        rating: 0,
      });
    }
  }, [course, reset]);

  const onSubmit = (data: Course) => {
    
    const trimmedData = {
      ...data,
      title: data.title.trim(),
      platform: data.platform.trim(),
      category: data.category.trim(),
    };

    
    if (!trimmedData.title) {
      alert("Title cannot be empty or just spaces");
      return;
    }
    if (!trimmedData.platform) {
      alert("Platform cannot be empty or just spaces");
      return;
    }
    if (!trimmedData.category) {
      alert("Category cannot be empty or just spaces");
      return;
    }

    
    if (trimmedData.status === "Not Started") {
      trimmedData.rating = 0;
    } else if (trimmedData.rating < 1) {
      trimmedData.rating = 1; 
    }

    
    if (!course?.id) {
      const isDuplicate = courses.some(
        existingCourse =>
          existingCourse.title.toLowerCase() === trimmedData.title.toLowerCase() &&
          existingCourse.platform.toLowerCase() === trimmedData.platform.toLowerCase() &&
          existingCourse.category.toLowerCase() === trimmedData.category.toLowerCase()
      );
      
      if (isDuplicate) {
        alert("A course with the same title, platform, and category already exists!");
        return;
      }
    }

    
    if (course?.id) {
      updateCourse(course.id, trimmedData);
    } else {
      addCourse(trimmedData);
    }

    if (onSave) {
      onSave();
    }

    reset();
    onClose();
  };

  return (
    <Container>
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
          <InputLabel>Status</InputLabel>
          <Select
            defaultValue={course?.status || "Not Started"}
            {...register("status", { required: "Status is required" })}
          >
            <MenuItem value="Not Started">Not Started</MenuItem>
            <MenuItem value="In Progress">In Progress</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
          </Select>
        </FormControl>

        <Box display="flex" alignItems="center" mt={2}>
          <Typography variant="subtitle1" sx={{ mr: 2 }}>Rating:</Typography>
          <Rating
            value={watch("rating")}
            onChange={(_, newValue) => {
              if (statusValue === "Not Started") {
                setValue("rating", 0);
              } else {
                setValue("rating", newValue || 1);
              }
            }}
            size="large"
            readOnly={statusValue === "Not Started"}
          />
        </Box>

        {statusValue === "Not Started" && (
          <Alert severity="info" sx={{ mt: 2 }}>
            Rating will be saved as 0 for "Not Started" status
          </Alert>
        )}

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