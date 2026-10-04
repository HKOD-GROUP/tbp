import { generateSlug } from './slug';

describe('generateSlug', () => {
  it('met en minuscules et remplace les espaces par des tirets', () => {
    expect(generateSlug('Gala du Peuple VIII')).toBe('gala-du-peuple-viii');
  });

  it('retire les accents', () => {
    expect(generateSlug('À Vigneux-sur-Seine')).toBe('a-vigneux-sur-seine');
  });

  it('retire la ponctuation', () => {
    expect(generateSlug('Chadi Baraia reste invaincu !')).toBe('chadi-baraia-reste-invaincu');
  });

  it('ne laisse pas de tiret en tête ou en fin', () => {
    expect(generateSlug('  -Titre-  ')).toBe('titre');
  });

  it('fusionne les séparateurs multiples', () => {
    expect(generateSlug('Gala  du   Peuple -- VIII')).toBe('gala-du-peuple-viii');
  });
});
