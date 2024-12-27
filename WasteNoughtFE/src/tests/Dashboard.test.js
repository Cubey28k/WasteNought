import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Dashboard from './pages/Dashboard';
import axios from 'axios';

// Mock the axios module
jest.mock('axios');

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value;
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('Dashboard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('renders loading state', () => {
    render(<Dashboard />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test('renders error message when login fails', async () => {
    axios.post.mockRejectedValue(new Error('Login failed'));

    render(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByText(/login failed/i)).toBeInTheDocument();
    });
  });

  test('renders walk-in information and chart when data is fetched', async () => {
    const mockResponse = {
      data: [
        { timestamp: '2024-10-06T00:00:00Z', value: 35 },
        { timestamp: '2024-10-06T01:00:00Z', value: 36 },
      ],
    };

    axios.post.mockResolvedValue({ data: { access_token: 'mocked-token' } });
    axios.get.mockResolvedValue(mockResponse);

    render(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByText(/contact information/i)).toBeInTheDocument();
      expect(screen.getByText(/walk-in servicer:/i)).toBeInTheDocument();
      expect(screen.getByText(/founder ben/i)).toBeInTheDocument();
    });
  });

  test('displays error message when fetching temperature readings fails', async () => {
    axios.post.mockResolvedValue({ data: { access_token: 'mocked-token' } });
    axios.get.mockRejectedValue(new Error('Failed to fetch temperature readings.'));

    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText(/failed to fetch temperature readings/i)).toBeInTheDocument();
    });
  });

  test('uses existing token from localStorage if available', async () => {
    localStorage.setItem('token', 'existing-token');

    const mockResponse = {
      data: [
        { timestamp: '2024-10-06T00:00:00Z', value: 35 },
        { timestamp: '2024-10-06T01:00:00Z', value: 36 },
      ],
    };

    axios.get.mockResolvedValue(mockResponse);

    render(<Dashboard />);

    await waitFor(() => {
      expect(axios.post).not.toHaveBeenCalled(); // No login call because token exists
      expect(axios.get).toHaveBeenCalledWith(
        'https://wastenought-be-production.up.railway.app/metric',
        expect.objectContaining({
          headers: { Authorization: 'Bearer existing-token' },
        })
      );
    });
  });

  test('logs in and stores token in localStorage if no token exists', async () => {
    const mockResponse = {
      data: [
        { timestamp: '2024-10-06T00:00:00Z', value: 35 },
        { timestamp: '2024-10-06T01:00:00Z', value: 36 },
      ],
    };

    axios.post.mockResolvedValue({ data: { access_token: 'new-token' } });
    axios.get.mockResolvedValue(mockResponse);

    render(<Dashboard />);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledTimes(1); // Login call made
      expect(localStorage.getItem('token')).toBe('new-token'); // Token stored
    });
  });

  test('displays loading message while fetching data', async () => {
    render(<Dashboard />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    axios.post.mockResolvedValue({ data: { access_token: 'mocked-token' } });
    axios.get.mockResolvedValue({
      data: [
        { timestamp: '2024-10-06T00:00:00Z', value: 35 },
      ],
    });

    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });
  });

  test('handles expired token by logging in again', async () => {
    localStorage.setItem('token', 'expired-token');

    const mockResponse = {
      data: [
        { timestamp: '2024-10-06T00:00:00Z', value: 35 },
        { timestamp: '2024-10-06T01:00:00Z', value: 36 },
      ],
    };

    axios.get.mockRejectedValueOnce({ response: { status: 401 } }); // Simulate expired token
    axios.post.mockResolvedValue({ data: { access_token: 'new-token' } });
    axios.get.mockResolvedValue(mockResponse);

    render(<Dashboard />);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledTimes(1); // Login call made after 401
      expect(localStorage.getItem('token')).toBe('new-token');
      expect(screen.getByText(/contact information/i)).toBeInTheDocument();
    });
  });
});
