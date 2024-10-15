import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Dashboard from './pages/Dashboard';
import axios from 'axios';

// Mock the axios module
jest.mock('axios');

describe('Dashboard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
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
});
