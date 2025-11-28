import { CustomURLSearchParams } from "./custom_url_search_params.ts";
import { BaseClock, AnalogClock, DigitalClock, BinaryClock } from "./clock.ts";

export const ApiHeaders = {
    "Content-Type": "image/svg+xml",
    "Cache-Control": "no-cache, no-store, must-revalidate",
    "Pragma": "no-cache",
    "Expires": "0",
};

export function ApiHandler(searchParams: URLSearchParams): Response {

    const params = new CustomURLSearchParams(searchParams);

    const style = params.getString("style", "analog");
    const showDate = params.getBoolean("show_date", false);
    const smooth = params.getBoolean("smooth", false);

    let clock = new BaseClock(false);
    if (style === "digital") {
        clock = new DigitalClock(showDate);
    }
    if (style === "binary") {
        clock = new BinaryClock(showDate);
    }
    if (style === "analog") {
        clock = new AnalogClock(showDate, smooth);
    }

    return new Response(
        clock.render(),
        {
            status: 200,
            headers: ApiHeaders,
        },
    );
}