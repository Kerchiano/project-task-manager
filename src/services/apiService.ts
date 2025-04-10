import axios from "axios";

export const fetchProjects = async () => {
  try {
    const response = await axios.get("http://localhost:5000/projects");
    return response.data;
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
};
