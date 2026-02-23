import api from "./apiServer";

export const getSearchOverview = (params) =>
  api.get("/searchanalytics/overview", { params });

export const getKeywordAnalytics = () =>
  api.get("/searchanalytics/keywords");

export const getSessions = () =>
  api.get("/searchanalytics/sessions");