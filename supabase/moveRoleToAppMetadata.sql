-- Run once in the Supabase SQL editor BEFORE deploying the auth fix.
-- Roles now live in app_metadata (server-only); user_metadata is user-editable.
update auth.users
set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb)
  || jsonb_build_object('role', raw_user_meta_data->>'role')
where raw_user_meta_data ? 'role';

-- Strip the old, user-writable copy so it cannot be trusted by mistake.
update auth.users
set raw_user_meta_data = raw_user_meta_data - 'role'
where raw_user_meta_data ? 'role';
