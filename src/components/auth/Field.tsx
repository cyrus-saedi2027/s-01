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
      <label htmlFor={inputId} className="block text-xs font-normal text-white/85">
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
            "h-10 w-full rounded-lg border border-white/[0.07] bg-input px-3.5 text-[0.8125rem] text-white/95",
            "placeholder:text-muted-foreground/70 transition-colors duration-200 outline-none",
            "focus:border-primary/70 focus:ring-2 focus:ring-primary/15",
            error && "border-destructive/70 focus:border-destructive/70 focus:ring-destructive/15",
            revealable && "pr-10",
            className,
          )}
        />

        {revealable && (
          <button
            type="button"
            onClick={() => setRevealed((v) => !v)}
            aria-label={revealed ? "Hide password" : "Show password"}
            className="absolute inset-y-0 right-0 grid w-10 place-items-center text-muted-foreground transition-colors hover:text-white/80"
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
