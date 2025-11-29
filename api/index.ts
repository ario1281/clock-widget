import { VercelRequest, VercelResponse } from "@vercel/node";
import Fastify from "fastify";

import { AnalogClock, BaseClock, BinaryClock, DigitalClock } from "./clock.js";

const fastify = Fastify();

fastify.get("/", async (req, reply) => {
});

fastify.setNotFoundHandler((req, reply) => {
    reply.status(404).send({ message: "Not Found" });
});

export default async function handler(req: VercelRequest, res: VercelResponse) {

    const query = req.query as Record<string, string>;

    const style = query.style || "analog";
    const showDate = query.showDate === "true";
    const smooth = query.smooth === "true";

    let clock = new BaseClock(false);
    if (style === "digital") { clock = new DigitalClock(showDate); }
    if (style === "binary") { clock = new BinaryClock(showDate); }
    if (style === "analog") { clock = new AnalogClock(showDate, smooth); }

    const content = clock.render();

    res.setHeader("Content-Type", "image/svg+xml");
    res.setHeader("Cache-Control", "no-cache");
    res.status(200).send(content);
}