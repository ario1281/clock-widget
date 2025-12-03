import { AnalogClock, BaseClock, BinaryClock, DigitalClock } from "../helpers/clock.js";

export const apiHeaders = new Headers({
  "Content-Type": "image/svg+xml",
  "Cache-Control": "no-cache, no-store",
});

export async function ApiHandler(query) {
  try {
    const { style = "analog", date = "false", smooth = "false" } = query;

    let clock = new BaseClock(false);
    if (style === "digital") { clock = new DigitalClock(date); }
    if (style === "binary") { clock = new BinaryClock(date); }
    if (style === "analog") { clock = new AnalogClock(date, smooth); }

    const content = clock.render();

    // sucsess
    return new Response(content, {
      status: 200,
      headers: apiHeaders,
    });
    
  } catch (e) {
    // failed
    return new Response(`code:${e.code}/n ${e.message}`, {
      status: e.code,
      headers: ApiHeader,
    });
  }
}
