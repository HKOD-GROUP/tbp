import { generateIcsContent } from './ics';

describe('generateIcsContent', () => {
  it('génère un contenu VCALENDAR valide avec les champs attendus', () => {
    const content = generateIcsContent({
      title: 'Gala du Peuple VIII',
      location: 'Gymnase municipal, Vigneux-sur-Seine',
      start: new Date('2026-11-14T19:00:00Z'),
    });
    expect(content).toContain('BEGIN:VCALENDAR');
    expect(content).toContain('END:VCALENDAR');
    expect(content).toContain('SUMMARY:Gala du Peuple VIII');
    expect(content).toContain('LOCATION:Gymnase municipal\\, Vigneux-sur-Seine');
    expect(content).toContain('DTSTART:20261114T190000Z');
    expect(content).toContain('DTEND:20261114T220000Z');
  });

  it('échappe les caractères spéciaux', () => {
    const content = generateIcsContent({
      title: 'Titre, avec; virgule',
      location: 'Lieu',
      start: new Date('2026-01-01T00:00:00Z'),
    });
    expect(content).toContain('SUMMARY:Titre\\, avec\\; virgule');
  });
});
