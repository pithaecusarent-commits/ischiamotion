export function isRenterPortalEnabled() {
  return process.env.RENTER_PORTAL_ENABLED === "true";
}

export const renterPortalDisabledMessage =
  "Area partner non attiva. Al momento l'accesso dei partner al gestionale e gestito internamente da IschiaMotion.";

export const renterRegistrationDisabledMessage =
  "L'area partner non e attiva per nuove registrazioni. Per collaborazioni o informazioni scrivi a info@ischiamotion.com.";
