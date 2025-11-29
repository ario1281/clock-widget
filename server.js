import Fastify from "fastify";
import { AnalogClock, BaseClock, BinaryClock, DigitalClock } from "./api/clock.js";

const app = Fastify();

app.get("/api", async (req, reply) => {
    const { style = "analog", showDate = "false", smooth = "false" } = req.query;

    let clock = new BaseClock(false);
    if (style === "digital") clock = new DigitalClock(showDate === "true");
    if (style === "binary")  clock = new BinaryClock(showDate === "true");
    if (style === "analog")  clock = new AnalogClock(showDate === "true", smooth === "true");

    const content = clock.render();

    reply
        .type("image/svg+xml")
        .header("Cache-Control", "no-cache")
        .send(content);
});

app.listen({ port: 3000 }, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log("Local Fastify server running at:", address);
});