import { create } from "zustand";
import api from "../api/axiosInstance";

// ✅ Ensure Course type is exported
export interface Course {
  id: number;
  title: string;
  platform: string;
  category: string;
  status: string;
  rating?: number;
}

interface CourseStore {
  courses: Course[];
  fetchCourses: () => Promise<void>;
  addCourse: (course: Omit<Course, "id">) => Promise<void>;
  updateCourse: (id: number, course: Partial<Course>) => Promise<void>;
  deleteCourse: (id: number) => Promise<void>;
}

const useCourseStore = create<CourseStore>((set) => ({
  courses: [],

  fetchCourses: async () => {
    try {
      const { data } = await api.get("/courses");
      set({ courses: data.courses });
    } catch (error) {
      console.error("Failed to fetch courses", error);
    }
  },

  addCourse: async (course) => {
    try {
      const response = await api.post("/courses", course);
      set((state) => ({ courses: [...state.courses, response.data] }));
    } catch (error) {
      console.error("Failed to add course", error);
    }
  },

  updateCourse: async (id, course) => {
    try {
      await api.put(`/courses/${id}`, course);
      set((state) => ({
        courses: state.courses.map((c) => (c.id === id ? { ...c, ...course } : c)),
      }));
    } catch (error) {
      console.error("Failed to update course", error);
    }
  },

  deleteCourse: async (id) => {
    try {
      await api.delete(`/courses/${id}`);
      set((state) => ({ courses: state.courses.filter((c) => c.id !== id) }));
    } catch (error) {
      console.error("Failed to delete course", error);
    }
  },
}));

export default useCourseStore;
