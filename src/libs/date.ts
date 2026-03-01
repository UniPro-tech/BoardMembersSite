export const JST_OFFSET_MINUTES = 9 * 60;

export function formatToDatetimeLocalJST(d: Date) {
  // datetime-local expects local time without timezone: YYYY-MM-DDTHH:mm
  const jst = new Date(d.getTime() + JST_OFFSET_MINUTES * 60 * 1000);
  return jst.toISOString().slice(0, 16);
}

export function formatToLocaleStringJST(d: Date) {
  try {
    return d.toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" });
  } catch (_e) {
    // Fallback: manual offset (Japan has fixed +9h)
    const jst = new Date(d.getTime() + JST_OFFSET_MINUTES * 60 * 1000);
    return jst
      .toISOString()
      .replace("T", " ")
      .replace(/:\d{2}Z$/, "");
  }
}

export function parseDatetimeLocalAsJST(v: string) {
  // parse "YYYY-MM-DDTHH:mm" (value from <input type="datetime-local">)
  if (!v) return new Date(NaN);
  const m = v.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/);
  if (!m) return new Date(v);
  const [, Y, M, D, h, mnt] = m;
  // Construct Date representing that time in JST: subtract 9 hours to get UTC
  const utc = Date.UTC(
    Number(Y),
    Number(M) - 1,
    Number(D),
    Number(h),
    Number(mnt),
    0,
    0,
  );
  const ts = utc - JST_OFFSET_MINUTES * 60 * 1000;
  return new Date(ts);
}

export function nowUTC(): Date {
  return new Date();
}
