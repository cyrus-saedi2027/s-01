import { forwardRef, useState, type InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  required?: boolean;
  error?: string;
  revealable?: boolean;
}

export const Field = forwardRef<HTMLInputElement, FieldProps>(function Field(
  { label, required, error, revealable, className, id, type = "text", ...props },
  ref,
) {
  const [revealed, setRevealed] = useState(false);
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");
  const resolvedType = revealable ? (revealed ? "text" : "password") : type;

  return (
    <div className="space-y-2">
      <label htmlFor={inputId} className="block text-xs font-normal text-foreground/80">
        {label}
        {required && <span className="ml-1 text-primary">*</span>}
      </label>

      <div className="relative">
        <input
          {...props}
          ref={ref}
          id={inputId}
          type={resolvedType}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className={cn(
            "h-10 w-full rounded-lg border border-border bg-input px-3.5 text-[0.8125rem] text-foreground",
            "placeholder:text-muted-foreground/70 transition-colors duration-200 outline-none",
            "focus:border-primary focus:ring-2 focus:ring-primary/25",
            error && "border-destructive focus:border-destructive focus:ring-destructive/20",
            revealable && "pr-10",
            className,
          )}
        />

        {revealable && (
          <button
            type="button"
            onClick={() => setRevealed((v) => !v)}
            aria-label={revealed ? "Hide password" : "Show password"}
            className="absolute inset-y-0 right-0 grid w-10 place-items-center text-muted-foreground transition-colors hover:text-foreground"
          >
            {revealed ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
          </button>
        )}
      </div>

      {error && (
        <p id={`${inputId}-error`} className="text-[0.6875rem] text-destructive">
          {error}
        </p>
      )}
    </div>
  );
});
