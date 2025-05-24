'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-cream text-charcoal">
      <h1 className="text-2xl font-header font-bold">Something went wrong!</h1>
      <p className="mt-2 text-dustyPlum">{error.message}</p>
      <button onClick={() => reset()} className="mt-4 px-4 py-2 bg-peachPink text-background rounded">Try again</button>
    </div>
  );
}
