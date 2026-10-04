/**
 * Valide qu'une URL est bien un lien de paiement PayPal (EDB 7) :
 * `https://www.paypal.com/ncp/payment/...`.
 */
export function isValidPaypalUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return (
      parsed.protocol === 'https:' &&
      parsed.hostname === 'www.paypal.com' &&
      parsed.pathname.startsWith('/ncp/payment/')
    );
  } catch {
    return false;
  }
}
