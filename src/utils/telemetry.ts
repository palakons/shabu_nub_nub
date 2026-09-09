const AUTH_SERVER_URL = (import.meta as unknown as { env: Record<string, string> }).env?.VITE_AUTH_SERVER_URL || 'http://localhost:4000';

export const getAnonSessionId = (): string => {
  try {
    let anonId = localStorage.getItem('shabu_anon_id') || localStorage.getItem('mk_buffet_anon_id');
    if (!anonId) {
      const rand = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID().slice(0, 8) : Math.random().toString(36).substring(2, 10);
      anonId = `anon_${rand}`;
      localStorage.setItem('shabu_anon_id', anonId);
    }
    return anonId;
  } catch {
    return `anon_${Date.now()}`;
  }
};

export const detectDeviceType = (): 'mobile' | 'tablet' | 'desktop' => {
  if (typeof window === 'undefined') return 'desktop';
  const width = window.innerWidth;
  if (width < 640) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
};

export const detectBrowser = (): string => {
  if (typeof navigator === 'undefined') return 'unknown';
  const ua = navigator.userAgent;
  if (/Line/i.test(ua)) return 'LINE';
  if (/Instagram/i.test(ua)) return 'Instagram';
  if (/FBAN|FBAV/i.test(ua)) return 'Facebook';
  if (/Chrome/i.test(ua) && !/Edg/i.test(ua)) return 'Chrome';
  if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) return 'Safari';
  if (/Edg/i.test(ua)) return 'Edge';
  if (/Firefox/i.test(ua)) return 'Firefox';
  return 'other';
};

export const trackEvent = (eventType: string, metadata: Record<string, unknown> = {}) => {
  try {
    const token = localStorage.getItem('mk_buffet_auth_token');
    const anonSessionId = getAnonSessionId();
    const deviceType = detectDeviceType();
    const browser = detectBrowser();
    const screen = typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : '0x0';

    const enrichedMetadata = {
      ...metadata,
      deviceType,
      browser,
      screen,
    };

    const payload = JSON.stringify({
      eventType,
      anonSessionId,
      metadata: enrichedMetadata,
    });

    const url = `${AUTH_SERVER_URL}/api/shabu/telemetry`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
      const blob = new Blob([payload], { type: 'application/json' });
      navigator.sendBeacon(url, blob);
    } else {
      fetch(url, {
        method: 'POST',
        headers,
        body: payload,
        keepalive: true,
      }).catch(() => {});
    }
  } catch (e) {
    // Fire-and-forget, swallow errors
  }
};

// Alias for backwards compatibility
export const trackUsageEvent = trackEvent;
