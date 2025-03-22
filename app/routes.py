from flask import Blueprint, request, jsonify, render_template
from .utils.qr_generator import generate_qr_code

main_routes = Blueprint('main', __name__)

@main_routes.route('/generate-qr', methods=["POST"])
def generate_qr():
    data = request.json
    ssid = data.get('ssid').strip()
    password = data.get('password')
    security_type = data.get('security_type')

    qr_code = generate_qr_code(ssid, password, security_type)

    return jsonify({'qr_code': qr_code})

@main_routes.route('/', methods=["GET"])
def index():
    return render_template('index.html')