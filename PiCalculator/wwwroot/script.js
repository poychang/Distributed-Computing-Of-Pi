document.addEventListener('DOMContentLoaded', function () {
    const userConsent = localStorage.getItem('userConsent');

    if (userConsent === 'agreed') {
        startPiCalculation(); // 用戶同意後自動計算
        setInterval(startPiCalculation, 60_000); // 每1分鐘自動再次計算
    } else {
        document.getElementById('consentDialog').style.display = 'block';
    }

    document.getElementById('agreeBtn').addEventListener('click', function () {
        localStorage.setItem('userConsent', 'agreed');
        document.getElementById('consentDialog').style.display = 'none';
        startPiCalculation();
        setInterval(startPiCalculation, 60_000); // 用戶同意後，設置定時器每1分鐘計算一次
    });

    document.getElementById('disagreeBtn').addEventListener('click', function () {
        localStorage.setItem('userConsent', 'disagreed');
        document.getElementById('consentDialog').style.display = 'none';
    });

    // 用戶可以點擊按鈕隨時手動開始計算
    document.getElementById('calculatePiBtn').addEventListener('click', function () {
        startPiCalculation();
    });
});

function showOrHideConsentDialog(show) {
    document.getElementById('consentDialog').style.display = show ? 'block' : 'none';
}

function startPiCalculation() {
    const totalSamples = 10_000_000; // 可根據需要調整樣本數量
    calculatePi(totalSamples);
}

function calculatePi(totalSamples) {
    let insideCircle = 0;

    for (let i = 0; i < totalSamples; i++) {
        const x = Math.random();
        const y = Math.random();
        if (x * x + y * y <= 1) {
            insideCircle++;
        }
    }

    const piEstimate = (insideCircle / totalSamples) * 4;
    console.log(`Pi估計值: ${piEstimate}`);
    sendPiResult(totalSamples, insideCircle);
}

function sendPiResult(totalSamples, insideCircle) {
    //fetch('YOUR_BACKEND_ENDPOINT', {
    fetch('https://localhost:7099/api/calculation', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            TotalSamples: totalSamples,
            InsideCircle: insideCircle
        })
    })
        .then(response => response.json())
        .then(data => console.log('Success:', data))
        .catch((error) => console.error('Error:', error));
}