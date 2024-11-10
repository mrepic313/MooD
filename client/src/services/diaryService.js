// src/services/diaryService.js
import axios from 'axios';
import { getToken } from './authService';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const authHeader = () => ({
  headers: { Authorization: `Bearer ${getToken()}` },
});

// Create a new diary entry
export const createDiaryEntry = async (entry) => {
  const response = await axios.post(`${API_URL}/diaries`, entry, authHeader());
  return response.data;
};

// Get all diary entries for the logged-in user
export const getDiaryEntries = async () => {
  const response = await axios.get(`${API_URL}/diaries`, authHeader());
  return response.data;
};

// Get a single diary entry by ID
export const getDiaryEntryById = async (id) => {
  const response = await axios.get(`${API_URL}/diaries/${id}`, authHeader());
  return response.data;
};

// Update a diary entry
export const updateDiaryEntry = async (id, updatedEntry) => {
  const response = await axios.put(`${API_URL}/diaries/${id}`, updatedEntry, authHeader());
  return response.data;
};

// Delete a diary entry
export const deleteDiaryEntry = async (id) => {
  const response = await axios.delete(`${API_URL}/diaries/${id}`, authHeader());
  return response.data;
};

// Get the average mood intensity for the user's diary entries
export const getAverageMood = async () => {
  const response = await axios.get(`${API_URL}/diaries/average/mood`, authHeader());
  return response.data;
};

// Analyze emotions in a specific diary entry
export const analyzeDiaryEntry = async (diaryId) => {
  const response = await axios.post(`${API_URL}/diaries/analyze`, { diaryId }, authHeader());
  return response.data;
};
