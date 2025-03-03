import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { TextField, Button, MenuItem, Container, Box } from "@mui/material";
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
        
        <TextField
          select
          fullWidth
          label="Status"
          {...register("status", { required: "Status is required" })}
          margin="normal"
        >
          <MenuItem value="Not Started">Not Started</MenuItem>
          <MenuItem value="In Progress">In Progress</MenuItem>
          <MenuItem value="Completed">Completed</MenuItem>
        </TextField>

        
        <TextField
          fullWidth
          label="Rating (1 to 5)"
          type="number"
          {...register("rating", {
            required: "Rating is required",
            min: { value: 1, message: "Rating must be between 1 and 5" },
            max: { value: 5, message: "Rating must be between 1 and 5" },
            valueAsNumber: true,
          })}
          margin="normal"
          error={!!errors.rating}
          helperText={errors.rating?.message}
          defaultValue={course?.rating ?? 1} 
          onChange={(e) => {
            const value = Number(e.target.value);
            if (value < 1 || value > 5) {
              setValue("rating", 1); 
            }
          }}
        />

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
