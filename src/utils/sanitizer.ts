export const sanitizePayload = (data: any): any => {
  if (typeof data === 'string') {
    return data.trim();
  }
  
  if (Array.isArray(data)) {
    return data.map(item => sanitizePayload(item));
  }
  
  if (data !== null && typeof data === 'object') {
    return Object.keys(data).reduce((acc, key) => {
      acc[key] = sanitizePayload(data[key]);
      return acc;
    }, {} as Record<string, any>);
  }
  
  return data;
};