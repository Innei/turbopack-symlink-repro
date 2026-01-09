'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { greeting } from '@repo/shared'

dayjs.extend(utc)

export default function Home() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    console.log('Component mounted', greeting)
  }, [])

  return (
    <div>
      <h1>{greeting}</h1>
      <p>Count: {count}</p>
      <button onClick={() => setCount((c) => c + 1)}>Increment</button>
      <Link href="/about">Go to About</Link>
    </div>
  )
}
