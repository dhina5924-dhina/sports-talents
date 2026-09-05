import re
import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest
from sklearn.feature_extraction.text import TfidfVectorizer

THREAT_KEYWORDS = {
    'SQL Injection': [r"select\s+.*\s+from", r"union\s+select", r"drop\s+table", r"1=1", r"or\s+1=1", r"exec\(", r"information_schema"],
    'DDoS': [r"syn\s+flood", r"udp\s+flood", r"http\s+flood", r"ddos", r"rate\s+limit\s+exceeded", r"too\s+many\s+requests"],
    'Malware': [r"malware", r"trojan", r"ransomware", r"eval\(", r"base64_decode", r"cmd\.exe", r"/bin/bash", r"shell_exec"],
    'Brute Force': [r"failed\s+password", r"brute\s+force", r"multiple\s+login\s+failures", r"invalid\s+password", r"login\s+attempt\s+failed"],
    'Unauthorized Access': [r"401\s+unauthorized", r"403\s+forbidden", r"unauthorized\s+access", r"access\s+denied", r"token\s+expired"],
    'Privilege Escalation': [r"sudo", r"root\s+access", r"privilege\s+escalation", r"chmod\s+777", r"setuid", r"admin\s+override"],
    'Failed Login': [r"failed\s+login", r"authentication\s+failure", r"bad\s+credentials", r"invalid\s+user"]
}

class SecurityMLEngine:
    def __init__(self, contamination=0.15):
        self.contamination = contamination
        self.iso_forest = IsolationForest(contamination=self.contamination, random_state=42)

    def extract_keywords(self, text):
        text_lower = text.lower()
        matched = []
        for category, patterns in THREAT_KEYWORDS.items():
            for pattern in patterns:
                if re.search(pattern, text_lower):
                    matched.append(category)
                    break
        return matched

    def analyze_logs(self, log_records, sensitivity=0.75):
        if not log_records:
            return []

        df = pd.DataFrame(log_records)
        
        # 1. Feature Engineering for Machine Learning Anomaly Detection
        # IP request frequency
        ip_counts = df['ip_address'].value_counts().to_dict()
        df['ip_freq'] = df['ip_address'].map(ip_counts)

        # Keyword match count
        df['matched_kw_list'] = df['raw_log'].apply(self.extract_keywords)
        df['kw_count'] = df['matched_kw_list'].apply(len)

        # Status code severity feature
        def status_score(code):
            try:
                c = int(code)
                if c in (401, 403): return 3
                if c >= 500: return 2
                if c == 404: return 1
                return 0
            except:
                return 0
        
        df['status_feat'] = df['status_code'].apply(status_score)
        df['log_len'] = df['raw_log'].apply(len)

        # 2. Fit & Predict Anomaly Detection using Isolation Forest
        feature_cols = ['ip_freq', 'kw_count', 'status_feat', 'log_len']
        X = df[feature_cols].fillna(0)

        # If sample size is very small, duplicate rows slightly for ML fit stability
        if len(X) < 5:
            X_fit = pd.concat([X]*5, ignore_index=True)
        else:
            X_fit = X

        try:
            # Adjust contamination based on user sensitivity setting
            contamination_rate = min(max(1.0 - sensitivity, 0.05), 0.40)
            model = IsolationForest(contamination=contamination_rate, random_state=42)
            model.fit(X_fit)
            anomaly_preds = model.predict(X) # -1 for anomaly, 1 for normal
            anomaly_scores = model.decision_function(X) # lower score = more anomalous
        except Exception:
            anomaly_preds = [1] * len(df)
            anomaly_scores = [0.0] * len(df)

        # 3. Classify Threat Level & Calculate Risk Score (0 - 100)
        analyzed_results = []
        for idx, row in df.iterrows():
            keywords = row['matched_kw_list']
            is_anomaly = (anomaly_preds[idx] == -1)
            raw_text = str(row['raw_log']).lower()
            ip_freq = row['ip_freq']

            # Base risk score calculation
            base_score = len(keywords) * 25.0
            if is_anomaly:
                base_score += 25.0
            if ip_freq > 20:
                base_score += 20.0
            elif ip_freq > 10:
                base_score += 10.0

            if row['status_code'] in (401, 403):
                base_score += 15.0

            # Cap risk score between 0 and 100
            risk_score = min(max(base_score, 0.0), 100.0)

            # Assign Threat Severity Level
            if 'Malware' in keywords or 'SQL Injection' in keywords or 'Privilege Escalation' in keywords or risk_score >= 80.0:
                threat_level = 'Critical'
            elif 'DDoS' in keywords or 'Brute Force' in keywords or risk_score >= 60.0:
                threat_level = 'High Risk'
            elif 'Unauthorized Access' in keywords or 'Failed Login' in keywords or is_anomaly or risk_score >= 40.0:
                threat_level = 'Medium Risk'
            elif risk_score >= 20.0 or len(keywords) > 0:
                threat_level = 'Low Risk'
            else:
                threat_level = 'Normal'

            # Generate concise analysis note
            notes = []
            if keywords:
                notes.append(f"Detected threat vectors: {', '.join(keywords)}")
            if is_anomaly:
                notes.append(f"AI Isolation Forest flagged unusual pattern (IP freq: {ip_freq})")
            if not notes:
                notes.append("Normal traffic activity")

            analyzed_results.append({
                'timestamp': row['timestamp'],
                'ip_address': row['ip_address'],
                'username': row['username'],
                'event_type': row['event_type'],
                'request_path': row['request_path'],
                'status_code': row['status_code'],
                'raw_log': row['raw_log'],
                'threat_level': threat_level,
                'risk_score': risk_score,
                'is_anomaly': is_anomaly,
                'matched_keywords': ', '.join(keywords),
                'analysis_notes': ' | '.join(notes)
            })

        return analyzed_results

