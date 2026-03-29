export function formatDisplayName(user: { name: string; email?: string | null } | null) {
  if (!user) return '';
  
  if (user.email === 'phamthichuclien2011@gmail.com') {
    return 'Quản trị viên';
  }
  
  const nameParts = user.name.trim().split(' ');
  return nameParts[nameParts.length - 1];
}
