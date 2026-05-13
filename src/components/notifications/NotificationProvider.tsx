"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface NotificationContextValue {
  alert: (message: string, title?: string) => Promise<void>;
  success: (message: string, title?: string) => Promise<void>;
  error: (message: string, title?: string) => Promise<void>;
  confirm: (message: string, title?: string) => Promise<boolean>;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within NotificationProvider");
  }
  return context;
}

type NotificationVariant = "info" | "success" | "error" | "confirm";

type NotificationState = {
  open: boolean;
  title: string;
  message: string;
  variant: NotificationVariant;
  confirmLabel: string;
  cancelLabel: string;
};

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<NotificationState>({
    open: false,
    title: "Notification",
    message: "",
    variant: "info",
    confirmLabel: "Confirm",
    cancelLabel: "Cancel",
  });
  const [resolver, setResolver] = useState<((value: boolean) => void) | null>(null);

  const close = useCallback(
    (result: boolean) => {
      setState(prev => ({ ...prev, open: false }));
      if (resolver) {
        resolver(result);
        setResolver(null);
      }
    },
    [resolver]
  );

  const showModal = useCallback(
    (options: Partial<NotificationState>) =>
      new Promise<boolean>(resolve => {
        setState({
          open: true,
          title: options.title ?? "Notification",
          message: options.message ?? "",
          variant: options.variant ?? "info",
          confirmLabel: options.confirmLabel ?? "Confirm",
          cancelLabel: options.cancelLabel ?? "Cancel",
        });
        setResolver(() => resolve);
      }),
    []
  );

  const alert = useCallback(
    async (message: string, title = "Notice") => {
      await showModal({ message, title, variant: "info" });
    },
    [showModal]
  );

  const success = useCallback(
    async (message: string, title = "Success") => {
      await showModal({ message, title, variant: "success" });
    },
    [showModal]
  );

  const error = useCallback(
    async (message: string, title = "Error") => {
      await showModal({ message, title, variant: "error" });
    },
    [showModal]
  );

  const confirm = useCallback(
    async (message: string, title = "Please confirm") => {
      return showModal({
        message,
        title,
        variant: "confirm",
        confirmLabel: "Yes",
        cancelLabel: "No",
      });
    },
    [showModal]
  );

  const icon = useMemo(() => {
    switch (state.variant) {
      case "success":
        return <CheckCircle2 className="w-8 h-8 text-emerald-500" />;
      case "error":
        return <XCircle className="w-8 h-8 text-rose-500" />;
      case "confirm":
        return <AlertTriangle className="w-8 h-8 text-amber-500" />;
      default:
        return <Info className="w-8 h-8 text-sky-500" />;
    }
  }, [state.variant]);

  return (
    <NotificationContext.Provider value={{ alert, success, error, confirm }}>
      {children}
      <Dialog open={state.open} onOpenChange={(open) => { if (!open) close(false); }}>
        <DialogContent className="sm:max-w-md w-full rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
          <div className="flex flex-col gap-4 p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-100 dark:bg-slate-950">
                {icon}
              </div>
              <div>
                <DialogHeader className="p-0">
                  <DialogTitle className="text-xl font-bold">{state.title}</DialogTitle>
                </DialogHeader>
                <p className="text-sm text-muted-foreground mt-1">{state.message}</p>
              </div>
            </div>
            <DialogFooter className="flex flex-col gap-3 sm:flex-row sm:justify-end sm:gap-4 p-0">
              {state.variant === "confirm" ? (
                <>
                  <Button variant="ghost" className="w-full sm:w-auto rounded-2xl" onClick={() => close(false)}>
                    {state.cancelLabel}
                  </Button>
                  <Button className="w-full sm:w-auto rounded-2xl" onClick={() => close(true)}>
                    {state.confirmLabel}
                  </Button>
                </>
              ) : (
                <Button className="w-full rounded-2xl" onClick={() => close(true)}>
                  OK
                </Button>
              )}
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </NotificationContext.Provider>
  );
}
