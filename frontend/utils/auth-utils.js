import axios from 'axios';
import { apiUrl } from '~/config/config';

const API_BASE_URL = `${apiUrl}/api`;

export async function getUserRole() {
    try {
        const response = await axios.get(`${API_BASE_URL}/users/profile`, { withCredentials: true });
        const profile = response.data;
        return profile.role;
    } catch (error) {
        console.error("Initial profile fetch error:", error);

        try {
            await axios.post(`${API_BASE_URL}/refresh`, {}, { withCredentials: true });

            const retryResponse = await axios.get(`${API_BASE_URL}/users/profile`, { withCredentials: true });
            const profile = retryResponse.data;
            return profile.role;
        } catch (refreshError) {
            console.error("Authentication failed:", refreshError);
            return null;
        }
    }
}