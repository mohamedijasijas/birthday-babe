export const surpriseRelease = {
  enabled: true,
  // Sri Lanka midnight: October 17, 2026. Keep the +05:30 timezone.
  opensAt: '2026-10-17T00:00:00+05:30',
  dateLabel: 'October 17 · 12:00 midnight',
};

export function releaseStatus(config, now = Date.now()) {
  if (!config.enabled) return { unlocked: true, valid: true, remaining: 0 };
  const hasTimezone = typeof config.opensAt === 'string' && /(?:Z|[+-]\d{2}:\d{2})$/.test(config.opensAt);
  const target = hasTimezone ? Date.parse(config.opensAt) : NaN;
  if (!Number.isFinite(target) || !Number.isFinite(now)) return { unlocked: false, valid: false, remaining: 0 };
  const remaining = Math.max(0, target - now);
  return { unlocked: remaining === 0, valid: true, remaining };
}

export function countdownParts(remaining) {
  let seconds = Math.max(0, Math.ceil(remaining / 1000));
  const days = Math.floor(seconds / 86400); seconds %= 86400;
  const hours = Math.floor(seconds / 3600); seconds %= 3600;
  const minutes = Math.floor(seconds / 60); seconds %= 60;
  return { days, hours, minutes, seconds };
}
