import axios from 'axios';
import dayjs from 'dayjs';

const apiClient = axios.create({
  baseURL: 'https://octalogic-test-frontend.vercel.app/api/v1',
});

export const fetchVehicleTypes = async () => {
  const response = await apiClient.get('/vehicleTypes');
  return response.data.data;
};

export const fetchModels = async (vehicleId) => {
  const response = await apiClient.get(`/vehicles/${vehicleId}` );
  return response.data.data;
};

export const fetchBookedDates = async (vehicleId) => {
  const response = await apiClient.get(`/bookings/${vehicleId}`);
  return response.data.data.map(booking => ({
    start: dayjs(booking.startDate),
    end: dayjs(booking.endDate)
  }));
};