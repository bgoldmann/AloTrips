import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/**
 * Check if the current user is an admin
 * Returns the user if admin, null otherwise
 */
export async function requireAdmin(): Promise<{ user: any; supabase: any } | null> {
  const supabase = await createClient();
  
  // Get current user
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return null;
  }

  // Check if user has admin role
  // In production, you might have a roles table or check user metadata
  const { data: userData } = await supabase
    .from('users')
    .select('role, tier')
    .eq('id', user.id)
    .single();

  // For now, check if user has admin role or is Platinum tier (temporary admin check)
  // TODO: Implement proper role-based access control
  if (userData?.role === 'admin' || userData?.tier === 'Platinum') {
    return { user, supabase };
  }

  return null;
}

/**
 * Middleware helper to check admin access
 * Returns NextResponse with error if not admin, null if authorized
 */
export async function checkAdminAccess(): Promise<NextResponse | null> {
  const admin = await requireAdmin();
  
  if (!admin) {
    return NextResponse.json(
      { error: 'Unauthorized: Admin access required' },
      { status: 403 }
    );
  }
  
  return null;
}

