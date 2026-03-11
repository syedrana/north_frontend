import api from "./api";

export async function getHomepage() {
  try {
    const response = await api.get("/api/homepage");
    const sections = response?.data?.sections;

    if (!Array.isArray(sections)) {
      throw new Error("Invalid homepage response: sections must be an array");
    }

    return sections;
  } catch (error) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to fetch homepage data";

    throw new Error(message);
  }
}
