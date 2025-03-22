document.querySelector('form').addEventListener('submit', function (e) {
    e.preventDefault();

    const ssid = document.getElementById('ssid').value;
    const password = document.getElementById('password').value;
    const encryption = document.getElementById('encryption').value;

    if (!ssid) {
        alert("SSID cannot be empty!");
        return;
    }

    fetch('/generate-qr', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            ssid,
            password,
            security_type: encryption
        }),
    })
    .then(response => response.json())
    .then(data => {
        const qrCodeDiv = document.getElementById('qrcode');
        qrCodeDiv.innerHTML = `<img src="data:image/png;base64,${data.qr_code}" alt="QR Code">`;

        const canvas = document.getElementById('qrCanvas');
        const ctx = canvas.getContext('2d');

        canvas.width = 400;
        canvas.height = 550;

        const gradient = ctx.createLinearGradient(0, 0, 400, 550);
        gradient.addColorStop(0, '#ff7eb3');
        gradient.addColorStop(1, '#ff758c');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 400, 550);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.beginPath();
        ctx.moveTo(20, 20);
        ctx.arcTo(380, 20, 380, 530, 20);
        ctx.arcTo(380, 530, 20, 530, 20);
        ctx.arcTo(20, 530, 20, 20, 20);
        ctx.arcTo(20, 20, 380, 20, 20);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 24px "Inter", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`WiFi: ${ssid}`, 200, 60);

        const img = new Image();
        img.src = `data:image/png;base64,${data.qr_code}`;
        img.onload = function () {
            ctx.drawImage(img, 125, 100, 150, 150);

            ctx.fillStyle = '#ffffff';
            ctx.font = '14px "Inter", sans-serif';
            ctx.fillText('1. Buka Google Lens', 200, 280);
            ctx.fillText('2. Arahkan ke QR Code', 200, 310);
            ctx.fillText('3. Klik notifikasi untuk terhubung', 200, 340);

            // Footer
            ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.font = '12px "Inter", sans-serif';
            ctx.fillText('✨ Made by WiFiMate ✨', 200, 520);

            document.getElementById('downloadBtn').style.display = 'block';
        };
    })
    .catch(error => {
        console.error('Error:', error);
        alert("Failed to generate QR code. Please try again!");
    });
});

document.getElementById('downloadBtn').addEventListener('click', function () {
    const canvas = document.getElementById('qrCanvas');
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = 'WiFiMate_Card.png';
    link.click();
});