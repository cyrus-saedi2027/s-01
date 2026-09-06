import { AuthFrame } from "@/components/auth/AuthFrame";
import { SignUpForm } from "@/components/auth/SignUpForm";

// Bundled locally so the screen renders without a third-party host.
// Swap this import for your own photograph.
import heroImage from "@/assets/architecture-hero.jpg";

export default function SignUp() {
  return (
    // The screen is laid out left-to-right regardless of the document direction.
    <main dir="ltr" className="flex min-h-screen items-center justify-center bg-background p-4 sm:p-8">
      <AuthFrame
        image={heroImage}
        imageAlt="Dark cantilevered concrete architecture above a fog-covered field"
        headline={[
          "Design your future, one blueprint at a time.",
          "Join a community of architects shaping tomorrow.",
        ]}
        caption="Structura — Your gateway to architectural excellence."
      >
        <SignUpForm />
      </AuthFrame>
    </main>
  );
}
