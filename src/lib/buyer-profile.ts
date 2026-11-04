export function profileIsComplete(profile: { full_name: string; phone: string; contact_preference: string; buyer_profile_completed: boolean } | null) {
  return Boolean(profile?.buyer_profile_completed && profile.full_name.trim() && profile.phone.trim() && ['email', 'phone'].includes(profile.contact_preference));
}