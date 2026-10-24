'use client';

import { useActionState } from 'react';
import { signIn } from './actions';

export function LoginForm() {
  const [error, action, pending] = useActionState(signIn, '');
  return (
    <>
      {error && (
        <div className="alert alert-danger mb-4" role="alert">
          {error}
        </div>
      )}
      <form action={action} className="space-y-4">
        <div>
          <label className="form-label" htmlFor="email">Email</label>
          <input className="form-input bg-white" id="email" name="email" type="email" autoComplete="username" placeholder="Unesi email" required />
        </div>
        <div>
          <label className="form-label" htmlFor="password">Lozinka</label>
          <input className="form-input bg-white" id="password" name="password" type="password" autoComplete="current-password" placeholder="Unesi lozinku" required />
        </div>
        <button className="btn btn-primary mt-2 w-full py-2.5" type="submit" disabled={pending}>
          Prijavi se
        </button>
      </form>
    </>
  );
}
