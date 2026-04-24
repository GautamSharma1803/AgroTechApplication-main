import { projectId, publicAnonKey } from '/utils/supabase/info';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-2598bc7a`;

// Storage for auth token
let authToken: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
  if (token) {
    localStorage.setItem('auth_token', token);
  } else {
    localStorage.removeItem('auth_token');
  }
}

export function getAuthToken(): string | null {
  if (!authToken) {
    authToken = localStorage.getItem('auth_token');
  }
  return authToken;
}

async function apiCall(endpoint: string, options: RequestInit = {}) {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token || publicAnonKey}`,
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

// ============= AUTH API =============

export const auth = {
  signUp: async (email: string, password: string, fullName: string, phone: string) => {
    const data = await apiCall('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, fullName, phone }),
    });
    return data;
  },

  signIn: async (email: string, password: string) => {
    const data = await apiCall('/auth/signin', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (data.session?.access_token) {
      setAuthToken(data.session.access_token);
    }
    return data;
  },

  signOut: () => {
    setAuthToken(null);
  },

  getSession: async () => {
    try {
      const data = await apiCall('/auth/session');
      return data;
    } catch (error) {
      setAuthToken(null);
      throw error;
    }
  },
};

// ============= CROPS API =============

export const crops = {
  getAll: async () => {
    const data = await apiCall('/crops');
    return data.crops;
  },

  create: async (cropData: any) => {
    const data = await apiCall('/crops', {
      method: 'POST',
      body: JSON.stringify(cropData),
    });
    return data.crop;
  },

  update: async (id: string, updates: any) => {
    const data = await apiCall(`/crops/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return data.crop;
  },

  delete: async (id: string) => {
    await apiCall(`/crops/${id}`, {
      method: 'DELETE',
    });
  },
};

// ============= DIAGNOSIS API =============

export const diagnosis = {
  analyze: async (image: string, cropType?: string) => {
    const data = await apiCall('/diagnose', {
      method: 'POST',
      body: JSON.stringify({ image, cropType }),
    });
    return data.diagnosis;
  },

  getAll: async () => {
    const data = await apiCall('/diagnoses');
    return data.diagnoses;
  },
};

// ============= SOIL TESTS API =============

export const soilTests = {
  create: async (testData: any) => {
    const data = await apiCall('/soil-tests', {
      method: 'POST',
      body: JSON.stringify(testData),
    });
    return data.soilTest;
  },

  getAll: async () => {
    const data = await apiCall('/soil-tests');
    return data.tests;
  },
};

// ============= MARKETPLACE API =============

export const market = {
  getProducts: async (search?: string) => {
    const query = search ? `?search=${encodeURIComponent(search)}` : '';
    const data = await apiCall(`/market/products${query}`);
    return data.products;
  },

  createListing: async (productData: any) => {
    const data = await apiCall('/market/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
    return data.product;
  },

  getMyListings: async () => {
    const data = await apiCall('/market/my-listings');
    return data.products;
  },
};

// ============= WEATHER API =============

export const weather = {
  get: async (lat?: string, lon?: string) => {
    const query = lat && lon ? `?lat=${lat}&lon=${lon}` : '';
    const data = await apiCall(`/weather${query}`);
    return data.weather;
  },
};

// ============= UPLOAD API =============

export const upload = {
  image: async (imageDataUrl: string, type: string) => {
    const data = await apiCall('/upload', {
      method: 'POST',
      body: JSON.stringify({ image: imageDataUrl, type }),
    });
    return data.url;
  },
};
