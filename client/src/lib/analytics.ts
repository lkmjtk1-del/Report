declare global {
  interface Window {
    gtag?: (
      command: string,
      action: string,
      params?: Record<string, unknown>
    ) => void;
  }
}

export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number
) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

export const trackPageView = (path: string, title?: string) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "page_view", {
      page_path: path,
      page_title: title,
    });
  }
};

export const trackDownloadClick = (platform: "android" | "ios") => {
  trackEvent("download_click", "engagement", platform);
};

export const trackChatOpen = () => {
  trackEvent("chat_open", "engagement", "support_chat");
};

export const trackChatMessage = () => {
  trackEvent("chat_message", "engagement", "support_chat");
};

export const trackNavigation = (section: string) => {
  trackEvent("navigation", "engagement", section);
};
