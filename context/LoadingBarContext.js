"use client";
import { createContext, useContext, useEffect, useRef, useState, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const LoadingBarContext = createContext({ start: () => {} });

function RouteChangeWatcher({ onRouteChange }) {
  // useSearchParams must live inside a Suspense boundary in the App Router,
  // so this tiny watcher component is wrapped in <Suspense> below.
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    onRouteChange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams?.toString()]);

  return null;
}

export function LoadingBarProvider({ children }) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const intervalRef = useRef(null);
  const pathname = usePathname();

  const start = () => {
    setVisible(true);
    setProgress(15);
    clearInterval(intervalRef.current);
    // Creep toward ~85% while we wait — never promises 100% until the route
    // actually finishes, so it always feels like real progress.
    intervalRef.current = setInterval(() => {
      setProgress((p) => (p < 85 ? p + (85 - p) * 0.15 : p));
    }, 200);
  };

  const done = () => {
    clearInterval(intervalRef.current);
    setProgress(100);
    setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 250);
  };

  // Catch clicks on ANY internal link (covers next/link across the whole
  // site — header nav, product cards, footer, admin sidebar) the instant
  // they happen, before Next.js even starts fetching the next route.
  useEffect(() => {
    const handleClick = (e) => {
      const anchor = e.target.closest?.("a");
      if (!anchor) return;
      if (anchor.target === "_blank" || e.metaKey || e.ctrlKey || e.shiftKey || anchor.hasAttribute("download")) return;
      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:")) return;
      const url = new URL(href, window.location.origin);
      if (url.pathname + url.search === pathname + window.location.search) return; // already there
      start();
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <LoadingBarContext.Provider value={{ start, done }}>
      <div
        className="fixed top-0 left-0 right-0 z-[9999] h-[3px] pointer-events-none transition-opacity duration-200"
        style={{ opacity: visible ? 1 : 0 }}
      >
        <div
          className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 shadow-[0_0_8px_rgba(22,163,74,0.6)] transition-all duration-200 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <Suspense fallback={null}>
        <RouteChangeWatcher onRouteChange={done} />
      </Suspense>
      {children}
    </LoadingBarContext.Provider>
  );
}

// Call start() before any programmatic navigation (router.push) that isn't
// triggered by clicking a plain <a>/<Link> — e.g. "Buy Now" buttons, form
// submits, redirects after login. The bar auto-completes once the URL changes.
export const useLoadingBar = () => useContext(LoadingBarContext);
