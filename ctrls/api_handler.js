import { AnalogClock, BaseClock, BinaryClock, DigitalClock } from "../helpers/clock.js";

export const apiHeaders = new Headers({
  "Content-Type": "image/svg+xml",
  "Cache-Control": "Cache-Control", "no-cache",
});

export async function ApiHandler(query) {
  try {
    const { style = "analog", showDate = "false", smooth = "false" } = query;

    let clock = new BaseClock(false);
    if (style === "digital") clock = new DigitalClock(showDate === "true");
    if (style === "binary")  clock = new BinaryClock(showDate === "true");
    if (style === "analog")  clock = new AnalogClock(showDate === "true", smooth === "true");

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
