// Simple health check for uptime monitors.
export default function handler(req, res) {
  res.status(200).json({ ok: true, service: 'dabur-honey-web', time: new Date().toISOString() });
}
