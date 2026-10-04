import { isValidPaypalUrl } from './paypal';

describe('isValidPaypalUrl', () => {
  it('accepte un vrai lien de paiement PayPal', () => {
    expect(isValidPaypalUrl('https://www.paypal.com/ncp/payment/ABC123')).toBe(true);
  });

  it('refuse un autre domaine', () => {
    expect(isValidPaypalUrl('https://paypal.evil.com/ncp/payment/ABC123')).toBe(false);
  });

  it('refuse le http non sécurisé', () => {
    expect(isValidPaypalUrl('http://www.paypal.com/ncp/payment/ABC123')).toBe(false);
  });

  it("refuse un chemin PayPal qui n'est pas un lien de paiement", () => {
    expect(isValidPaypalUrl('https://www.paypal.com/myaccount/summary')).toBe(false);
  });

  it("refuse une chaîne qui n'est pas une URL", () => {
    expect(isValidPaypalUrl('pas une url')).toBe(false);
  });
});
