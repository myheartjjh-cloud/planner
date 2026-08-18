const GAS_URL = 'https://script.google.com/macros/s/AKfycbzYG2JGwpq9c6aRYp6s41LrQ96T8zaGQ8KZGZC_w8rME_VI_-aBHCyu9rDAaKgNaAA/exec';

export const fetchScheduleData = async () => {
  try {
    const res = await fetch(GAS_URL);
    const data = await res.json();
    return data.map(row => ({
      ...row,
      id: parseFloat(row.id),
      academyId: parseFloat(row.academyId),
      day: row.day !== "" ? parseInt(row.day) : undefined,
      start: parseFloat(row.start),
      end: parseFloat(row.end)
    }));
  } catch (err) {
    console.error('Failed to fetch from GAS:', err);
    return [];
  }
};

export const syncScheduleData = async (action, data) => {
  // action: 'add', 'edit', 'delete'
  try {
    await fetch(GAS_URL, {
      method: 'POST',
      body: JSON.stringify({ action, ...data })
    });
  } catch (err) {
    console.error('Failed to sync to GAS:', err);
  }
};
