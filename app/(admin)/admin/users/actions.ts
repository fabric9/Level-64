'use server';

import { redirect } from 'next/navigation';
import { getServerSupabase } from '@/lib/supabase/server';

export async function updateUserAdmin(formData: FormData) {
  const supabase = getServerSupabase();

  const { data: authData } = await supabase.auth.getUser();
  const currentUser = authData.user;

  if (!currentUser) {
    redirect('/login');
  }

  const { data: currentProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', currentUser.id)
    .single();

  if (currentProfile?.role !== 'admin') {
    redirect('/dashboard');
  }

  const userId = String(formData.get('userId') ?? '');
  const role = String(formData.get('role') ?? 'player');
  const status = String(formData.get('status') ?? 'active');

  if (!userId) {
    redirect('/admin/users?error=missing-user');
  }

  if (!['player', 'admin'].includes(role)) {
    redirect('/admin/users?error=invalid-role');
  }

  if (!['active', 'suspended', 'banned'].includes(status)) {
    redirect('/admin/users?error=invalid-status');
  }

  const { error } = await supabase
    .from('profiles')
    .update({ role, status, updated_at: new Date().toISOString() })
    .eq('id', userId);

  if (error) {
    redirect('/admin/users?error=save-failed');
  }

  redirect('/admin/users?saved=1');
}
