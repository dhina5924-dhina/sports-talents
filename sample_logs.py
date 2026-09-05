import datetime

def generate_sample_log_data(log_type='log'):
    now = datetime.datetime.now()
    
    events = [
        # Normal Traffic
        f'192.168.1.10 - admin [{now.strftime("%d/%b/%Y:%H:%M:%S")} +0000] "GET /dashboard HTTP/1.1" 200 4320 "https://example.com" "Mozilla/5.0"',
        f'192.168.1.15 - analyst [{now.strftime("%d/%b/%Y:%H:%M:%S")} +0000] "GET /api/logs HTTP/1.1" 200 1205 "-" "Chrome/118.0"',
        f'192.168.1.12 - john [{now.strftime("%d/%b/%Y:%H:%M:%S")} +0000] "POST /api/auth/login HTTP/1.1" 200 512 "https://example.com/login" "Mozilla/5.0"',
        
        # SQL Injection Attack Vector
        f'198.51.100.44 - Anonymous [{(now - datetime.timedelta(minutes=5)).strftime("%d/%b/%Y:%H:%M:%S")} +0000] "GET /products?id=1%27%20OR%201=1%20-- HTTP/1.1" 403 890 "-" "Sqlmap/1.6.0"',
        f'198.51.100.44 - Anonymous [{(now - datetime.timedelta(minutes=4)).strftime("%d/%b/%Y:%H:%M:%S")} +0000] "GET /users?q=UNION%20SELECT%20username,password%20FROM%20admin_users HTTP/1.1" 403 910 "-" "Python-requests"',
        
        # Brute Force Authentication Attack
        f'{(now - datetime.timedelta(minutes=10)).strftime("%b %d %H:%M:%S")} auth-server sshd[4412]: Failed password for invalid user root from 203.0.113.88 port 49152 ssh2',
        f'{(now - datetime.timedelta(minutes=9)).strftime("%b %d %H:%M:%S")} auth-server sshd[4415]: Failed password for invalid user admin from 203.0.113.88 port 49154 ssh2',
        f'{(now - datetime.timedelta(minutes=8)).strftime("%b %d %H:%M:%S")} auth-server sshd[4420]: Failed password for invalid user admin from 203.0.113.88 port 49156 ssh2',
        f'{(now - datetime.timedelta(minutes=7)).strftime("%b %d %H:%M:%S")} auth-server sshd[4425]: Multiple login failures for account admin - Brute Force suspected',

        # DDoS Traffic Burst
        f'45.33.32.156 - Anonymous [{(now - datetime.timedelta(minutes=15)).strftime("%d/%b/%Y:%H:%M:%S")} +0000] "GET /api/v1/data HTTP/1.1" 429 204 "-" "Botnet/2.1"',
        f'45.33.32.156 - Anonymous [{(now - datetime.timedelta(minutes=14)).strftime("%d/%b/%Y:%H:%M:%S")} +0000] "GET /api/v1/data HTTP/1.1" 429 204 "-" "Botnet/2.1"',
        f'45.33.32.156 - Anonymous [{(now - datetime.timedelta(minutes=13)).strftime("%d/%b/%Y:%H:%M:%S")} +0000] "DDoS HTTP flood detected rate limit exceeded" 503 1024 "-" "Botnet/2.1"',

        # Malware & Webshell Execution
        f'{(now - datetime.timedelta(minutes=20)).strftime("%b %d %H:%M:%S")} web-node-01 php[8910]: Alert: Malware payload detected in request body eval(base64_decode("c2hlbGxfZXhlYyg..."))',
        f'198.51.100.99 - Anonymous [{(now - datetime.timedelta(minutes=18)).strftime("%d/%b/%Y:%H:%M:%S")} +0000] "POST /uploads/shell.php?cmd=cat%20/etc/passwd HTTP/1.1" 403 340 "-" "curl/7.68.0"',

        # Privilege Escalation Attempt
        f'{(now - datetime.timedelta(minutes=25)).strftime("%b %d %H:%M:%S")} sec-box sudo: guest_user : TTY=pts/0 ; PWD=/tmp ; USER=root ; COMMAND=/bin/bash privilege escalation attempt',

        # More Normal Traffic
        f'10.0.0.45 - sarah [{(now - datetime.timedelta(minutes=2)).strftime("%d/%b/%Y:%H:%M:%S")} +0000] "GET /reports/monthly HTTP/1.1" 200 8420 "https://example.com/reports" "Mozilla/5.0"'
    ]

    if log_type == 'csv':
        csv_header = "timestamp,ip_address,username,event_type,request_path,status_code,raw_log\n"
        rows = [
            f'"{now.strftime("%Y-%m-%d %H:%M:%S")}","192.168.1.10","admin","General Access","/dashboard",200,"192.168.1.10 - GET /dashboard 200"',
            f'"{(now - datetime.timedelta(minutes=5)).strftime("%Y-%m-%d %H:%M:%S")}","198.51.100.44","Anonymous","SQL Injection Vector","/products?id=1 OR 1=1",403,"SQL Injection attempt detected 1=1"',
            f'"{(now - datetime.timedelta(minutes=8)).strftime("%Y-%m-%d %H:%M:%S")}","203.0.113.88","admin","Brute Force","SSH Login",401,"Failed password for invalid user admin Brute Force suspected"',
            f'"{(now - datetime.timedelta(minutes=13)).strftime("%Y-%m-%d %H:%M:%S")}","45.33.32.156","Anonymous","DDoS Flood Traffic","/api/v1/data",429,"DDoS SYN flood rate limit exceeded"',
            f'"{(now - datetime.timedelta(minutes=20)).strftime("%Y-%m-%d %H:%M:%S")}","198.51.100.99","Unknown","Malware Execution","/uploads/shell.php",403,"Malware execution payload eval(base64_decode(...))"'
        ]
        return csv_header + "\n".join(rows)

    return "\n".join(events)
