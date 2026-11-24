import { useEffect, useState } from "react";
import { getToken } from "./api";
import { LoginPage } from "./pages/LoginPage";
import { TasksPage } from "./pages/TasksPage";
import { getAuthor } from "./services/authorService";
import { logout } from "./services/authService";
import type { Author } from "./types";

export default function App() {
  const [author, setAuthor] = useState<Author | null>(null);
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    let active = true;

    async function restoreSession() {
      try {
        if (getToken()) {
          const profile = await getAuthor();
          if (active) setAuthor(profile);
        }
      } catch {
        if (active) logout();
      } finally {
        if (active) setBooting(false);
      }
    }

    void restoreSession();
    return () => {
      active = false;
    };
  }, []);

  function handleLogout() {
    logout();
    setAuthor(null);
  }

  if (booting) {
    return (
      <main className="app-shell">
        <p className="muted">Загрузка…</p>
      </main>
    );
  }

  if (!author) {
    return <LoginPage onSuccess={setAuthor} />;
  }

  return <TasksPage author={author} onLogout={handleLogout} />;
}
