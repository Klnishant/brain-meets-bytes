export async function getAuth() {
  const { token, userId } = await fetch('/api/auth/getAuth').then(res => res.json());

  if (!token || !userId) return null;

  return { token, userId };
}