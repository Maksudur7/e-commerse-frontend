const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000/api';


export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const contentType = response.headers.get("content-type");
  let data;
  
  if (contentType && contentType.includes("application/json")) {
    try {
      data = await response.json();
    } catch (e) {
      console.error("Failed to parse JSON response:", e);
      data = { message: "Invalid JSON response from server" };
    }
  } else {
    const text = await response.text();
    console.warn("Received non-JSON response:", text);
    if (!response.ok) {
      throw new Error(text || `Error ${response.status}: ${response.statusText}`);
    }
    return { data: text, success: true }; // Fallback for success text
  }

  if (!response.ok) {
    const errorMsg = data?.message || data?.error || `Error ${response.status}: ${response.statusText}`;
    console.error("API Error Response:", { status: response.status, data });
    throw new Error(errorMsg);
  }

  return data;
};
