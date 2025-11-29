
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

    render() {
        const height = width;

        const fff = this.m_time.getMilliseconds();
        const ss  = this.m_time.getSeconds();
        const mm  = this.m_time.getMinutes();
        const HH  = this.m_time.getHours();

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
    render() {
        const fff = this.m_time.getMilliseconds();
        const ss  = this.m_time.getSeconds();
        const mm  = this.m_time.getMinutes();
        const HH  = this.m_time.getHours();

        return `
            <svg width="320" height="150" viewBox="0 0 320 150" xmlns="http://www.w3.org/2000/svg">
                <rect width="100%" height="100%" fill="#1f1f1f"/>
                <defs>
                    <circle id="dot" r="8" fill="#00ffea"/>
                </defs>

                <!-- 時 十の位 -->
                <g transform="translate(10,10)">
                    <use href="#dot" x="0" y="0"><animate attributeName="fill-opacity" values="1;0" dur="10s" repeatCount="indefinite"/></use>
                    <use href="#dot" x="0" y="20"><animate attributeName="fill-opacity" values="0;1" dur="10s" repeatCount="indefinite" begin="2.5s"/></use>
                    <use href="#dot" x="0" y="40"><animate attributeName="fill-opacity" values="0;1" dur="10s" repeatCount="indefinite" begin="5s"/></use>
                    <use href="#dot" x="0" y="60"><animate attributeName="fill-opacity" values="0;1" dur="10s" repeatCount="indefinite" begin="7.5s"/></use>
                </g>
                <!-- 時 一の位 -->
                <g transform="translate(30,10)">
                    <use href="#dot" x="0" y="0"><animate attributeName="fill-opacity" values="1;0" dur="10s" repeatCount="indefinite"/></use>
                    <use href="#dot" x="0" y="20"><animate attributeName="fill-opacity" values="0;1" dur="10s" repeatCount="indefinite" begin="2.5s"/></use>
                    <use href="#dot" x="0" y="40"><animate attributeName="fill-opacity" values="0;1" dur="10s" repeatCount="indefinite" begin="5s"/></use>
                    <use href="#dot" x="0" y="60"><animate attributeName="fill-opacity" values="0;1" dur="10s" repeatCount="indefinite" begin="7.5s"/></use>
                </g>

                <!-- 分 十の位 -->
                <g transform="translate(60,10)">
                    <use href="#dot" x="0" y="0"><animate attributeName="fill-opacity" values="1;0" dur="10s" repeatCount="indefinite"/></use>
                    <use href="#dot" x="0" y="20"><animate attributeName="fill-opacity" values="0;1" dur="10s" repeatCount="indefinite" begin="2.5s"/></use>
                    <use href="#dot" x="0" y="40"><animate attributeName="fill-opacity" values="0;1" dur="10s" repeatCount="indefinite" begin="5s"/></use>
                    <use href="#dot" x="0" y="60"><animate attributeName="fill-opacity" values="0;1" dur="10s" repeatCount="indefinite" begin="7.5s"/></use>
                </g>
                <!-- 分 一の位 -->
                <g transform="translate(80,10)">
                    <use href="#dot" x="0" y="0"><animate attributeName="fill-opacity" values="1;0" dur="10s" repeatCount="indefinite"/></use>
                    <use href="#dot" x="0" y="20"><animate attributeName="fill-opacity" values="0;1" dur="10s" repeatCount="indefinite" begin="2.5s"/></use>
                    <use href="#dot" x="0" y="40"><animate attributeName="fill-opacity" values="0;1" dur="10s" repeatCount="indefinite" begin="5s"/></use>
                    <use href="#dot" x="0" y="60"><animate attributeName="fill-opacity" values="0;1" dur="10s" repeatCount="indefinite" begin="7.5s"/></use>
                </g>

                <!-- 秒 十の位 -->
                <g transform="translate(110,10)">
                    <use href="#dot" x="0" y="0"><animate attributeName="fill-opacity" values="1;0" dur="10s" repeatCount="indefinite"/></use>
                    <use href="#dot" x="0" y="20"><animate attributeName="fill-opacity" values="0;1" dur="10s" repeatCount="indefinite" begin="2.5s"/></use>
                    <use href="#dot" x="0" y="40"><animate attributeName="fill-opacity" values="0;1" dur="10s" repeatCount="indefinite" begin="5s"/></use>
                    <use href="#dot" x="0" y="60"><animate attributeName="fill-opacity" values="0;1" dur="10s" repeatCount="indefinite" begin="7.5s"/></use>
                </g>
                <!-- 秒 一の位 -->
                <g transform="translate(130,10)">
                    <use href="#dot" x="0" y="0"><animate attributeName="fill-opacity" values="1;0" dur="1s" repeatCount="indefinite"/></use>
                    <use href="#dot" x="0" y="20"><animate attributeName="fill-opacity" values="0;1" dur="1s" repeatCount="indefinite" begin="0.25s"/></use>
                    <use href="#dot" x="0" y="40"><animate attributeName="fill-opacity" values="0;1" dur="1s" repeatCount="indefinite" begin="0.5s"/></use>
                    <use href="#dot" x="0" y="60"><animate attributeName="fill-opacity" values="0;1" dur="1s" repeatCount="indefinite" begin="0.75s"/></use>
                </g>
            </svg>
        `;
    }
}