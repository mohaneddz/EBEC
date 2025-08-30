"use client";

import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import supabase from "@/config/supabaseClient";

export default function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (active) {
        setUser(user ?? null);
        setLoading(false);
      }
    };

    fetchUser().catch(() => {
      if (active) setLoading(false);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (active) setUser(session?.user ?? null);
      }
    );

    return () => {
      active = false;
      subscription?.subscription.unsubscribe();
    };
  }, []);

  return { user, loading };
}
