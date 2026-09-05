import os
import io
import datetime
import zipfile
import jwt
from functools import wraps
from flask import Flask, render_template, request, jsonify, send_file, make_response
from flask_cors import CORS

from database import init_db, get_session, User, SecurityLog, Alert, SystemSetting
from log_parser import parse_log_content
from ml_engine import SecurityMLEngine, generate_ai_recommendations
from sample_logs import generate_sample_log_data
from report_generator import generate_pdf_report, generate_excel_report, generate_csv_report, create_bundle_zip

app = Flask(__name__, static_folder='static', template_folder='templates')
CORS(app)

app.config['SECRET_KEY'] = 'cyber_security_ai_secret_key_2026_super_secure'
app.config['UPLOAD_FOLDER'] = os.path.join(os.path.dirname(__file__), 'uploads')
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Initialize database
init_db()

ml_engine = SecurityMLEngine()

# JWT Helper Functions
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        auth_header = request.headers.get('Authorization')
        if auth_header:
            if auth_header.startswith('Bearer '):
                token = auth_header.split(' ')[1]
            else:
                token = auth_header
        if not token:
            return jsonify({'message': 'Authentication token is missing'}), 401
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            session = get_session()
            current_user = session.query(User).filter_by(id=data['user_id']).first()
            session.close()
            if not current_user:
                return jsonify({'message': 'User no longer exists'}), 401
        except Exception as e:
            return jsonify({'message': 'Invalid or expired token'}), 401
        return f(current_user, *args, **kwargs)
    return decorated

def admin_required(f):
    @wraps(f)
    def decorated(current_user, *args, **kwargs):
        if current_user.role != 'admin':
            return jsonify({'message': 'Admin privilege required'}), 403
        return f(current_user, *args, **kwargs)
    return decorated

# Page Route
@app.route('/')
def index():
    return render_template('index.html')

# API Endpoints
@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'message': 'Username and password required'}), 400

    session = get_session()
    user = session.query(User).filter_by(username=username).first()

    if user and user.check_password(password):
        token = jwt.encode({
            'user_id': user.id,
            'role': user.role,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }, app.config['SECRET_KEY'], algorithm='HS256')
        
        user_dict = user.to_dict()
        session.close()
        return jsonify({
            'token': token,
            'user': user_dict,
            'message': 'Login successful'
        }), 200

    session.close()
    return jsonify({'message': 'Invalid credentials'}), 401

@app.route('/api/auth/me', methods=['GET'])
@token_required
def get_current_user(current_user):
    return jsonify({'user': current_user.to_dict()})

@app.route('/api/dashboard/stats', methods=['GET'])
def get_dashboard_stats():
    session = get_session()
    logs = session.query(SecurityLog).all()

    total = len(logs)
    critical = sum(1 for l in logs if l.threat_level == 'Critical')
    high = sum(1 for l in logs if l.threat_level == 'High Risk')
    medium = sum(1 for l in logs if l.threat_level == 'Medium Risk')
    low = sum(1 for l in logs if l.threat_level == 'Low Risk')
    normal = sum(1 for l in logs if l.threat_level == 'Normal')
    suspicious = critical + high + medium + low
    anomalies = sum(1 for l in logs if l.is_anomaly)

    threat_percentage = (suspicious / total * 100.0) if total > 0 else 0.0

    # Recent Alerts
    alerts = session.query(Alert).order_by(Alert.created_at.desc()).limit(10).all()
    alert_list = [a.to_dict() for a in alerts]

    # Threat Distribution for Pie Chart
    threat_distribution = {
        'Normal': normal,
        'Low Risk': low,
        'Medium Risk': medium,
        'High Risk': high,
        'Critical': critical
    }

    # Top Attacking IPs
    ip_counter = {}
    for l in logs:
        if l.threat_level in ('Critical', 'High Risk', 'Medium Risk', 'Low Risk'):
            ip_counter[l.ip_address] = ip_counter.get(l.ip_address, 0) + 1

    top_ips = [{'ip': ip, 'count': cnt} for ip, cnt in sorted(ip_counter.items(), key=lambda x: x[1], reverse=True)[:5]]

    # Event Frequency
    event_counter = {}
    for l in logs:
        event_counter[l.event_type] = event_counter.get(l.event_type, 0) + 1

    # Daily Attacks Trend (last 7 days simulation / aggregation)
    daily_trends = {}
    for l in logs:
        date_str = l.timestamp.strftime('%Y-%m-%d') if l.timestamp else 'Today'
        daily_trends[date_str] = daily_trends.get(date_str, 0) + (1 if l.threat_level != 'Normal' else 0)

    sorted_dates = sorted(daily_trends.keys())[-7:]
    daily_attacks = [{'date': d, 'attacks': daily_trends[d]} for d in sorted_dates]

    session.close()

    return jsonify({
        'total_logs': total,
        'suspicious_logs': suspicious,
        'critical_threats': critical,
        'high_risk': high,
        'medium_risk': medium,
        'low_risk': low,
        'normal_logs': normal,
        'anomalies_count': anomalies,
        'threat_percentage': round(threat_percentage, 1),
        'recent_alerts': alert_list,
        'threat_distribution': threat_distribution,
        'top_attacking_ips': top_ips,
        'event_frequency': event_counter,
        'daily_attacks': daily_attacks
    })

