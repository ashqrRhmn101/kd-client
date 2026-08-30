import axios from "axios";

// IMPORTANT: this MUST use the same hostname you type in your browser's
// address bar (localhost, in almost all cases). Browsers treat "localhost"
// and "127.0.0.1" as different sites for cookie purposes — if the frontend
// page loads from localhost:3000 but this points at 127.0.0.1:5000, the
// login cookie gets set but is then blocked on every later request (shows
// up as random 401 Unauthorized errors on admin pages). Keep both sides
// consistent — if you ever open the site via http://127.0.0.1:3000 instead,
// change this to match.
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://kd-server-s10q.onrender.com/",
  withCredentials: true, // sends the httpOnly auth cookie automatically
  timeout: 15000, // fail fast instead of hanging forever if the backend is down/asleep
});

export default api;
