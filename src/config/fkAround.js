import { redirect } from 'next/navigation';
import { supabase } from '@/config/supabaseClient';

const allowed = ['President', 'Vice President', 'General Secretary'];

// If you're not supposed to be here, then get the hell out
export default async function fkAround() {
    const { data: { user } } = await supabase.auth.getUser();

    if (
        !user ||
        (
            !allowed.includes(user.user_metadata?.role) &&
            !(
                user.user_metadata?.role === 'Manager' &&
                (user.user_metadata?.department === 'IT' || user.user_metadata?.department === 'HR')
            )
        )
    ) {
        redirect('/login');
    }

    return;
}
