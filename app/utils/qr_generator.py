import qrcode
from io import BytesIO
import base64

from qrcode.console_scripts import error_correction

def generate_qr_code(ssid, password, security_type):
    wifi_data = f"WIFI:S:{ssid};T:{security_type};P:{password};;"

    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4
    )
    qr.add_data(wifi_data)
    qr.make(fit=True)

    img = qr.make_image(fill='black', color='white')
    buf = BytesIO()
    img.save(buf, format='PNG')
    buf.seek(0)

    return base64.b64encode(buf.getvalue()).decode('utf-8')