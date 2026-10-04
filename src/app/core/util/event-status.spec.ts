import { getEventStatus } from './event-status';

describe('getEventStatus', () => {
  it('est "upcoming" avant la date de l\'événement', () => {
    const eventDate = new Date('2026-11-14T19:00:00+01:00');
    const now = new Date('2026-11-14T10:00:00+01:00');
    expect(getEventStatus(eventDate, now)).toBe('upcoming');
  });

  it('reste "upcoming" plus tard le jour même (après l\'heure de l\'événement)', () => {
    const eventDate = new Date('2026-11-14T19:00:00+01:00');
    const now = new Date('2026-11-14T23:30:00+01:00');
    expect(getEventStatus(eventDate, now)).toBe('upcoming');
  });

  it('reste "upcoming" juste avant minuit heure de Paris', () => {
    const eventDate = new Date('2026-11-14T19:00:00+01:00');
    const now = new Date('2026-11-14T23:59:59+01:00');
    expect(getEventStatus(eventDate, now)).toBe('upcoming');
  });

  it('devient "past" à minuit pile le lendemain, heure de Paris', () => {
    const eventDate = new Date('2026-11-14T19:00:00+01:00');
    const now = new Date('2026-11-15T00:00:00+01:00');
    expect(getEventStatus(eventDate, now)).toBe('past');
  });

  it('est "past" plusieurs jours après', () => {
    const eventDate = new Date('2026-11-14T19:00:00+01:00');
    const now = new Date('2026-11-20T12:00:00+01:00');
    expect(getEventStatus(eventDate, now)).toBe('past');
  });

  it("gère correctement un changement de mois (heure d'hiver, UTC+1)", () => {
    const eventDate = new Date('2026-01-31T19:00:00+01:00');
    const beforeMidnight = new Date('2026-01-31T23:59:00+01:00');
    const afterMidnight = new Date('2026-02-01T00:00:01+01:00');
    expect(getEventStatus(eventDate, beforeMidnight)).toBe('upcoming');
    expect(getEventStatus(eventDate, afterMidnight)).toBe('past');
  });

  it("gère correctement l'heure d'été (UTC+2)", () => {
    const eventDate = new Date('2026-07-14T19:00:00+02:00');
    const beforeMidnight = new Date('2026-07-14T23:59:00+02:00');
    const afterMidnight = new Date('2026-07-15T00:00:01+02:00');
    expect(getEventStatus(eventDate, beforeMidnight)).toBe('upcoming');
    expect(getEventStatus(eventDate, afterMidnight)).toBe('past');
  });
});
