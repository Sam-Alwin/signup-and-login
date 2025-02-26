import { useEffect, useState } from "react";
import api from "../api/axiosInstance";

const useCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const response = await api.get("/courses");
        setCourses(response.data.courses);
      } catch (error) {
        console.error("Failed to fetch courses", error);
      }
      setLoading(false);
    };

    fetchCourses();
  }, []);

  return { courses, loading };
};

export default useCourses;
