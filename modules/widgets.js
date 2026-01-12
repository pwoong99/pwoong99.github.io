export function initWeather() {
    const weatherEl = document.querySelector('.weather-placeholder');

    // Default to Seoul if geolocation fails
    const defaultLat = 37.5665;
    const defaultLon = 126.9780;

    function fetchWeather(lat, lon) {
        weatherEl.textContent = '날씨 불러오는 중...';

        // Using Open-Meteo API (Free, no key required)
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                const temp = Math.round(data.current_weather.temperature);
                const code = data.current_weather.weathercode;
                const desc = getWeatherDesc(code);

                weatherEl.innerHTML = `
                    <div style="font-size: 1.5rem; font-weight: bold;">${desc} ${getWeatherIcon(code)}</div>
                    <div>기온: ${temp}°C</div>
                `;
            })
            .catch(err => {
                console.error(err);
                weatherEl.textContent = '날씨 정보 획득 실패';
            });
    }

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                fetchWeather(position.coords.latitude, position.coords.longitude);
            },
            (error) => {
                // Permission denied or error, use default
                console.warn("Geolocation denied/error, using Seoul", error);
                fetchWeather(defaultLat, defaultLon);
            }
        );
    } else {
        fetchWeather(defaultLat, defaultLon);
    }
}

function getWeatherDesc(code) {
    // WMO Weather interpretation codes (WW)
    if (code === 0) return '맑음';
    if (code === 1 || code === 2 || code === 3) return '구름 조금';
    if (code === 45 || code === 48) return '안개';
    if (code >= 51 && code <= 55) return '이슬비';
    if (code >= 61 && code <= 65) return '비';
    if (code >= 71 && code <= 77) return '눈';
    if (code >= 80 && code <= 82) return '소나기';
    if (code >= 95) return '뇌우';
    return '흐림';
}

function getWeatherIcon(code) {
    if (code === 0) return '☀️';
    if (code <= 3) return '⛅';
    if (code <= 48) return '🌫️';
    if (code <= 67) return '🌧️';
    if (code <= 77) return '☃️';
    if (code >= 95) return '⚡';
    return '☁️';
}

export function initQuotes() {
    const quotes = [
        "배움에는 끝이 없다.",
        "오늘 걷지 않으면 내일은 뛰어야 한다.",
        "실패는 성공의 어머니이다.",
        "꿈을 꾸는 자만이 꿈을 이룰 수 있다.",
        "천 리 길도 한 걸음부터.",
        "노력은 배신하지 않는다.",
        "가장 큰 영광은 한 번도 실패하지 않음이 아니라, 실패할 때마다 다시 일어서는 데 있다.",
        "중요한 것은 꺾이지 않는 마음.",
        "너의 미래는 지금 네가 무엇을 하고 있는가에 달려 있다.",
        "작은 변화가 일어날 때 진정한 삶을 살게 된다."
    ];

    const quoteEl = document.getElementById('daily-quote');

    function setRandomQuote() {
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        quoteEl.textContent = `"${randomQuote}"`;
        quoteEl.style.transition = 'opacity 0.3s';
        quoteEl.style.opacity = 0;
        setTimeout(() => quoteEl.style.opacity = 1, 100);
    }

    setRandomQuote();

    const quoteWidget = quoteEl.closest('.widget');
    if (quoteWidget) {
        quoteWidget.style.cursor = 'pointer';
        quoteWidget.addEventListener('click', setRandomQuote);
        quoteWidget.title = "클릭하여 명언 변경";
    }
}


