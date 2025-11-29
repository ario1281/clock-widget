
const xmlns = "http://www.w3.org/2000/svg";
const width = 200;

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
        const height = width;

        const r = 80;
        const cx = 100, cy = 100;

        const fff = this.m_time.getMilliseconds();
        const ss = this.m_time.getSeconds();
        const mm = this.m_time.getMinutes();
        const HH = this.m_time.getHours();

        return `
        <svg xmlns="${xmlns}" width="${width}" height="${height}">
            <circle cx="100" cy="100" r="95" fill="#fdfdfd" stroke="#333" stroke-width="4"/>
            <g stroke="#333" stroke-width="3">
                <g id="tick"><line x1="100" y1="10" x2="100" y2="25"/></g>
                <use href="#tick" transform="rotate(30 100 100)" />
                <use href="#tick" transform="rotate(60 100 100)" />
                <use href="#tick" transform="rotate(90 100 100)" />
                <use href="#tick" transform="rotate(120 100 100)" />
                <use href="#tick" transform="rotate(150 100 100)" />
                <use href="#tick" transform="rotate(180 100 100)" />
                <use href="#tick" transform="rotate(210 100 100)" />
                <use href="#tick" transform="rotate(240 100 100)" />
                <use href="#tick" transform="rotate(270 100 100)" />
                <use href="#tick" transform="rotate(300 100 100)" />
                <use href="#tick" transform="rotate(330 100 100)" />
            </g>

            <!-- Hour Hand -->
            <line x1="100" y1="100" x2="100" y2="55"
                    stroke="#000" stroke-width="6" stroke-linecap="round">
                <animateTransform attributeName="transform"
                type="rotate"
                from="${HH} 100 100"
                to="${HH + 360} 100 100"
                dur="43200s"
                repeatCount="indefinite"/>
            </line>

            <!-- Minute Hand -->
            <line x1="100" y1="100" x2="100" y2="35"
                    stroke="#000" stroke-width="4" stroke-linecap="round">
                <animateTransform attributeName="transform"
                type="rotate"
                from="${mm} 100 100"
                to="${mm + 360} 100 100"
                dur="3600s"
                repeatCount="indefinite"/>
            </line>

            <!-- Second Hand -->
            <line x1="100" y1="100" x2="100" y2="25"
                    stroke="red" stroke-width="2" stroke-linecap="round">
                <animateTransform attributeName="transform"
                type="rotate"
                from="${ss} 100 100"
                to="${ss + 360} 100 100"
                dur="60s"
                repeatCount="indefinite"/>
            </line>

            <circle cx="100" cy="100" r="5" fill="#000"/>
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