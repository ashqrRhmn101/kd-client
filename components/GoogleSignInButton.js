"use client";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { alertSuccess, alertError } from "@/lib/alert";
import { useAuth } from "@/context/AuthContext";
import { useLoadingBar } from "@/context/LoadingBarContext";

const SCRIPT_ID = "google-identity-services-script";

// Loads Google's Identity Services script once and renders the official
// "Sign in with Google" button. Requires NEXT_PUBLIC_GOOGLE_CLIENT_ID in .env.local
// (see README.md → "Google Sign-In সেটআপ" section for how to get one, free).
export default function GoogleSignInButton() {
  const buttonRef = useRef(null);
  const initializedRef = useRef(false); // guards against React StrictMode's double-effect in dev
  const router = useRouter();
  const { setUser } = useAuth();
  const { start } = useLoadingBar();

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId || initializedRef.current) return;

    const handleCredential = async (response) => {
      try {
        const { data } = await api.post("/auth/google", { credential: response.credential });
        setUser(data.user);
        alertSuccess("লগইন সফল হয়েছে");
        start();
        router.push("/");
      } catch (err) {
        alertError(err.response?.data?.message || "Google লগইন ব্যর্থ হয়েছে");
      }
    };

    const initializeAndRender = () => {
      if (!window.google || !buttonRef.current || initializedRef.current) return;
      initializedRef.current = true;
      window.google.accounts.id.initialize({ client_id: clientId, callback: handleCredential, cancel_on_tap_outside: true });
      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: "outline",
        size: "large",
        width: 320,
        text: "continue_with",
      });
    };

    if (window.google?.accounts?.id) {
      initializeAndRender();
      return;
    }

    // Reuse an existing script tag if one is already loading/loaded (e.g. from
    // a previous mount of this component elsewhere in the app) instead of
    // injecting duplicates — duplicate script tags are what usually trigger
    // Google's "initialize() called multiple times" warning.
    const existingScript = document.getElementById(SCRIPT_ID);
    if (existingScript) {
      existingScript.addEventListener("load", initializeAndRender, { once: true });
      return;
    }

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = initializeAndRender;
    document.body.appendChild(script);
  }, []);

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  if (!clientId) {
    return (
      <p className="text-xs text-gray-400 text-center border border-dashed border-gray-300 rounded-lg py-3">
        Google লগইন এখনো সেটআপ করা হয়নি — .env.local এ NEXT_PUBLIC_GOOGLE_CLIENT_ID যোগ করুন
      </p>
    );
  }

  return <div ref={buttonRef} className="flex justify-center" />;
}
