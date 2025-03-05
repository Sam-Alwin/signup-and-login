import { create } from "zustand";
import api from "../api/axiosInstance";

export interface Course {
  id: number;
  title: string;
  platform: string;
  category: string;
  status: string;
  rating?: number;
}

export interface FetchCoursesParams {
  search?: string;
  sort?: "title" | "platform" | "category" | "rating" | "createdAt" | "updatedAt";
  order?: "ASC" | "DESC";
  limit?: number;
  page?: number;
  status?: string;
  rating?: number;
}

interface CourseStore {
  courses: Course[];
  fetchCourses: (params?: FetchCoursesParams) => Promise<void>;
  addCourse: (course: Omit<Course, "id">, params?: FetchCoursesParams) => Promise<void>;
  updateCourse: (id: number, course: Partial<Course>, params?: FetchCoursesParams) => Promise<void>;
  deleteCourse: (id: number, params?: FetchCoursesParams) => Promise<void>;
}

const useCourseStore = create<CourseStore>((set) => ({
  courses: [],

  fetchCourses: async (params: FetchCoursesParams = {}) => {
    try {
      
      const { data } = await api.get("/courses", { params });
      set({ courses: data.courses });
    } catch (error) {
      console.error("Failed to fetch courses:", error);
      // Optionally set an empty array or error state
      set({ courses: [] });
    }
  },

  addCourse: async (course, params) => {
    try {
      await api.post("/courses", course);
      const { data } = await api.get("/courses", { params });
      set({ courses: data.courses });
    } catch (error) {
      console.error("Failed to add course:", error);
      throw error;
    }
  },

  updateCourse: async (id, course, params) => {
    try {
      await api.put(`/courses/${id}`, course);
      const { data } = await api.get("/courses", { params });
      set({ courses: data.courses });
    } catch (error) {
      console.error("Failed to update course:", error);
      throw error;
    }
  },

  deleteCourse: async (id, params) => {
    try {
      await api.delete(`/courses/${id}`);
      const { data } = await api.get("/courses", { params });
      set({ courses: data.courses });
    } catch (error) {
      console.error("Failed to delete course:", error);
      throw error;
    }
  },
}));

export default useCourseStore;