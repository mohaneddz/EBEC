import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET() {
  try {
    const cookieStore = await cookies()

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
        },
      }
    )

    const { data, error } = await supabase
      .from('upcoming')
      .select('*')
      .gte('date', new Date().toISOString())
      .order('date', { ascending: true });

    if (error) {
      console.error("Error fetching events:", error);
      return NextResponse.json({ error: 'Failed to fetch upcoming events' }, { status: 500 })
    }

    const events = data.map((event) => ({
      id: event.id,
      title: event.title || "Coming Soon!",
      date: event.date,
      location: event.location,
      description: event.brief,
      src: event.picture,
      open: event.open,
    }));

    console.log('Fetched upcoming events:', events);

    return NextResponse.json(events)
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
