export type EventStatus = 'upcoming' | 'past';

const PARIS_TZ = 'Europe/Paris';

/** Convertit une date/heure murale dans un fuseau donné en instant UTC réel. */
function zonedTimeToUtc(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  second: number,
  timeZone: string,
): Date {
  const asUtcGuess = Date.UTC(year, month - 1, day, hour, minute, second);
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  const parts = Object.fromEntries(
    dtf.formatToParts(new Date(asUtcGuess)).map((p) => [p.type, p.value]),
  );
  const hourValue = parts['hour'] === '24' ? 0 : Number(parts['hour']);
  const asIfUtc = Date.UTC(
    Number(parts['year']),
    Number(parts['month']) - 1,
    Number(parts['day']),
    hourValue,
    Number(parts['minute']),
    Number(parts['second']),
  );
  const offset = asIfUtc - asUtcGuess;
  return new Date(asUtcGuess - offset);
}

export function parisDateParts(date: Date): { year: number; month: number; day: number } {
  const dtf = new Intl.DateTimeFormat('en-CA', {
    timeZone: PARIS_TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const [year, month, day] = dtf.format(date).split('-').map(Number);
  return { year, month, day };
}

/**
 * Statut d'un événement (EDB 4 et 6) : un événement bascule de « à venir » à
 * « passé » le lendemain de sa date, à minuit heure de Paris (pas à l'heure
 * exacte de l'événement).
 */
export function getEventStatus(eventDate: Date, now: Date = new Date()): EventStatus {
  const { year, month, day } = parisDateParts(eventDate);
  const cutoff = zonedTimeToUtc(year, month, day + 1, 0, 0, 0, PARIS_TZ);
  return now.getTime() >= cutoff.getTime() ? 'past' : 'upcoming';
}
