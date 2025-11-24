export default async function handler(req, res) {
  // Feature disabled
  return res.status(404).json({ error: 'AI features are disabled' });
}