@app.route('/api/logs/upload', methods=['POST'])
def upload_logs():
    if 'file' not in request.files:
        return jsonify({'message': 'No file part in request'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'message': 'No file selected'}), 400

    filename = file.filename
    content = file.read().decode('utf-8', errors='ignore')

    # Parse log records
    parsed = parse_log_content(content, filename)
    if not parsed:
        return jsonify({'message': 'Unable to parse log file format or file is empty'}), 400

    # Get sensitivity setting
    session = get_session()
    setting = session.query(SystemSetting).filter_by(key='sensitivity_threshold').first()
    sensitivity = float(setting.value) if setting else 0.75

    # Run AI Threat Detection & Machine Learning Anomaly Analysis
    analyzed = ml_engine.analyze_logs(parsed, sensitivity=sensitivity)

    file_id = f"file_{datetime.datetime.now().strftime('%Y%m%d%H%M%S')}"

    new_logs = []
    new_alerts = []

    for item in analyzed:
        log_obj = SecurityLog(
            file_id=file_id,
            timestamp=item['timestamp'],
            ip_address=item['ip_address'],
            username=item['username'],
            event_type=item['event_type'],
            request_path=item['request_path'],
            status_code=item['status_code'],
            raw_log=item['raw_log'],
            threat_level=item['threat_level'],
            risk_score=item['risk_score'],
            is_anomaly=item['is_anomaly'],
            matched_keywords=item['matched_keywords'],
            analysis_notes=item['analysis_notes']
        )
        session.add(log_obj)
        session.flush() # Populate log_obj.id

        # Generate Real-time Alerts for Threats
        if item['threat_level'] in ('Critical', 'High Risk', 'Medium Risk'):
            severity_map = {
                'Critical': 'Red',
                'High Risk': 'Orange',
                'Medium Risk': 'Yellow',
                'Low Risk': 'Green'
            }
            alert_obj = Alert(
                log_id=log_obj.id,
                severity=severity_map.get(item['threat_level'], 'Yellow'),
                title=f"[{item['threat_level']}] {item['event_type']}",
                description=f"IP {item['ip_address']} triggered {item['matched_keywords'] or 'anomalous behavior'}. Risk Score: {item['risk_score']:.1f}",
                source_ip=item['ip_address']
            )
            session.add(alert_obj)

    session.commit()
    log_dicts = [l.to_dict() for l in session.query(SecurityLog).filter_by(file_id=file_id).all()]
    session.close()

    return jsonify({
        'message': f"Successfully parsed and analyzed {len(analyzed)} logs using AI.",
        'file_id': file_id,
        'count': len(analyzed),
        'logs': log_dicts
    })

@app.route('/api/logs/sample', methods=['POST'])
def generate_sample():
    log_format = request.args.get('type', 'log')
    sample_text = generate_sample_log_data(log_format)
    
    parsed = parse_log_content(sample_text, f"sample.{log_format}")
    session = get_session()
    setting = session.query(SystemSetting).filter_by(key='sensitivity_threshold').first()
    sensitivity = float(setting.value) if setting else 0.75

    analyzed = ml_engine.analyze_logs(parsed, sensitivity=sensitivity)
    file_id = f"sample_{datetime.datetime.now().strftime('%Y%m%d%H%M%S')}"

    for item in analyzed:
        log_obj = SecurityLog(
            file_id=file_id,
            timestamp=item['timestamp'],
            ip_address=item['ip_address'],
            username=item['username'],
            event_type=item['event_type'],
            request_path=item['request_path'],
            status_code=item['status_code'],
            raw_log=item['raw_log'],
            threat_level=item['threat_level'],
            risk_score=item['risk_score'],
            is_anomaly=item['is_anomaly'],
            matched_keywords=item['matched_keywords'],
            analysis_notes=item['analysis_notes']
        )
        session.add(log_obj)
        session.flush()

        if item['threat_level'] in ('Critical', 'High Risk', 'Medium Risk'):
            severity_map = {'Critical': 'Red', 'High Risk': 'Orange', 'Medium Risk': 'Yellow'}
            session.add(Alert(
                log_id=log_obj.id,
                severity=severity_map.get(item['threat_level'], 'Yellow'),
                title=f"[{item['threat_level']}] {item['event_type']}",
                description=f"IP {item['ip_address']} triggered {item['matched_keywords'] or 'anomalous behavior'}. Risk Score: {item['risk_score']:.1f}",
                source_ip=item['ip_address']
            ))

    session.commit()
    log_dicts = [l.to_dict() for l in session.query(SecurityLog).filter_by(file_id=file_id).all()]
    session.close()

    return jsonify({
        'message': f"Generated and analyzed sample {log_format.upper()} logs.",
        'file_id': file_id,
        'logs': log_dicts
    })

