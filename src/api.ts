const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface Ornament {
  id: number;
  text: string;
  x: number;
  y: number;
  color: string;
}

export async function fetchOrnaments(): Promise<{ ornaments: Ornament[] }> {
  try {
    const response = await fetch(`${API_BASE_URL}/ornaments`);
    if (!response.ok) {
      throw new Error('Failed to fetch ornaments');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching ornaments:', error);
    return { ornaments: [] };
  }
}

export async function updateOrnamentText(id: number, text: string): Promise<Ornament> {
  try {
    const response = await fetch(`${API_BASE_URL}/ornaments/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update ornament');
    }
    
    const data = await response.json();
    return data.ornament;
  } catch (error) {
    console.error('Error updating ornament:', error);
    throw error;
  }
}

export async function initializeOrnaments(ornaments: Ornament[]): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/ornaments/initialize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ornaments }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to initialize ornaments:', response.status, errorText);
      throw new Error(`Failed to initialize ornaments: ${response.status} ${errorText}`);
    }
    
    const result = await response.json();
    console.log('Ornaments initialized successfully:', result);
  } catch (error) {
    console.error('Error initializing ornaments:', error);
    // Don't throw - initialization failure shouldn't break the app
    // The app will still work, just won't persist the layout
  }
}

