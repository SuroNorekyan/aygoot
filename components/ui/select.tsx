"use client";

import * as React from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type SelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

type SelectProps = Omit<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  "children" | "onChange" | "size"
> & {
  children: React.ReactNode;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
};

function optionText(children: React.ReactNode) {
  return React.Children.toArray(children)
    .map((child) => (typeof child === "string" || typeof child === "number" ? String(child) : ""))
    .join("")
    .trim();
}

function optionsFromChildren(children: React.ReactNode): SelectOption[] {
  return React.Children.toArray(children).flatMap((child) => {
    if (!React.isValidElement<{ value?: string | number; disabled?: boolean; children?: React.ReactNode }>(child)) {
      return [];
    }

    const value = child.props.value ?? optionText(child.props.children);
    return {
      value: String(value),
      label: optionText(child.props.children) || String(value),
      disabled: child.props.disabled,
    };
  });
}

export function Select({
  id,
  name,
  value,
  defaultValue,
  onChange,
  className,
  children,
  disabled,
  required,
  "aria-label": ariaLabel,
}: SelectProps) {
  const selectOptions = React.useMemo(() => optionsFromChildren(children), [children]);
  const initialValue = String(value ?? defaultValue ?? selectOptions.find((option) => !option.disabled)?.value ?? "");
  const [internalValue, setInternalValue] = React.useState(initialValue);
  const selectedValue = value !== undefined ? String(value) : internalValue;
  const selectedOption = selectOptions.find((option) => option.value === selectedValue) ?? selectOptions[0];
  const [isOpen, setIsOpen] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(
    Math.max(0, selectOptions.findIndex((option) => option.value === selectedValue)),
  );
  const rootRef = React.useRef<HTMLDivElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const listboxId = React.useId();

  React.useEffect(() => {
    if (value === undefined) return;
    setInternalValue(String(value));
  }, [value]);

  React.useEffect(() => {
    if (!isOpen) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [isOpen]);

  const commitValue = (nextValue: string) => {
    const option = selectOptions.find((item) => item.value === nextValue);
    if (!option || option.disabled) return;

    if (value === undefined) {
      setInternalValue(nextValue);
    }
    setIsOpen(false);

    onChange?.({
      target: { value: nextValue },
      currentTarget: { value: nextValue },
    } as React.ChangeEvent<HTMLSelectElement>);
  };

  const moveActive = (direction: 1 | -1) => {
    if (!selectOptions.length) return;

    let nextIndex = activeIndex;
    for (let count = 0; count < selectOptions.length; count += 1) {
      nextIndex = (nextIndex + direction + selectOptions.length) % selectOptions.length;
      if (!selectOptions[nextIndex]?.disabled) {
        setActiveIndex(nextIndex);
        return;
      }
    }
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        return;
      }
      moveActive(event.key === "ArrowDown" ? 1 : -1);
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        return;
      }
      commitValue(selectOptions[activeIndex]?.value ?? selectedValue);
    }

    if (event.key === "Escape") {
      setIsOpen(false);
      buttonRef.current?.focus();
    }
  };

  return (
    <div ref={rootRef} className={cn("relative w-full", className)}>
      {name ? <input type="hidden" name={name} value={selectedValue} required={required} /> : null}
      <button
        ref={buttonRef}
        id={id}
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        disabled={disabled}
        onClick={() => setIsOpen((current) => !current)}
        onKeyDown={onKeyDown}
        className={cn(
          "flex h-12 w-full items-center justify-between rounded-[20px] border border-[rgba(var(--border-soft),0.22)] bg-[rgba(255,251,245,0.92)] px-4 text-left text-sm font-medium text-[rgb(var(--foreground))] shadow-[0_12px_24px_rgba(37,28,21,0.05),inset_0_1px_0_rgba(255,255,255,0.68)] outline-none transition hover:border-[rgba(var(--border-soft),0.34)] hover:bg-white focus:border-[rgba(var(--forest),0.42)] focus:bg-white focus:shadow-[0_0_0_4px_rgba(116,143,111,0.13),0_12px_24px_rgba(37,28,21,0.05)] disabled:cursor-not-allowed disabled:opacity-60",
        )}
      >
        <span className="min-w-0 truncate">{selectedOption?.label ?? "Select"}</span>
        <ChevronDown
          aria-hidden="true"
          className={cn(
            "ml-3 h-4 w-4 shrink-0 text-[rgba(var(--muted-foreground),0.78)] transition",
            isOpen ? "rotate-180" : "",
          )}
        />
      </button>

      {isOpen ? (
        <div
          id={listboxId}
          role="listbox"
          tabIndex={-1}
          aria-activedescendant={`${listboxId}-${activeIndex}`}
          className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 max-h-72 overflow-auto rounded-[20px] border border-[rgba(var(--border-soft),0.24)] bg-[#fffaf3] p-1.5 shadow-[0_22px_54px_rgba(37,28,21,0.18),inset_0_1px_0_rgba(255,255,255,0.72)]"
        >
          {selectOptions.map((option, index) => {
            const isSelected = option.value === selectedValue;
            const isActive = index === activeIndex;

            return (
              <button
                key={option.value}
                id={`${listboxId}-${index}`}
                type="button"
                role="option"
                aria-selected={isSelected}
                disabled={option.disabled}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => commitValue(option.value)}
                className={cn(
                  "flex min-h-11 w-full items-center justify-between gap-3 rounded-[16px] px-3 py-2 text-left text-sm font-semibold text-[rgb(var(--foreground))] outline-none transition",
                  isActive || isSelected ? "bg-[rgba(173,128,84,0.13)]" : "hover:bg-white/82",
                  option.disabled ? "cursor-not-allowed opacity-45" : "",
                )}
              >
                <span className="min-w-0 truncate">{option.label}</span>
                {isSelected ? <Check className="h-4 w-4 shrink-0 text-[rgb(var(--secondary))]" /> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

Select.displayName = "Select";