def generate_ai_recommendations(analysis_summary):
    """Generate smart AI recommendations based on analyzed threat profile"""
    recommendations = []
    
    crit_count = analysis_summary.get('critical', 0)
    high_count = analysis_summary.get('high', 0)
    med_count = analysis_summary.get('medium', 0)
    top_ips = analysis_summary.get('top_ips', [])
    keywords = analysis_summary.get('keywords', {})

    if crit_count > 0 or 'SQL Injection' in keywords:
        recommendations.append({
            'title': 'Mitigate SQL Injection Vulnerabilities',
            'severity': 'Critical',
            'action': 'Enforce parameterized queries (Prepared Statements) across all web applications and activate WAF SQLi filter rules immediately.'
        })

    if 'DDoS' in keywords or any(ip['count'] > 30 for ip in top_ips):
        recommendations.append({
            'title': 'DDoS & Rate Limiting Enforcement',
            'severity': 'High Risk',
            'action': 'Deploy rate limiting at Nginx/Cloudflare ingress layer (max 10 req/sec per IP) and block suspicious origin IPs.'
        })

    if 'Brute Force' in keywords or 'Failed Login' in keywords:
        recommendations.append({
            'title': 'Strengthen Authentication & Account Lockout',
            'severity': 'High Risk',
            'action': 'Enforce Multi-Factor Authentication (MFA) and auto-lock user accounts after 5 consecutive failed login attempts.'
        })

    if 'Privilege Escalation' in keywords or 'Malware' in keywords:
        recommendations.append({
            'title': 'Audit Server Privilege Boundaries',
            'severity': 'Critical',
            'action': 'Isolate affected server instance, revoke suspicious sudo permissions, and run rootkit/malware scanner (e.g. ClamAV / Lynis).'
        })

    if not recommendations:
        recommendations.append({
            'title': 'Continuous Monitoring & Baseline Maintenance',
            'severity': 'Safe',
            'action': 'System logs indicate healthy normal operations. Continue automated real-time log ingestion and weekly ML model retraining.'
        })

    return recommendations
