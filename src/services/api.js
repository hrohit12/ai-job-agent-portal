// API URL for Google Apps Script Web App
const API_URL = import.meta.env.VITE_API_URL || 'https://script.google.com/macros/s/AKfycbyumpPcCymvexXvouppJ8AJXXUGsdbrtd0BtUaJYkQgXOMEHZ-F-M93dv96vY7fdwaCSg/exec';

export const getJobs = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Failed to fetch jobs');

    const text = await response.text();
    return JSON.parse(text);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    throw error;
  }
};

export const getJobById = async (id) => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Failed to fetch jobs');

    const text = await response.text();
    const data = JSON.parse(text);
    const jobs = data.data || data;
    return (jobs && Array.isArray(jobs)) ? jobs.find(j => j.id.toString() === id.toString()) : null;
  } catch (error) {
    console.error('Error fetching single job:', error);
    throw error;
  }
};

export const postJob = async (jobData) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: JSON.stringify({ action: 'postJob', ...jobData }),
    });

    if (!response.ok) {
      const text = await response.text().catch(() => '{}');
      const errorData = JSON.parse(text);
      return { success: false, message: errorData.message || 'Server error' };
    }

    const text = await response.text();
    return JSON.parse(text);
  } catch (error) {
    console.error('Error posting job:', error);
    throw error;
  }
};

export const applyToJob = async (jobId) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: JSON.stringify({ action: 'applyToJob', jobId }),
    });

    if (!response.ok) throw new Error('Failed to update applicants');
    const text = await response.text();
    return JSON.parse(text);
  } catch (error) {
    console.error('Error applying to job:', error);
    throw error;
  }
};