@app.route('/api/logs', methods=['GET'])
def get_logs():
    session = get_session()
    query = session.query(SecurityLog)

    # Search & Filters
    ip = request.args.get('ip')
    username = request.args.get('username')
    threat_level = request.args.get('threat_level')
    event_type = request.args.get('event_type')
    keyword = request.args.get('search')

    if ip:
        query = query.filter(SecurityLog.ip_address.like(f"%{ip}%"))
    if username:
        query = query.filter(SecurityLog.username.like(f"%{username}%"))
    if threat_level and threat_level != 'All':
        query = query.filter(SecurityLog.threat_level == threat_level)
    if event_type and event_type != 'All':
        query = query.filter(SecurityLog.event_type.like(f"%{event_type}%"))
    if keyword:
        query = query.filter(
            (SecurityLog.raw_log.like(f"%{keyword}%")) |
            (SecurityLog.matched_keywords.like(f"%{keyword}%")) |
            (SecurityLog.ip_address.like(f"%{keyword}%"))
        )

    logs = query.order_by(SecurityLog.timestamp.desc()).limit(300).all()
    log_list = [l.to_dict() for l in logs]
    session.close()
    return jsonify({'logs': log_list, 'count': len(log_list)})

@app.route('/api/alerts', methods=['GET'])
def get_alerts():
    session = get_session()
    alerts = session.query(Alert).order_by(Alert.created_at.desc()).all()
    alert_list = [a.to_dict() for a in alerts]
    session.close()
    return jsonify({'alerts': alert_list})

@app.route('/api/alerts/<int:alert_id>/resolve', methods=['POST'])
def resolve_alert(alert_id):
    session = get_session()
    alert = session.query(Alert).filter_by(id=alert_id).first()
    if alert:
        alert.is_resolved = True
        session.commit()
        session.close()
        return jsonify({'message': 'Alert resolved'})
    session.close()
    return jsonify({'message': 'Alert not found'}), 404

@app.route('/api/recommendations', methods=['GET'])
def get_recommendations():
    session = get_session()
    logs = session.query(SecurityLog).all()

    critical = sum(1 for l in logs if l.threat_level == 'Critical')
    high = sum(1 for l in logs if l.threat_level == 'High Risk')
    medium = sum(1 for l in logs if l.threat_level == 'Medium Risk')
    
    # Extract keywords dict
    kw_dict = {}
    ip_counter = {}
    for l in logs:
        if l.matched_keywords:
            for k in l.matched_keywords.split(','):
                k_clean = k.strip()
                if k_clean:
                    kw_dict[k_clean] = kw_dict.get(k_clean, 0) + 1
        if l.threat_level != 'Normal':
            ip_counter[l.ip_address] = ip_counter.get(l.ip_address, 0) + 1

    top_ips = [{'ip': ip, 'count': cnt} for ip, cnt in sorted(ip_counter.items(), key=lambda x: x[1], reverse=True)[:5]]

    summary = {
        'critical': critical,
        'high': high,
        'medium': medium,
        'top_ips': top_ips,
        'keywords': kw_dict
    }

    recs = generate_ai_recommendations(summary)
    session.close()
    return jsonify({'recommendations': recs})

