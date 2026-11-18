import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const fetchApplications = async () => {
  const { data } = await axios.get(`${API_URL}/applications`);
  return data;
};

export const fetchApplicationById = async (id) => {
  const { data } = await axios.get(`${API_URL}/applications/${id}`);
  return data;
};

export const createApplication = async (appData) => {
  const payload = {
    ...appData,
    notes: [],
    interviews: [],
    history: [{ status: appData.status, at: appData.appliedDate || new Date().toLocaleDateString() }]
  };
  const { data } = await axios.post(`${API_URL}/applications`, payload);
  return data;
};

export const updateApplication = async (id, appData) => {
  const { data } = await axios.patch(`${API_URL}/applications/${id}`, appData);
  return data;
};

export const deleteApplication = async (id) => {
  await axios.delete(`${API_URL}/applications/${id}`);
  return id;
};

export const fetchStats = async () => {
  const { data } = await axios.get(`${API_URL}/stats`);
  return data;
};