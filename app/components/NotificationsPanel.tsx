"use client";

import { AlertTriangle, CheckCircle2, Info, X } from "lucide-react";

export interface NotificationItem {
  id: string;
  level: "info" | "warning" | "danger";
  title: string;
  message: string;
  createdAt: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
}

export default function NotificationsPanel({
  isOpen,
  onClose,
  notifications,
}: Props) {
  if (!isOpen) return null;

  const levelStyle = (lvl: string) => {
    if (lvl === "danger") return { bg: "bg-red-50", text: "text-red-600", Icon: AlertTriangle };
    if (lvl === "warning") return { bg: "bg-amber-50", text: "text-amber-600", Icon: AlertTriangle };
    return { bg: "bg-primary-50", text: "text-primary-500", Icon: Info };
  };

  return (
    <div
      className="fixed inset-0 z-40 flex justify-end bg-black/30"
      onClick={onClose}
    >
      <div
        className="h-full w-full max-w-sm overflow-y-auto bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-lavender-100 p-4">
          <h2 className="text-lg font-semibold text-ink-900">Notifications</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-ink-400 hover:bg-lavender-50"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-3 p-4">
          {notifications.length === 0 ? (
            <div className="rounded-xl border border-lavender-100 bg-lavender-50/50 p-4 text-center">
              <CheckCircle2 className="mx-auto mb-2 h-6 w-6 text-green-500" />
              <p className="text-sm font-medium text-ink-700">No notifications</p>
              <p className="text-xs text-ink-400">You&apos;re all caught up.</p>
            </div>
          ) : (
            notifications.map((n) => {
              const { bg, text, Icon } = levelStyle(n.level);
              return (
                <div
                  key={n.id}
                  className={`flex gap-3 rounded-xl border border-lavender-100 p-3 ${bg}`}
                >
                  <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${text}`} />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-ink-900">{n.title}</p>
                    <p className="mt-0.5 text-xs text-ink-600">{n.message}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}