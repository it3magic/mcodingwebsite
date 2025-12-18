"use client";

import Script from 'next/script';

export default function GoogleAnalytics() {
  const GTM_ID = 'GTM-W2K9BTHS';

  return (
    <>
      {/* Google Tag Manager */}
      <Script
        id="google-tag-manager"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${GTM_ID}');
          `,
        }}
      />
      {/* Google Tag Manager (noscript) */}
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
          height="0"
          width="0"
          style={{ display: 'none', visibility: 'hidden' }}
        />
      </noscript>
    </>
  );
}

// Extend Window interface for dataLayer
declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

// Event tracking helper functions using GTM dataLayer
export const trackEvent = (eventName: string, eventParams?: Record<string, unknown>) => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: eventName,
      ...eventParams
    });
  }
};

// Conversion tracking functions
export const trackFormSubmission = (formName: string) => {
  trackEvent('form_submission', {
    form_name: formName,
    event_category: 'engagement',
  });
};

export const trackPhoneClick = () => {
  trackEvent('phone_click', {
    event_category: 'conversion',
    event_label: 'Phone Number Click',
  });
};

export const trackWhatsAppClick = (context: string) => {
  trackEvent('whatsapp_click', {
    event_category: 'conversion',
    event_label: context,
  });
};

export const trackEmailClick = () => {
  trackEvent('email_click', {
    event_category: 'conversion',
    event_label: 'Email Click',
  });
};

export const trackProductView = (productName: string) => {
  trackEvent('view_item', {
    event_category: 'ecommerce',
    items: [{
      item_name: productName,
    }],
  });
};

export const trackServiceBooking = (serviceName: string) => {
  trackEvent('service_booking', {
    event_category: 'conversion',
    service_name: serviceName,
  });
};
