"use client";

import { createContext, useContext, useMemo, useState, ReactNode } from "react";

type AccordionType = "single" | "multiple";

type AccordionContextValue = {
  type: AccordionType;
  value: string | string[] | null;
  collapsible?: boolean;
  onToggle: (itemValue: string) => void;
};

const AccordionContext = createContext<AccordionContextValue | null>(null);

export type AccordionProps = {
  type?: AccordionType;
  collapsible?: boolean;
  value?: string | string[];
  defaultValue?: string | string[];
  className?: string;
  children: ReactNode;
};

export function Accordion({
  type = "single",
  collapsible = false,
  value,
  defaultValue,
  className,
  children,
}: AccordionProps) {
  const [internalValue, setInternalValue] = useState<string | string[] | null>(
    value ?? defaultValue ?? (type === "multiple" ? [] : null)
  );

  const currentValue = value !== undefined ? value : internalValue;

  const onToggle = (itemValue: string) => {
    if (type === "multiple") {
      const arrayValue = Array.isArray(currentValue) ? currentValue : [];
      const isOpen = arrayValue.includes(itemValue);
      const nextValue = isOpen
        ? arrayValue.filter((item) => item !== itemValue)
        : [...arrayValue, itemValue];
      setInternalValue(nextValue);
      return;
    }

    const stringValue = typeof currentValue === "string" ? currentValue : null;
    if (stringValue === itemValue) {
      if (collapsible) {
        setInternalValue(null);
      }
      return;
    }

    setInternalValue(itemValue);
  };

  const contextValue = useMemo(
    () => ({ type, value: currentValue, collapsible, onToggle }),
    [type, currentValue, collapsible]
  );

  return (
    <AccordionContext.Provider value={contextValue}>
      <div className={className}>{children}</div>
    </AccordionContext.Provider>
  );
}

type AccordionItemContextValue = {
  value: string;
};

const AccordionItemContext = createContext<AccordionItemContextValue | null>(null);

export type AccordionItemProps = {
  value: string;
  className?: string;
  children: ReactNode;
};

export function AccordionItem({ value, className, children }: AccordionItemProps) {
  return (
    <AccordionItemContext.Provider value={{ value }}>
      <div className={className}>{children}</div>
    </AccordionItemContext.Provider>
  );
}

export type AccordionTriggerProps = {
  children: ReactNode;
  className?: string;
};

export function AccordionTrigger({ children, className }: AccordionTriggerProps) {
  const accordion = useContext(AccordionContext);
  const item = useContext(AccordionItemContext);

  if (!accordion) {
    throw new Error("AccordionTrigger must be used within Accordion");
  }
  if (!item) {
    throw new Error("AccordionTrigger must be used within AccordionItem");
  }

  const handleClick = () => {
    accordion.onToggle(item.value);
  };

  return (
    <button type="button" onClick={handleClick} className={className}>
      {children}
    </button>
  );
}

export type AccordionContentProps = {
  children: ReactNode;
  className?: string;
};

export function AccordionContent({ children, className }: AccordionContentProps) {
  const accordion = useContext(AccordionContext);
  const item = useContext(AccordionItemContext);

  if (!accordion) {
    throw new Error("AccordionContent must be used within Accordion");
  }
  if (!item) {
    throw new Error("AccordionContent must be used within AccordionItem");
  }

  const isOpen = Array.isArray(accordion.value)
    ? accordion.value.includes(item.value)
    : accordion.value === item.value;

  return <div className={className} hidden={!isOpen}>{children}</div>;
}
