import os
import datetime
from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, Text, Boolean, ForeignKey
from sqlalchemy.orm import declarative_base, sessionmaker, relationship
from werkzeug.security import generate_password_hash, check_password_hash

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'
    
    id = Column(Integer, primary_key=True)
    username = Column(String(80), unique=True, nullable=False)
    email = Column(String(120), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(20), default='analyst') # 'admin' or 'analyst'
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    is_active = Column(Boolean, default=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'role': self.role,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M:%S') if self.created_at else None,
            'is_active': self.is_active
        }

class SecurityLog(Base):
    __tablename__ = 'security_logs'

    id = Column(Integer, primary_key=True)
    file_id = Column(String(100), index=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow, index=True)
    ip_address = Column(String(45), index=True)
    username = Column(String(80), default='Unknown')
    event_type = Column(String(100), default='General Access')
    request_path = Column(Text, default='')
    status_code = Column(Integer, default=200)
    raw_log = Column(Text, nullable=False)

    # ML & Threat classification fields
    threat_level = Column(String(20), default='Normal', index=True) # Normal, Low Risk, Medium Risk, High Risk, Critical
    risk_score = Column(Float, default=0.0) # 0.0 to 100.0
    is_anomaly = Column(Boolean, default=False)
    matched_keywords = Column(Text, default='') # Comma separated keywords
    analysis_notes = Column(Text, default='')

    def to_dict(self):
        return {
            'id': self.id,
            'file_id': self.file_id,
            'timestamp': self.timestamp.strftime('%Y-%m-%d %H:%M:%S') if self.timestamp else '',
            'ip_address': self.ip_address,
            'username': self.username,
            'event_type': self.event_type,
            'request_path': self.request_path,
            'status_code': self.status_code,
            'raw_log': self.raw_log,
            'threat_level': self.threat_level,
            'risk_score': round(self.risk_score, 1),
            'is_anomaly': self.is_anomaly,
            'matched_keywords': [k.strip() for k in self.matched_keywords.split(',') if k.strip()] if self.matched_keywords else [],
            'analysis_notes': self.analysis_notes
        }

class Alert(Base):
    __tablename__ = 'alerts'

    id = Column(Integer, primary_key=True)
    log_id = Column(Integer, ForeignKey('security_logs.id'), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    severity = Column(String(20), nullable=False) # Safe, Warning, High Risk, Critical
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    source_ip = Column(String(45), default='N/A')
    is_resolved = Column(Boolean, default=False)

    def to_dict(self):
        return {
            'id': self.id,
            'log_id': self.log_id,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M:%S') if self.created_at else '',
            'severity': self.severity,
            'title': self.title,
            'description': self.description,
            'source_ip': self.source_ip,
            'is_resolved': self.is_resolved
        }

class SystemSetting(Base):
    __tablename__ = 'system_settings'

    id = Column(Integer, primary_key=True)
    key = Column(String(80), unique=True, nullable=False)
    value = Column(Text, nullable=False)
    description = Column(String(255), default='')

def get_db_uri(custom_mysql_uri=None):
    if custom_mysql_uri:
        return custom_mysql_uri
    db_path = os.path.abspath(os.path.join(os.path.dirname(__file__), 'security_analyzer.db'))
    return f"sqlite:///{db_path}"

def init_db(database_uri=None):
    uri = get_db_uri(database_uri)
    engine = create_engine(uri, echo=False)
    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine)
    session = Session()

    # Pre-seed default Admin user if not exists
    admin = session.query(User).filter_by(username='admin').first()
    if not admin:
        admin = User(username='admin', email='admin@cybersecurity.local', role='admin')
        admin.set_password('admin123')
        session.add(admin)

    # Pre-seed default Analyst user
    analyst = session.query(User).filter_by(username='analyst').first()
    if not analyst:
        analyst = User(username='analyst', email='analyst@cybersecurity.local', role='analyst')
        analyst.set_password('analyst123')
        session.add(analyst)

    # Default settings
    default_settings = [
        ('sensitivity_threshold', '0.75', 'Anomaly Detection Sensitivity (0.1 to 1.0)'),
        ('email_alerts_enabled', 'true', 'Send automated email notifications for Critical threats'),
        ('alert_email_recipient', 'secops@cybersecurity.local', 'Recipient email for critical alerts'),
        ('auto_refresh_seconds', '10', 'Dashboard auto-refresh interval in seconds'),
        ('database_type', 'SQLite (MySQL Ready)', 'Current active database engine')
    ]

    for key, val, desc in default_settings:
        setting = session.query(SystemSetting).filter_by(key=key).first()
        if not setting:
            session.add(SystemSetting(key=key, value=val, description=desc))

    session.commit()
    session.close()

def get_session(database_uri=None):
    uri = get_db_uri(database_uri)
    engine = create_engine(uri, echo=False)
    Session = sessionmaker(bind=engine)
    return Session()
