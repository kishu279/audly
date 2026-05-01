import { create } from "zustand";
import { NotificationType, Notification, NotificationStore } from "@/lib/types";

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  notify: (type, message, description) => {
    const id = Math.random().toString(36).substring(2, 9);
    set((state) => ({
      notifications: [...state.notifications, { id, type, message, description }],
    }));
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id),
      }));
    }, 5000);
  },
  dismiss: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
}));
