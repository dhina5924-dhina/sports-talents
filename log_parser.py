import re
import csv
import io
import datetime

# Common regex patterns for security log formats
APACHE_COMBINED_REGEX = re.compile(
    r'^(?P<ip>\S+)\s+\S+\s+(?P<user>\S+)\s+\[(?P<time>[^\]]+)\]\s+"(?P<method>\S+)\s+(?P<path>\S+)\s+[^"]*"\s+(?P<status>\d+)\s+(?P<size>\S+)(?:\s+"(?P<referer>[^"]*)"\s+"(?P<agent>[^"]*)")?'
)

SYSLOG_REGEX = re.compile(
    r'^(?P<time>[A-Z][a-z]{2}\s+\d+\s+\d{2}:\d{2}:\d{2})\s+(?P<host>\S+)\s+(?P<process>[^:]+):\s+(?P<message>.*)$'
)

IP_REGEX = re.compile(r'\b(?:\d{1,3}\.){3}\d{1,3}\b')
TIMESTAMP_REGEX = re.compile(r'\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}:\d{2}')

def parse_log_line(line):
    line = line.strip()
    if not line:
        return None

    ip_address = '127.0.0.1'
    username = 'Unknown'
    event_type = 'System Event'
    request_path = ''
    status_code = 200
    timestamp = datetime.datetime.now()

    # 1. Try Apache/Nginx combined log regex
    match = APACHE_COMBINED_REGEX.match(line)
    if match:
        data = match.groupdict()
        ip_address = data['ip']
        username = data['user'] if data['user'] != '-' else 'Anonymous'
        request_path = data['path']
        status_code = int(data['status'])
        
        # Determine event type based on HTTP status / path
        if status_code in (401, 403):
            event_type = 'Unauthorized Access Attempt'
        elif status_code == 404:
            event_type = 'Resource Not Found Scan'
        elif status_code >= 500:
            event_type = 'Internal Server Exception'
        else:
            event_type = f"HTTP {data['method']} Request"

        # Try parsing timestamp
        try:
            # format: 10/Oct/2023:13:55:36 +0000
            clean_time = data['time'].split()[0]
            timestamp = datetime.datetime.strptime(clean_time, '%d/%b/%Y:%H:%M:%S')
        except Exception:
            pass

        return {
            'timestamp': timestamp,
            'ip_address': ip_address,
            'username': username,
            'event_type': event_type,
            'request_path': request_path,
            'status_code': status_code,
            'raw_log': line
        }

    # 2. Try extract IP using regex
    ip_match = IP_REGEX.search(line)
    if ip_match:
        ip_address = ip_match.group(0)

    # 3. Try extract timestamp using regex
    ts_match = TIMESTAMP_REGEX.search(line)
    if ts_match:
        try:
            ts_str = ts_match.group(0).replace('T', ' ')
            timestamp = datetime.datetime.strptime(ts_str, '%Y-%m-%d %H:%M:%S')
        except Exception:
            pass

    # 4. Infer event type & username from keywords
    line_lower = line.lower()
    if 'failed password' in line_lower or 'invalid user' in line_lower or 'login failed' in line_lower:
        event_type = 'Failed Authentication'
        user_match = re.search(r'for (?:invalid user )?(\w+)', line)
        if user_match:
            username = user_match.group(1)
    elif 'accepted password' in line_lower or 'login success' in line_lower:
        event_type = 'Successful Authentication'
        user_match = re.search(r'for (\w+)', line)
        if user_match:
            username = user_match.group(1)
    elif 'select' in line_lower or 'union' in line_lower or 'drop' in line_lower or '1=1' in line_lower:
        event_type = 'SQL Injection Vector'
    elif 'ddos' in line_lower or 'flood' in line_lower or 'syn flood' in line_lower:
        event_type = 'DDoS Flood Traffic'
    elif 'sudo' in line_lower or 'root' in line_lower or 'privilege' in line_lower:
        event_type = 'Privilege Escalation Attempt'
    elif 'malware' in line_lower or 'trojan' in line_lower or 'payload' in line_lower or 'eval(' in line_lower:
        event_type = 'Malware Execution'

    return {
        'timestamp': timestamp,
        'ip_address': ip_address,
        'username': username,
        'event_type': event_type,
        'request_path': line[:150],
        'status_code': status_code,
        'raw_log': line
    }

def parse_log_content(file_content, filename='log_file.txt'):
    filename_lower = filename.lower()
    parsed_records = []

    # Handle CSV format
    if filename_lower.endswith('.csv'):
        try:
            csv_file = io.StringIO(file_content)
            reader = csv.DictReader(csv_file)
            for row in reader:
                # Find matching column names
                ip = row.get('ip_address') or row.get('ip') or row.get('IP') or '127.0.0.1'
                user = row.get('username') or row.get('user') or row.get('User') or 'Unknown'
                event = row.get('event_type') or row.get('event') or row.get('Event') or 'Security Event'
                raw = row.get('raw_log') or row.get('log') or row.get('message') or str(row)
                path = row.get('request_path') or row.get('path') or ''
                status = int(row.get('status_code') or row.get('status') or 200)

                ts_str = row.get('timestamp') or row.get('time') or row.get('Date')
                ts = datetime.datetime.now()
                if ts_str:
                    try:
                        ts = datetime.datetime.strptime(ts_str.replace('T', ' ')[:19], '%Y-%m-%d %H:%M:%S')
                    except Exception:
                        pass

                parsed_records.append({
                    'timestamp': ts,
                    'ip_address': ip,
                    'username': user,
                    'event_type': event,
                    'request_path': path,
                    'status_code': status,
                    'raw_log': raw
                })
            if parsed_records:
                return parsed_records
        except Exception:
            pass

    # Handle TXT and LOG plain text files line-by-line
    lines = file_content.splitlines()
    for line in lines:
        parsed = parse_log_line(line)
        if parsed:
            parsed_records.append(parsed)

    return parsed_records
