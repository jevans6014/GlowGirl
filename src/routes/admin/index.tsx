import { useState } from "react";
import { Loader2, Lock, LogOut } from "lucide-react";
import { toast } from "sonner";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { AdminDashboard } from "./Dashboard.tsx";

export default function AdminPage() {
  const { session, loading, signIn, signOut } = useAdminAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-charcoal">
        <Loader2 className="h-6 w-6 animate-spin text-pink-blush" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-charcoal px-6">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setSubmitting(true);
            try {
              await signIn(email, password);
            } catch (err) {
              toast.error((err as Error).message || "Sign in failed");
            } finally {
              setSubmitting(false);
            }
          }}
          className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-[var(--shadow-soft)]"
        >
          <div className="text-center">
            <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-pink-pale">
              <Lock className="h-5 w-5 text-charcoal" />
            </span>
            <h1 className="mt-4 font-display text-2xl tracking-[0.2em]">GLOWGIRL</h1>
            <p className="text-sm text-mid-gray">Owner Dashboard</p>
          </div>
          <div className="mt-6 space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full rounded-2xl border border-border bg-white px-5 py-3.5 outline-none focus:border-pink-deep"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full rounded-2xl border border-border bg-white px-5 py-3.5 outline-none focus:border-pink-deep"
            />
          </div>
          <button type="submit" disabled={submitting} className="btn-primary mt-6 w-full disabled:opacity-70">
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign In"}
          </button>
          <p className="mt-4 text-center text-xs text-mid-gray">
            Owner accounts are created in Supabase Auth.
          </p>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <header className="flex items-center justify-between border-b border-border bg-white px-6 py-4">
        <span className="font-display text-xl tracking-[0.2em]">GLOWGIRL · Admin</span>
        <button onClick={signOut} className="flex items-center gap-2 text-sm text-mid-gray hover:text-charcoal">
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </header>
      <AdminDashboard />
    </div>
  );
}