# Report Downloads (PDF, Excel, CSV, and ZIP Archive)
@app.route('/api/reports/download/<fmt>', methods=['GET'])
def download_report(fmt):
    session = get_session()
    logs = session.query(SecurityLog).order_by(SecurityLog.timestamp.desc()).all()
    log_dicts = [l.to_dict() for l in logs]

    total = len(log_dicts)
    critical = sum(1 for l in log_dicts if l['threat_level'] == 'Critical')
    high = sum(1 for l in log_dicts if l['threat_level'] == 'High Risk')
    medium = sum(1 for l in log_dicts if l['threat_level'] == 'Medium Risk')
    low = sum(1 for l in log_dicts if l['threat_level'] == 'Low Risk')
    normal = sum(1 for l in log_dicts if l['threat_level'] == 'Normal')
    anomalies = sum(1 for l in log_dicts if l['is_anomaly'])
    threat_perc = (sum(1 for l in log_dicts if l['threat_level'] != 'Normal') / total * 100.0) if total > 0 else 0.0

    summary = {
        'total': total,
        'critical': critical,
        'high': high,
        'medium': medium,
        'low': low,
        'normal': normal,
        'anomalies': anomalies,
        'threat_percentage': threat_perc,
        'recommendations': generate_ai_recommendations({'critical': critical, 'high': high, 'medium': medium})
    }
    session.close()

    timestamp_str = datetime.datetime.now().strftime('%Y%m%d_%H%M%S')

    if fmt == 'pdf':
        pdf_data = generate_pdf_report(log_dicts, summary)
        return send_file(
            io.BytesIO(pdf_data),
            mimetype='application/pdf',
            as_attachment=True,
            download_name=f"Security_Audit_Report_{timestamp_str}.pdf"
        )
    elif fmt in ('excel', 'xlsx'):
        excel_data = generate_excel_report(log_dicts, summary)
        return send_file(
            io.BytesIO(excel_data),
            mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            as_attachment=True,
            download_name=f"Security_Log_Analysis_{timestamp_str}.xlsx"
        )
    elif fmt == 'csv':
        csv_data = generate_csv_report(log_dicts)
        return send_file(
            io.BytesIO(csv_data.encode('utf-8')),
            mimetype='text/csv',
            as_attachment=True,
            download_name=f"Security_Logs_Export_{timestamp_str}.csv"
        )
    elif fmt == 'zip':
        # Combined download of all report files in a single zip file
        raw_logs_combined = "\n".join([l['raw_log'] for l in log_dicts]) if log_dicts else "No logs analyzed yet."
        zip_bytes = create_bundle_zip(log_dicts, summary, raw_logs_text=raw_logs_combined)
        return send_file(
            io.BytesIO(zip_bytes),
            mimetype='application/zip',
            as_attachment=True,
            download_name=f"All_Security_Reports_Bundle_{timestamp_str}.zip"
        )

    return jsonify({'message': 'Invalid format. Use pdf, excel, csv, or zip'}), 400

# Download Entire Project Codebase as ZIP
@app.route('/api/project/zip', methods=['GET'])
def download_project_zip():
    project_dir = os.path.dirname(__file__)
    zip_buffer = io.BytesIO()

    with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
        for root, dirs, files in os.walk(project_dir):
            if '.git' in root or '__pycache__' in root or '.venv' in root:
                continue
            for file in files:
                if file.endswith('.pyc') or file == 'security_analyzer.db':
                    continue
                file_path = os.path.join(root, file)
                arcname = os.path.relpath(file_path, project_dir)
                zip_file.write(file_path, arcname)

    zip_buffer.seek(0)
    return send_file(
        zip_buffer,
        mimetype='application/zip',
        as_attachment=True,
        download_name='AI_Security_Log_Analyzer_Project.zip'
    )

# Settings Management
@app.route('/api/settings', methods=['GET', 'POST'])
def manage_settings():
    session = get_session()
    if request.method == 'POST':
        data = request.get_json() or {}
        for k, v in data.items():
            setting = session.query(SystemSetting).filter_by(key=k).first()
            if setting:
                setting.value = str(v)
            else:
                session.add(SystemSetting(key=k, value=str(v)))
        session.commit()

    settings = session.query(SystemSetting).all()
    res = {s.key: s.value for s in settings}
    session.close()
    return jsonify(res)

# User Management (Admin Only)
@app.route('/api/users', methods=['GET', 'POST'])
@token_required
@admin_required
def manage_users(current_user):
    session = get_session()
    if request.method == 'POST':
        data = request.get_json() or {}
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        role = data.get('role', 'analyst')

        if not username or not email or not password:
            session.close()
            return jsonify({'message': 'Username, email, and password required'}), 400

        existing = session.query(User).filter((User.username == username) | (User.email == email)).first()
        if existing:
            session.close()
            return jsonify({'message': 'Username or email already exists'}), 400

        new_user = User(username=username, email=email, role=role)
        new_user.set_password(password)
        session.add(new_user)
        session.commit()
        session.close()
        return jsonify({'message': f"User '{username}' created successfully"}), 201

    users = session.query(User).all()
    user_list = [u.to_dict() for u in users]
    session.close()
    return jsonify({'users': user_list})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print(f"Starting AI-Based Security Log Analyzer Server on http://127.0.0.1:{port} ...")
    app.run(host='0.0.0.0', port=port, debug=False)

