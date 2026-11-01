// Cross-platform Phone & Desktop Notification Manager for TIMEFRAME

export const isPhoneDevice = (): boolean => {
  if (typeof navigator === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

export const isNotificationSupported = (): boolean => {
  return typeof window !== 'undefined' && 'Notification' in window;
};

// Register service worker for reliable phone notifications (Android/iOS PWA)
export const initNotificationService = async () => {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    try {
      await navigator.serviceWorker.register('/sw.js');
    } catch (e) {
      console.warn('Service worker registration failed:', e);
    }
  }
};

// Request Notification Permission
export const requestDeviceNotificationPermission = async (): Promise<NotificationPermission> => {
  if (!isNotificationSupported()) {
    throw new Error('Notifications are not supported in this browser.');
  }

  // Ensure service worker is initialized for mobile phone push
  await initNotificationService();

  const permission = await Notification.requestPermission();
  return permission;
};

// Send System Notification (Handles both mobile phones & desktop)
export interface NotificationPayload {
  title: string;
  body: string;
  tag?: string;
}

export const sendDeviceNotification = async ({ title, body, tag = 'timeframe-timer' }: NotificationPayload) => {
  if (!isNotificationSupported() || Notification.permission !== 'granted') {
    return false;
  }

  // Trigger mobile phone haptic vibration pattern: buzz, pause, buzz, pause, long buzz
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate([300, 150, 300, 150, 600]);
    } catch (e) {
      // ignore
    }
  }

  const notificationOptions: NotificationOptions & Record<string, any> = {
    body,
    tag,
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    renotify: true,
  };

  // Try Service Worker registration first (standard and required on mobile phones like Android)
  if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.ready;
      if (registration && registration.showNotification) {
        await registration.showNotification(title, notificationOptions);
        return true;
      }
    } catch (e) {
      console.warn('ServiceWorker showNotification fallback to window.Notification', e);
    }
  }

  // Fallback to standard window.Notification
  try {
    const notif = new Notification(title, notificationOptions);
    notif.onclick = () => {
      window.focus();
      notif.close();
    };
    return true;
  } catch (e) {
    console.warn('Failed to dispatch notification', e);
    return false;
  }
};
