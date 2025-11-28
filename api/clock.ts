
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
        <svg xmlns="${xmlns}" width="200" height="100">
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
      <svg xmlns="${xmlns}" width="200" height="200">
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
    private makeDigit(bits: number[], st_x: number, st_y: number, cols: number, size: number, gap: number) {
        return bits
            .map((bit, i) => {
                const color = bit === 1 ? "#00ffea" : "#444";
                const x = st_x + (i % cols) * (size * 2 + gap);
                const y = st_y + Math.floor(i / cols) * (size * 2 + gap);
                return `<circle cx="${x}" cy="${y}" r="${size}" fill="${color}" />`;
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
            (n & 1) ? 1 : 0
        ];

        const width = 200;
        const height = 150;
        const size = 10;          // 円の半径
        const gap = 5;            // 円の間隔
        const cols = 2;           // 1桁の横列
        const digitWidth = cols * (size * 2 + gap);
        const gapBetweenDigits = 10; // 桁間スペース
        const yStart = 20;

        return `
            <svg xmlns="${xmlns}" width="${width}" height="${height}">
                <rect width="100%" height="100%" fill="#1f1f1f"/>

                <!-- Hour -->
                ${this.makeDigit(bits(Math.floor(hh / 10)), 10, yStart, cols, size, gap)}
                ${this.makeDigit(bits(hh % 10), 10 + digitWidth + gapBetweenDigits, yStart, cols, size, gap)}

                <!-- Minute -->
                ${this.makeDigit(bits(Math.floor(mm / 10)), 10 + 2 * (digitWidth + gapBetweenDigits), yStart, cols, size, gap)}
                ${this.makeDigit(bits(mm % 10), 10 + 3 * (digitWidth + gapBetweenDigits), yStart, cols, size, gap)}

                <!-- Second -->
                ${this.makeDigit(bits(Math.floor(ss / 10)), 10 + 4 * (digitWidth + gapBetweenDigits), yStart, cols, size, gap)}
                ${this.makeDigit(bits(ss % 10), 10 + 5 * (digitWidth + gapBetweenDigits), yStart, cols, size, gap)}

                ${this.showDate ? `<text x="${width / 2}" y="${height - 10}" font-size="12" fill="#ccc" text-anchor="middle">${this.format_date()}</text>` : ""}
            </svg>
        `;
    }
}