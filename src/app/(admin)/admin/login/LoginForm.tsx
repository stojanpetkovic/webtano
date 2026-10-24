'use client';

import { useActionState, useState } from 'react';
import { ArrowRight, CircleAlert, Eye, EyeOff, LoaderCircle, Lock, Mail } from 'lucide-react';
import { signIn } from './actions';

export function LoginForm() {
  const [{ error, email }, action, pending] = useActionState(signIn, { error: '', email: '' });
  const [shown, setShown] = useState(false);

  return (
    <form action={action} className="space-y-5">
      {error && (
        <div className="alert alert-danger flex items-center gap-2.5 animate-rise" role="alert">
          <CircleAlert className="size-4 shrink-0" />
          {error}
        </div>
      )}
      <div>
        <label className="form-label" htmlFor="email">
          Email
        </label>
        <div className="relative">
          <Mail className="pointer-events-none absolute start-3.5 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
          <input
            className="form-input h-11 ps-10"
            id="email"
            name="email"
            type="email"
            autoComplete="username"
            placeholder="ime@webtano.com"
            defaultValue={email}
            key={email}
            required
            autoFocus={!email}
          />
        </div>
      </div>
      <div>
        <label className="form-label" htmlFor="password">
          Lozinka
        </label>
        <div className="relative">
          <Lock className="pointer-events-none absolute start-3.5 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
          <input
            className="form-input h-11 ps-10 pe-11"
            id="password"
            name="password"
            type={shown ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder="••••••••"
            required
            autoFocus={Boolean(email)}
          />
          <button
            type="button"
            onClick={() => setShown((s) => !s)}
            className="absolute end-1.5 top-1/2 grid size-8 -translate-y-1/2 cursor-pointer place-items-center rounded-md text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700"
            aria-label={shown ? 'Sakrij lozinku' : 'Prikaži lozinku'}
            aria-pressed={shown}
          >
            {shown ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
      </div>
      <button className="btn btn-primary group h-11 w-full text-[14px]" type="submit" disabled={pending}>
        {pending ? (
          <>
            <LoaderCircle className="size-4 animate-spin" /> Prijavljivanje…
          </>
        ) : (
          <>
            Prijavi se <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
          </>
        )}
      </button>
    </form>
  );
}
