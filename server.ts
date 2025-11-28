import { ApiHandler } from "./api/handler.ts";

export default function handler(req: Request) {

    const { pathname, searchParams } = new URL(req.url);

    if (pathname === "/api") {
        return ApiHandler(searchParams);
    }

    return new Response("404 Not Found", {
        status: 404,
        statusText: "Not Found",
    });
}

Deno.serve(async (req: Request) => {
    return handler(req);
});