"use client";

import React, { useEffect, useState } from 'react'
import supabase from '@/config/supabaseClient'

export default function page() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        }

        fetchUser();
    }, []);

  return (
    <div>
        {/* show logged in user information from supabase */}
        {user && (
            <div>
                <p>Logged in as: {user.id}</p>
            </div>
        )}
    </div>
  )
}