import { useState, type FormEvent } from "react";
import { Field } from "../components/Field";
import * as authService from "../services/authService";
import type { Author } from "../types";
import { getErrorMessage } from "../utils/errors";
import "./LoginPage.css";

type LoginPageProps = {
  onSuccess: (author: Author) => void;
};

export function LoginPage({ onSuccess }: LoginPageProps) {
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setPending(true);

    try {
      const author = await authService.login(token);
      onSuccess(author);
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message === "Unauthorized" ? "Неверный токен." : message);
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <p className="brand login-card__brand">TodoList</p>
        <h1>Вход</h1>

        <div className="login-card__field">
          <Field
            id="api-token"
            type="password"
            label="Токен доступа"
            value={token}
            onChange={setToken}
            autoFocus
            autoComplete="off"
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary login-card__submit"
          disabled={pending || !token.trim()}
        >
          {pending ? "Входим…" : "Войти"}
        </button>

        {error ? <p className="error-text" role="alert">{error}</p> : null}
      </form>
    </main>
  );
}
