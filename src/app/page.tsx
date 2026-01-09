'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('Component mounted');
  }, []);

  return (
    <div>
      <h1>Hello World</h1>
      <p>Count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
      <Link href="/about">Go to About</Link>
    </div>
  );
}
