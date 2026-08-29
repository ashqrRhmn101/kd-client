import axios from "axios";

const api = axios.create({
  // Tip: prefer 127.0.0.1 over localhost in NEXT_PUBLIC_API_URL — Node's
  // fetch/undici can add several seconds of delay resolving "localhost"
  // when a machine has both IPv4 and IPv6 stacks (tries IPv6 first, waits,
  // falls back). 127.0.0.1 skips that resolution entirely.
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000/api",
  withCredentials: true, // sends the httpOnly auth cookie automatically
  timeout: 15000, // fail fast instead of hanging forever if the backend is down/asleep
});

export default api;
