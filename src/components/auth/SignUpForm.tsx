import { useState, type FormEvent } from "react";
import { Field } from "./Field";

interface FormState {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

type Errors = Partial<Record<keyof FormState, string>>;

const PASSWORD_RULE = /^(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
const EMAIL_RULE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate({ fullName, email, password, confirmPassword }: FormState): Errors {
  const errors: Errors = {};

  if (!fullName.trim()) errors.fullName = "Please enter your full name.";
  if (!email.trim()) errors.email = "Please enter your email address.";
  else if (!EMAIL_RULE.test(email)) errors.email = "Please enter a valid email address.";

  if (!PASSWORD_RULE.test(password)) {
    errors.password = "Use 8+ characters with a number and a special character.";
  }
  if (confirmPassword !== password) errors.confirmPassword = "Passwords do not match.";

  return errors;
}

export function SignUpForm() {
  const [values, setValues] = useState<FormState>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);

  const update = (key: keyof FormState) => (event: { target: { value: string } }) => {
    setValues((prev) => ({ ...prev, [key]: event.target.value }));
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    setSubmitted(Object.keys(nextErrors).length === 0);
  };

  return (
    <form noValidate onSubmit={handleSubmit} className="animate-fade-in">
      <h1 className="text-[1.375rem] font-normal tracking-[-0.01em] text-foreground">Create your account</h1>
      <p className="mt-3.5 text-xs font-light leading-relaxed text-muted-foreground">
        Join a network of visionaries and unlock premium design resources tailored for you.
      </p>

      <div className="mt-8 space-y-5">
        <Field
          label="Full name"
          required
          autoComplete="name"
          placeholder="e.g. Andrew Thomas"
          value={values.fullName}
          onChange={update("fullName")}
          error={errors.fullName}
        />

        <Field
          label="Email address"
          required
          type="email"
          autoComplete="email"
          placeholder="e.g. andrew@example.com"
          value={values.email}
          onChange={update("email")}
          error={errors.email}
        />

        <div className="grid grid-cols-2 gap-4">
          <Field
            label="Password"
            revealable
            autoComplete="new-password"
            placeholder="••••••••••"
            value={values.password}
            onChange={update("password")}
            error={errors.password}
          />
          <Field
            label="Confirm password"
            revealable
            autoComplete="new-password"
            placeholder="••••••••••"
            value={values.confirmPassword}
            onChange={update("confirmPassword")}
            error={errors.confirmPassword}
          />
        </div>

        <p className="text-[0.6875rem] font-light leading-relaxed text-muted-foreground">
          Password must be at least 8 characters, including a number and a special character.
        </p>
      </div>

      <button
        type="submit"
        className="mt-8 h-10 w-full rounded-lg bg-primary text-[0.8125rem] font-medium text-primary-foreground transition-colors duration-200 hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-card"
      >
        Create account
      </button>

      {submitted && (
        <p className="mt-4 text-center text-[0.6875rem] text-primary-dark" role="status">
          Account details look good — you are all set.
        </p>
      )}

      <p className="mt-7 text-center text-xs font-light text-muted-foreground">
        Already have an account?{" "}
        <a href="#sign-in" className="font-medium text-foreground transition-colors hover:text-primary-dark">
          Sign in
        </a>
      </p>

      <p className="mt-14 text-center text-[0.625rem] font-light leading-relaxed text-muted-foreground">
        By creating an account, you agree to our{" "}
        <a href="#terms" className="font-medium text-foreground transition-colors hover:text-primary-dark">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#privacy" className="font-medium text-foreground transition-colors hover:text-primary-dark">
          Privacy Policy
        </a>
        .
      </p>
    </form>
  );
}
