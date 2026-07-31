/**
 * Parses multiple date formats and returns a Date object.
 * Handles "15/07/26", "15-Jul-2026", "2026-07-15", "15 July 2026"
 */
export function normalizeDate(dateStr: string): Date {
  const cleanStr = dateStr.trim();

  // Try standard JS Date parsing first for "2026-07-15" or "15 July 2026"
  let parsedDate = new Date(cleanStr);
  if (!isNaN(parsedDate.getTime()) && !/^\d{2}\/\d{2}\/\d{2}$/.test(cleanStr)) {
    return parsedDate;
  }

  // Handle DD/MM/YY or DD/MM/YYYY or DD-MM-YYYY
  const ddmmyyMatch = cleanStr.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})$/);
  if (ddmmyyMatch) {
    const day = parseInt(ddmmyyMatch[1], 10);
    const month = parseInt(ddmmyyMatch[2], 10) - 1; // 0-indexed
    let year = parseInt(ddmmyyMatch[3], 10);

    // Handle 2-digit years
    if (year < 100) {
      year += 2000;
    }

    parsedDate = new Date(year, month, day);
    if (!isNaN(parsedDate.getTime())) {
      return parsedDate;
    }
  }

  // Handle DD-Mon-YYYY (e.g., 15-Jul-2026)
  const ddMonyyyyMatch = cleanStr.match(/^(\d{1,2})[\/\-\s]+([A-Za-z]{3})[\/\-\s]+(\d{2,4})$/);
  if (ddMonyyyyMatch) {
    const day = parseInt(ddMonyyyyMatch[1], 10);
    const monthStr = ddMonyyyyMatch[2].toLowerCase();
    let year = parseInt(ddMonyyyyMatch[3], 10);

    const monthMap: Record<string, number> = {
      jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
      jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11
    };

    const month = monthMap[monthStr];
    
    if (year < 100) {
      year += 2000;
    }

    if (month !== undefined) {
      parsedDate = new Date(year, month, day);
      if (!isNaN(parsedDate.getTime())) {
        return parsedDate;
      }
    }
  }

  // Fallback: return current date or Invalid Date
  return new Date(cleanStr);
}
