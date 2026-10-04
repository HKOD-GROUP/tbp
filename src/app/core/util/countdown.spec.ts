import { diffParts } from './countdown';

describe('diffParts', () => {
  it('décompose une différence en jours, heures, minutes, secondes', () => {
    const now = new Date('2026-01-01T00:00:00Z');
    const target = new Date('2026-01-03T02:03:04Z');
    expect(diffParts(target, now)).toEqual({ days: 2, hours: 2, minutes: 3, seconds: 4 });
  });

  it('ne retourne jamais de valeurs négatives quand la cible est dans le passé', () => {
    const now = new Date('2026-01-03T00:00:00Z');
    const target = new Date('2026-01-01T00:00:00Z');
    expect(diffParts(target, now)).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  });

  it('retourne zéro partout quand la cible est atteinte', () => {
    const now = new Date('2026-01-01T12:00:00Z');
    expect(diffParts(now, now)).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  });
});
