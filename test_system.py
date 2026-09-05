import os
import database
import log_parser
import ml_engine
import sample_logs
import report_generator

def test_full_pipeline():
    print("1. Initializing Database...")
    database.init_db()
    print("Database Initialized Successfully!")

    print("\n2. Generating Sample Security Log Data...")
    sample_text = sample_logs.generate_sample_log_data('log')
    print(f"Generated sample text ({len(sample_text)} bytes)")

    print("\n3. Parsing Log Content...")
    parsed = log_parser.parse_log_content(sample_text, 'sample.log')
    print(f"Parsed {len(parsed)} log records")

    print("\n4. Running AI Machine Learning Threat Analysis...")
    engine = ml_engine.SecurityMLEngine()
    analyzed = engine.analyze_logs(parsed)
    print(f"Analyzed {len(analyzed)} logs with Scikit-learn AI model")

    threat_counts = {}
    for item in analyzed:
        level = item['threat_level']
        threat_counts[level] = threat_counts.get(level, 0) + 1
        if level in ('Critical', 'High Risk'):
            print(f"   [{level}] IP: {item['ip_address']} - Vectors: {item['matched_keywords']} - Anomaly: {item['is_anomaly']}")

    print(f"Threat distribution summary: {threat_counts}")

    print("\n5. Testing Report Generation & ZIP Bundle Export...")
    summary = {
        'total': len(analyzed),
        'critical': threat_counts.get('Critical', 0),
        'high': threat_counts.get('High Risk', 0),
        'medium': threat_counts.get('Medium Risk', 0),
        'low': threat_counts.get('Low Risk', 0),
        'normal': threat_counts.get('Normal', 0),
        'threat_percentage': 75.0,
        'anomalies': sum(1 for a in analyzed if a['is_anomaly'])
    }
    
    zip_bytes = report_generator.create_bundle_zip(analyzed, summary, raw_logs_text=sample_text)
    print(f"ZIP Archive Bundle successfully generated ({len(zip_bytes)} bytes)")

    print("\nAll Tests Passed Successfully!")

if __name__ == '__main__':
    test_full_pipeline()
