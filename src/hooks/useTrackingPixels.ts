import { useEffect, useCallback, useRef } from 'react';
import { TrackingConfig } from '@/types/funnel';

declare global {
  interface Window {
    fbq: any;
    gtag: any;
    ttq: any;
    dataLayer: any[];
  }
}

interface UseTrackingPixelsOptions {
  trackingConfig?: TrackingConfig;
  funnelId: string;
  funnelName?: string;
}

export function useTrackingPixels({ trackingConfig, funnelId, funnelName }: UseTrackingPixelsOptions) {
  const initialized = useRef<{ facebook: boolean; google: boolean; tiktok: boolean }>({
    facebook: false,
    google: false,
    tiktok: false
  });

  // Initialize Facebook Pixel
  const initFacebookPixel = useCallback((pixelId: string) => {
    if (initialized.current.facebook || !pixelId) return;

    // Load Facebook Pixel script
    const script = document.createElement('script');
    script.innerHTML = `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '${pixelId}');
    `;
    document.head.appendChild(script);

    initialized.current.facebook = true;
    console.log('[Tracking] Facebook Pixel initialized:', pixelId);
  }, []);

  // Initialize Google Analytics 4
  const initGoogleAnalytics = useCallback((measurementId: string) => {
    if (initialized.current.google || !measurementId) return;

    // Load gtag script
    const gtagScript = document.createElement('script');
    gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    gtagScript.async = true;
    document.head.appendChild(gtagScript);

    // Initialize gtag
    const configScript = document.createElement('script');
    configScript.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${measurementId}', {
        page_title: '${funnelName || 'Funnel'}',
        send_page_view: false
      });
    `;
    document.head.appendChild(configScript);

    initialized.current.google = true;
    console.log('[Tracking] Google Analytics initialized:', measurementId);
  }, [funnelName]);

  // Initialize TikTok Pixel
  const initTikTokPixel = useCallback((pixelId: string) => {
    if (initialized.current.tiktok || !pixelId) return;

    const script = document.createElement('script');
    script.innerHTML = `
      !function (w, d, t) {
        w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
        ttq.load('${pixelId}');
        ttq.page();
      }(window, document, 'ttq');
    `;
    document.head.appendChild(script);

    initialized.current.tiktok = true;
    console.log('[Tracking] TikTok Pixel initialized:', pixelId);
  }, []);

  // Initialize all pixels
  useEffect(() => {
    if (!trackingConfig) return;

    const { facebookPixel, googleAnalytics, tiktokPixel } = trackingConfig;

    if (facebookPixel?.enabled && facebookPixel.pixelId) {
      initFacebookPixel(facebookPixel.pixelId);
    }

    if (googleAnalytics?.enabled && googleAnalytics.measurementId) {
      initGoogleAnalytics(googleAnalytics.measurementId);
    }

    if (tiktokPixel?.enabled && tiktokPixel.pixelId) {
      initTikTokPixel(tiktokPixel.pixelId);
    }
  }, [trackingConfig, initFacebookPixel, initGoogleAnalytics, initTikTokPixel]);

  // Track PageView
  const trackPageView = useCallback(() => {
    if (!trackingConfig) return;

    const { facebookPixel, googleAnalytics } = trackingConfig;

    // Facebook PageView
    if (facebookPixel?.enabled && facebookPixel.trackPageView !== false && window.fbq) {
      window.fbq('track', 'PageView');
      console.log('[Tracking] Facebook PageView tracked');
    }

    // Google Analytics PageView
    if (googleAnalytics?.enabled && googleAnalytics.trackPageView !== false && window.gtag) {
      window.gtag('event', 'page_view', {
        page_title: funnelName || 'Funnel',
        page_location: window.location.href,
        funnel_id: funnelId
      });
      console.log('[Tracking] GA4 PageView tracked');
    }

    // TikTok PageView
    if (trackingConfig.tiktokPixel?.enabled && window.ttq) {
      window.ttq.page();
      console.log('[Tracking] TikTok PageView tracked');
    }
  }, [trackingConfig, funnelId, funnelName]);

  // Track Lead
  const trackLead = useCallback((email?: string, phone?: string, value?: number) => {
    if (!trackingConfig) return;

    const { facebookPixel, googleAnalytics, tiktokPixel } = trackingConfig;

    // Facebook Lead event
    if (facebookPixel?.enabled && facebookPixel.trackLead !== false && window.fbq) {
      window.fbq('track', 'Lead', {
        content_name: funnelName,
        content_category: 'Funnel',
        value: value || 0,
        currency: 'EUR'
      });
      console.log('[Tracking] Facebook Lead tracked');
    }

    // Google Analytics form_submit
    if (googleAnalytics?.enabled && googleAnalytics.trackFormSubmit !== false && window.gtag) {
      window.gtag('event', 'generate_lead', {
        currency: 'EUR',
        value: value || 0,
        funnel_id: funnelId,
        funnel_name: funnelName
      });
      console.log('[Tracking] GA4 generate_lead tracked');
    }

    // TikTok Lead event
    if (tiktokPixel?.enabled && window.ttq) {
      window.ttq.track('SubmitForm', {
        content_name: funnelName,
        content_id: funnelId
      });
      console.log('[Tracking] TikTok SubmitForm tracked');
    }
  }, [trackingConfig, funnelId, funnelName]);

  // Track Complete Registration
  const trackCompleteRegistration = useCallback((score?: number) => {
    if (!trackingConfig) return;

    const { facebookPixel, googleAnalytics, tiktokPixel } = trackingConfig;

    // Facebook CompleteRegistration
    if (facebookPixel?.enabled && facebookPixel.trackCompleteRegistration && window.fbq) {
      window.fbq('track', 'CompleteRegistration', {
        content_name: funnelName,
        status: 'completed',
        value: score || 0
      });
      console.log('[Tracking] Facebook CompleteRegistration tracked');
    }

    // Google Analytics sign_up
    if (googleAnalytics?.enabled && window.gtag) {
      window.gtag('event', 'sign_up', {
        method: 'Funnel',
        funnel_id: funnelId,
        score: score
      });
      console.log('[Tracking] GA4 sign_up tracked');
    }

    // TikTok CompleteRegistration
    if (tiktokPixel?.enabled && window.ttq) {
      window.ttq.track('CompleteRegistration', {
        content_id: funnelId
      });
      console.log('[Tracking] TikTok CompleteRegistration tracked');
    }
  }, [trackingConfig, funnelId, funnelName]);

  // Track Step Change
  const trackStepChange = useCallback((stepId: string, stepName: string, stepIndex: number) => {
    if (!trackingConfig?.googleAnalytics?.enabled || !trackingConfig.googleAnalytics.trackStepChange) return;

    if (window.gtag) {
      window.gtag('event', 'funnel_step', {
        funnel_id: funnelId,
        funnel_name: funnelName,
        step_id: stepId,
        step_name: stepName,
        step_index: stepIndex
      });
      console.log('[Tracking] GA4 funnel_step tracked:', stepName);
    }
  }, [trackingConfig, funnelId, funnelName]);

  // Track custom event
  const trackCustomEvent = useCallback((eventName: string, params?: Record<string, any>) => {
    if (!trackingConfig) return;

    // Facebook custom event
    if (trackingConfig.facebookPixel?.enabled && window.fbq) {
      window.fbq('trackCustom', eventName, params);
    }

    // Google Analytics custom event
    if (trackingConfig.googleAnalytics?.enabled && window.gtag) {
      window.gtag('event', eventName, params);
    }

    // TikTok custom event
    if (trackingConfig.tiktokPixel?.enabled && window.ttq) {
      window.ttq.track(eventName, params);
    }

    console.log('[Tracking] Custom event tracked:', eventName, params);
  }, [trackingConfig]);

  return {
    trackPageView,
    trackLead,
    trackCompleteRegistration,
    trackStepChange,
    trackCustomEvent
  };
}
