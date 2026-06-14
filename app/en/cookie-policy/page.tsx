import type { Metadata } from "next";
import { InfoPage } from "@/components/site/InfoPage";

export const metadata: Metadata = {
  title: "Cookie Policy | IschiaMotion",
  description: "Cookie Policy for IschiaMotion: information about the technical cookies used on this site. No tracking or profiling cookies are used.",
  alternates: {
    canonical: "/en/cookie-policy",
    languages: { it: "/it/cookie-policy", en: "/en/cookie-policy", "x-default": "/it/cookie-policy" }
  },
  robots: { index: true, follow: true }
};

export default function CookiePolicyEnPage() {
  return (
    <InfoPage
      locale="en"
      content={{
        eyebrow: "Cookie Policy",
        title: "Cookie Policy",
        intro: "This page explains how IschiaMotion uses cookies on its website. In line with applicable regulations (GDPR and ePrivacy Directive), IschiaMotion uses only technical cookies that are strictly necessary for the service to function. No consent is required.",
        cardTitle: "Technical cookies only",
        cardText: "No profiling, advertising or analytics cookies. No consent banner required.",
        sections: [
          {
            title: "What are cookies",
            body: "Cookies are small text files that a website saves in your browser when you visit it. They can be used to keep the site working correctly, remember your session, or collect information about your behaviour. Only the last category requires consent."
          },
          {
            title: "Technical cookies on this site",
            body: "IschiaMotion sets session cookies solely for authentication in the restricted areas (partner area and admin area). These cookies are HTTP-only (not accessible via JavaScript), carry the Secure and SameSite=Lax flags, and are set by the Supabase authentication service. They last until logout or session expiry and contain no personal data or tracking identifiers."
          },
          {
            title: "Analytics cookies",
            body: "IschiaMotion does not use Google Analytics, Matomo, Hotjar, Microsoft Clarity or any other web traffic analysis tool. No statistical data is collected via cookies."
          },
          {
            title: "Third-party cookies",
            body: "The site does not embed widgets, maps, videos, tracking pixels or third-party scripts that set cookies. The link to Trustpilot opens an external site in a new tab and does not write any cookies on this domain."
          },
          {
            title: "Managing cookies in your browser",
            body: "You can view, block or delete cookies at any time from your browser settings. Each browser follows a different path — look for 'cookies' or 'privacy' in the settings of Chrome, Firefox, Safari or Edge. Disabling technical cookies may prevent the restricted areas from working correctly."
          },
          {
            title: "Privacy Notice",
            body: (
              <>
                For full information on how your personal data is handled, see our{" "}
                <a href="/en/privacy">Privacy Notice</a>.
                For questions about this cookie policy write to{" "}
                <a href="mailto:info@ischiamotion.com">info@ischiamotion.com</a>.
              </>
            )
          }
        ]
      }}
    />
  );
}
