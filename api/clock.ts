
const xmlns = "http://www.w3.org/2000/svg";
const width = 200;
const height = 100;

// 
export class BaseClock {

    m_time: Date;
    showDate: boolean;

    constructor(showDate: boolean) {
        this.m_time = new Date();
        this.showDate = showDate;
    }

    year() { return this.m_time.getFullYear(); }
    month() { return this.m_time.getMonth() + 1; }
    date() { return this.m_time.getDate(); }

    hours() { return this.m_time.getHours(); }
    minutes() { return this.m_time.getMinutes(); }
    seconds() { return this.m_time.getSeconds(); }
    milliseconds() { return this.m_time.getMilliseconds(); }

    format_date() {
        const yyyy = this.year().toString();
        const mm = this.month().toString().padStart(2, '0');
        const dd = this.date().toString().padStart(2, '0');

        return `${yyyy}年 ${mm}月 ${dd}日`;
    }

    render(): string { return ""; };
}

// 'BaseClock' inherited class
export class DigitalClock extends BaseClock {
    render() {
        const hh = this.m_time.getHours().toString().padStart(2, '0');
        const mm = this.m_time.getMinutes().toString().padStart(2, '0');
        const ss = this.m_time.getSeconds().toString().padStart(2, '0');
        const time = `${hh}:${mm}:${ss}`;

        return `
        <svg xmlns="${xmlns}" width="${width}">
            <rect width="100%" height="100%" fill="#ififif"/>
        <text x="50%" y="50%" font-size="30" fill="#00ffea" text-anchor="middle" dominant-baseline="middle">
          ${time}
        </text>
        ${this.showDate ? `<text x="50%" y="80%" font-size="14" fill="#ccc" text-anchor="middle">${this.format_date()}</text>` : ""}
      </svg>
    `;
    }
}
export class AnalogClock extends BaseClock {
    smooth: boolean;

    constructor(showDate: boolean, smooth: boolean) {
        super(showDate);
        this.smooth = smooth;
    }

    private hand(cx: number, cy: number, angle: number, length: number, width: number, color = "#fff") {
        const radius = (angle - 90) * (Math.PI / 180);
        const x2 = cx + length * Math.cos(radius);
        const y2 = cy + length * Math.sin(radius);
        return `<line x1="${cx}" y1="${cy}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${width}" stroke-linecap="round"/>`;
    }

    render() {
        const hh = this.m_time.getHours();
        const mm = this.m_time.getMinutes();
        const ss = this.m_time.getSeconds();

        const r = 80;
        const cx = 100, cy = 100;

        const secAngle = this.smooth ? (ss * 6) : Math.floor(ss) * 6;
        const minAngle = this.smooth ? (mm * 6 + ss * 0.1) : mm * 6;
        const hourAngle = this.smooth ? (hh % 12 * 30 + mm * 0.5) : (hh % 12 * 30);

        return `
      <svg xmlns="${xmlns}" width="${width}">
        <circle cx="${cx}" cy="${cy}" r="${r}" stroke="#333" stroke-width="4" fill="#1f1f1f"/>

        ${this.hand(cx, cy, hourAngle, r * 0.5, 6)}
        ${this.hand(cx, cy, minAngle, r * 0.7, 4)}
        ${this.hand(cx, cy, secAngle, r * 0.9, 2, "#ff4d4d")}

        ${this.showDate ? `<text x="50%" y="180" fill="#ccc" font-size="14" text-anchor="middle">${this.format_date()}</text>` : ""}
      </svg>
    `;

    }
}
export class BinaryClock extends BaseClock {
    private makeRow(bits: number[], x: number, y: number) {
        return bits
            .map((bit, i) => {
                const color = bit === 1 ? "#00ffea" : "#444";
                return `<circle cx="${x + i * 25}" cy="${y}" r="10" fill="${color}" />`;
            })
            .join("");
    }

    render() {
        const hh = this.m_time.getHours();
        const mm = this.m_time.getMinutes();
        const ss = this.m_time.getSeconds();

        const bits = (n: number) => [
            (n & 8) ? 1 : 0,
            (n & 4) ? 1 : 0,
            (n & 2) ? 1 : 0,
            (n & 1) ? 1 : 0,
        ];

        const y = 50;

        return `
      <svg xmlns="${xmlns}" width="${width}">
        <rect width="100%" height="100%" fill="#1f1f1f"/>

        <!-- Hour -->
        ${this.makeRow(bits(Math.floor(hh / 10)), 10, y)}
        ${this.makeRow(bits(hh % 10), 10 + 4 * 25 + 10, y)}

        <!-- Minute -->
        ${this.makeRow(bits(Math.floor(mm / 10)), 10 + 8 * 25 + 20, y)}
        ${this.makeRow(bits(mm % 10), 10 + 12 * 25 + 20, y)}

        <!-- Second -->
        ${this.makeRow(bits(Math.floor(ss / 10)), 10 + 16 * 25 + 30, y)}
        ${this.makeRow(bits(ss % 10), 10 + 20 * 25 + 30, y)}

        ${this.showDate ? `<text x="100" y="148" font-size="14" fill="#ccc" text-anchor="middle">${this.format_date()}</text>` : ""}
      </svg>
    `;
    }
}