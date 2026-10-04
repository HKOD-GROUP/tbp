export interface IcsEvent {
  title: string;
  description?: string;
  location: string;
  start: Date;
  /** Durée par défaut de 3 heures si non précisée. */
  durationMs?: number;
}

function formatIcsDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
}

function escapeIcsText(text: string): string {
  return text.replace(/[\\,;]/g, (match) => `\\${match}`).replace(/\n/g, '\\n');
}

/** Génère le contenu d'un fichier .ics pour « Ajouter à mon agenda » (EDB 4). */
export function generateIcsContent(event: IcsEvent): string {
  const start = event.start;
  const end = new Date(start.getTime() + (event.durationMs ?? 3 * 60 * 60 * 1000));
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Team Baraia Promotion//FR',
    'BEGIN:VEVENT',
    `UID:${start.getTime()}@tbp.fr`,
    `DTSTAMP:${formatIcsDate(new Date())}`,
    `DTSTART:${formatIcsDate(start)}`,
    `DTEND:${formatIcsDate(end)}`,
    `SUMMARY:${escapeIcsText(event.title)}`,
    `LOCATION:${escapeIcsText(event.location)}`,
  ];
  if (event.description) {
    lines.push(`DESCRIPTION:${escapeIcsText(event.description)}`);
  }
  lines.push('END:VEVENT', 'END:VCALENDAR');
  return lines.join('\r\n');
}

/** Déclenche le téléchargement du fichier .ics dans le navigateur. */
export function downloadIcsFile(event: IcsEvent, filename: string): void {
  const content = generateIcsContent(event);
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
