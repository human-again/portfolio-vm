import { signIn } from "@/auth";
import { redirect } from "next/navigation";
import { Lock } from "lucide-react";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  const { callbackUrl, error } = await searchParams;

  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4 bg-muted/30">
      <div className="w-full max-w-sm border border-border rounded-2xl bg-background p-8 shadow-sm">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted mb-6">
          <Lock size={18} className="text-muted-foreground" aria-hidden="true" />
        </div>

        <h1 className="text-2xl font-bold text-foreground mb-1">Admin Panel</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Enter your password to continue.
        </p>

        {error && (
          <p role="alert" className="text-sm text-red-500 mb-4 px-3 py-2 bg-red-50 rounded-lg">
            Incorrect password. Please try again.
          </p>
        )}

        <form
          action={async (formData: FormData) => {
            "use server";
            try {
              await signIn("credentials", {
                password: formData.get("password"),
                redirectTo: callbackUrl || "/admin",
              });
            } catch (e) {
              // Re-throw NEXT_REDIRECT so Next.js handles the success redirect
              if (
                e &&
                typeof e === "object" &&
                "digest" in e &&
                String((e as { digest: string }).digest).startsWith(
                  "NEXT_REDIRECT"
                )
              ) {
                throw e;
              }
              // Any other error = wrong password
              const params = new URLSearchParams({ error: "invalid" });
              if (callbackUrl) params.set("callbackUrl", callbackUrl);
              redirect(`/admin/login?${params}`);
            }
          }}
          className="space-y-4"
        >
          <label htmlFor="admin-password" className="sr-only">
            Password
          </label>
          <input
            id="admin-password"
            type="password"
            name="password"
            placeholder="Password"
            autoFocus
            required
            className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-foreground/20"
          />
          <button
            type="submit"
            className="w-full px-4 py-2 bg-foreground text-background rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Sign In
          </button>
        </form>
      </div>
    </main>
  );
}
