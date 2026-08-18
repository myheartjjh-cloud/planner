const GAS_URL = 'https://script.google.com/macros/s/AKfycbzYG2JGwpq9c6aRYp6s41LrQ96T8zaGQ8KZGZC_w8rME_VI_-aBHCyu9rDAaKgNaAA/exec';

export const fetchScheduleData = async () => {
  try {
    const res = await fetch(GAS_URL);
    const data = await res.json();
    return data.map(row => {
      let parsedDate = row.date || "";
      if (parsedDate.includes("T")) {
        // GAS converts Dates to ISO strings in UTC. 
        // e.g. "2026-08-17T15:00:00.000Z" -> Local "2026-08-18"
        const d = new Date(parsedDate);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        parsedDate = `${yyyy}-${mm}-${dd}`;
      }
      return {
        ...row,
        id: parseFloat(row.id),
        academyId: parseFloat(row.academyId),
        date: parsedDate,
        day: row.day !== "" ? parseInt(row.day) : undefined,
        start: parseFloat(row.start),
        end: parseFloat(row.end)
      };
    });
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
