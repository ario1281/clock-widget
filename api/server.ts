
import { VercelRequest, VercelResponse } from '@vercel/node';
import { BaseClock, DigitalClock, AnalogClock, BinaryClock } from './clock';

export default function handler(req: VercelRequest, res: VercelResponse) {
    const type = (req.query.type as string) || "analog";
    const showDate = req.query.date === "true";
    const smooth = req.query.smooth === "true";

    let clock = new BaseClock(false);
    if (type === "digital") {
        clock = new DigitalClock(showDate);
    }
    if (type === "binary") {
        clock = new BinaryClock(showDate);
    }
    if (type === "analog") {
        clock = new AnalogClock(showDate, smooth);
    }

    const svg = clock.render();

    res.setHeader("Content-Type", "image/svg+xml");
    res.setHeader("Cache-Control", "no-cache");
    res.status(200).send(svg);
}