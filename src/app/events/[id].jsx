import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

// Specific event page
export default function Event() {
  const router = useRouter();
  const { id } = router.query;

  return <h1>He110 {id}</h1>;
}