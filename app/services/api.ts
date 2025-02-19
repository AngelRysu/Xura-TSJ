const getBaseURL = () => process.env.NEXT_PUBLIC_HOST || process.env.HOST || '';

export const fetchData = async (url: string) => {
  try {
    const response = await fetch(`${getBaseURL()}${url}`, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`Error fetching ${url}: ${response.statusText}`);
    }
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Fetch error:', error);// eslint-disable-line no-console
    return [];
  }
};

export const fetchString = async (url: string) => {
  try {
    const response = await fetch(`${getBaseURL()}${url}`, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`Error fetching ${url}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Fetch error:', error);// eslint-disable-line no-console
    return '';
  }
};
