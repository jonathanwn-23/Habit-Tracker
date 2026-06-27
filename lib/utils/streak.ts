export function calculateStreak(logDates: string[]): number {
  if (!logDates || logDates.length === 0) return 0;

  // Hapus duplikat dan urutkan descending (terbaru ke terlama)
  const uniqueDates = Array.from(new Set(logDates));
  const sortedDates = uniqueDates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  
  // Tanggal hari ini dan kemarin dalam format YYYY-MM-DD
  const today = new Date();
  // Sesuaikan dengan timezone lokal agar lebih akurat (kita asumsikan server/client match untuk MVP)
  const todayStr = new Date(today.getTime() - (today.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = new Date(yesterday.getTime() - (yesterday.getTimezoneOffset() * 60000)).toISOString().split('T')[0];

  // Jika log terbaru lebih lama dari kemarin, streak hangus (0)
  if (sortedDates[0] !== todayStr && sortedDates[0] !== yesterdayStr) {
    return 0;
  }

  let streak = 0;
  // Kita mulai melacak dari tanggal log terbaru
  let currentDate = new Date(sortedDates[0]); 

  for (let i = 0; i < sortedDates.length; i++) {
    const logDateStr = sortedDates[i];
    
    // Tanggal yang diharapkan (mundur 1 hari setiap loop)
    const expectedDateStr = new Date(currentDate.getTime() - (currentDate.getTimezoneOffset() * 60000)).toISOString().split('T')[0];

    if (logDateStr === expectedDateStr) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1); // Mundur 1 hari
    } else {
      // Ada hari yang bolong
      break;
    }
  }

  return streak;
}
