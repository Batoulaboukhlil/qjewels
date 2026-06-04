import axios from 'axios';
import { apiUrl } from '~/config/config';

export async function login(email, password) {
    try {
        await axios.post(`${apiUrl}/api/login`, {
            email,
            password,
        }, {
            withCredentials: true,
        });
        location.reload() // reload to update everything role wise
        navigateTo("/")
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
}

export async function registerUser(userData) {
    try {
        const response = await axios.post(`${apiUrl}/api/register`, userData);
        console.log('Registration successful:', response.data);

    } catch (error) {
        console.error('Registration failed:', error);
    }
}