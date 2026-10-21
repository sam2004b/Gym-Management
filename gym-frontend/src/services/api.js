// src/services/app.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5221/api",
});

API.interceptors.request.use((cfg) => {
  const token = localStorage.getItem("token");
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

// user
export const registerUser = (payload) => API.post(`/User/register`, payload);
export const loginUser = (payload) => API.post(`/User/login`, payload);
export const logoutUser = () => API.post(`/User/logout`);
export const getProfile = () => API.get(`/User/profile`);
export const updateProfile = (payload) => API.put(`/User/profile`, payload);
export const getAllUsers = () => API.get(`/User/all`);
export const deleteUser = (id) => API.delete(`/User/${id}`);
export const approveUser = (id) => API.put(`/User/approve/${id}`);
export const getTrainers = () => API.get(`/User/trainers`);

// membership
export const getAllMembershipPlans = () => API.get(`/MembershipPlan/all`);
export const getMembershipPlanById = (id) => API.get(`/MembershipPlan/${id}`);
export const createMembershipPlan = (payload) => API.post(`/MembershipPlan/create`, payload);
export const updateMembershipPlan = (id, payload) => API.put(`/MembershipPlan/update/${id}`, payload);
export const deleteMembershipPlan = (id) => API.delete(`/MembershipPlan/delete/${id}`);

// user membership
export const purchaseMembership = (payload) => API.post(`/UserMembership/purchase`, payload);
export const renewMembership = (payload) => API.post(`/UserMembership/renew`, payload);
export const getCurrentMembership = () => API.get(`/UserMembership/current`);
export const getMembershipHistory = () => API.get(`/UserMembership/history`);
export const markAttendance = () => API.post(`/UserMembership/attendance/mark`);
export const getAttendanceSummary = () => API.get(`/UserMembership/attendance/summary`);
export const getAttendanceRecent = (count = 5) => API.get(`/UserMembership/attendance/recent?count=${count}`);
export const getClassesCount = () => API.get(`/UserMembership/classes/count`);
export const getWorkoutActiveCount = async () => axios.get(`${API_BASE}/UserMembership/current`, authHeader());
export const getAllUserMemberships = () => API.get(`/UserMembership/all`);
export const getUserMembershipByUserId = (userId) => API.get(`/UserMembership/${userId}`);

// workout
export const getWorkoutPlans = (page = 1, pageSize = 20) => API.get(`/WorkoutPlan/all?page=${page}&pageSize=${pageSize}`);
export const getWorkoutPlanById = (id) => API.get(`/WorkoutPlan/${id}`);
export const createWorkoutPlan = (payload) => API.post(`/WorkoutPlan`, payload);
export const updateWorkoutPlan = (id, payload) => API.put(`/WorkoutPlan/${id}`, payload);
export const deleteWorkoutPlan = (id) => API.delete(`/WorkoutPlan/${id}`);
export const getExercises = (planId) => API.get(`/WorkoutPlan/${planId}/exercises`);
export const addExercise = (planId, payload) => API.post(`/WorkoutPlan/${planId}/exercises`, payload);
export const updateExercise = (planId, exerciseId, payload) => API.put(`/WorkoutPlan/${planId}/exercises/${exerciseId}`, payload);
export const deleteExercise = (planId, exerciseId) => API.delete(`/WorkoutPlan/${planId}/exercises/${exerciseId}`);

// feedback
export const submitFeedback = (payload) => API.post(`/Feedback`, payload);
export const getMyFeedback = () => API.get(`/Feedback/my`);
export const getTrainerFeedback = (trainerId) => API.get(`/Feedback/trainer/${trainerId}`);
export const getClassFeedback = (classId) => API.get(`/Feedback/class/${classId}`);
export const deleteFeedback = (id) => API.delete(`/Feedback/${id}`);

// dashboard
export const getAllMemberships = () => API.get(`/UserMembership/all`);
export const getAllPayments = () => API.get(`/Payments/all`); // optional if endpoint exists
export const getDashboardStats = async () => {
  const [users, memberships] = await Promise.all([
    getAllUsers(),
    getAllUserMemberships(),
  ]);

  const totalMembers = users.data?.length || 0;
  const activeMemberships =
    memberships.data?.filter((m) => m.status === "Active").length || 0;
  const totalRevenue =
    memberships.data?.reduce((sum, m) => sum + (m.price || 0), 0) || 0;

  return {
    totalMembers,
    activeMemberships,
    totalRevenue,
  };
};

export default API;
