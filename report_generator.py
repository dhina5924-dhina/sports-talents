import os
import io
import csv
import zipfile
import datetime
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

def generate_pdf_report(logs, summary, filename=None):
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer if not filename else filename,
        pagesize=letter,
        rightMargin=36, leftMargin=36, topMargin=36, bottomMargin=36
    )

    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=22,
        textColor=colors.HexColor('#0F172A'),
        spaceAfter=10
    )
    subtitle_style = ParagraphStyle(
        'DocSubTitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        textColor=colors.HexColor('#64748B'),
        spaceAfter=20
    )
    heading_style = ParagraphStyle(
        'Heading2',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=14,
        textColor=colors.HexColor('#1E293B'),
        spaceBefore=15,
        spaceAfter=10
    )
    normal_style = ParagraphStyle(
        'NormalText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        textColor=colors.HexColor('#334155'),
        leading=12
    )

    elements = []

    # Title & Metadata
    elements.append(Paragraph("AI-BASED SECURITY LOG ANALYSIS AUDIT REPORT", title_style))
    elements.append(Paragraph(f"Generated on: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S UTC')} | Security Operations Center", subtitle_style))
    elements.append(HRFlowable(width="100%", thickness=2, color=colors.HexColor('#3B82F6'), spaceAfter=15))

    # Executive Summary Table
    elements.append(Paragraph("Executive Summary & Risk Metrics", heading_style))
    summary_data = [
        ["Total Analyzed Logs", "Critical Threats", "High Risk Logs", "Medium Risk", "Normal Logs", "Overall Threat %"],
        [
            str(summary.get('total', 0)),
            str(summary.get('critical', 0)),
            str(summary.get('high', 0)),
            str(summary.get('medium', 0)),
            str(summary.get('normal', 0)),
            f"{summary.get('threat_percentage', 0.0):.1f}%"
        ]
    ]

    summary_table = Table(summary_data, colWidths=[90, 85, 85, 85, 85, 95])
    summary_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#1E293B')),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,0), 9),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('BACKGROUND', (0,1), (-1,1), colors.HexColor('#F8FAFC')),
        ('GRID', (0,0), (-1,-1), 1, colors.HexColor('#CBD5E1')),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
    ]))
    elements.append(summary_table)
    elements.append(Spacer(1, 15))

    # AI Recommendations
    recommendations = summary.get('recommendations', [])
    if recommendations:
        elements.append(Paragraph("AI Security Recommendations", heading_style))
        rec_data = [["Severity", "Security Action Item", "Recommended Countermeasure"]]
        for rec in recommendations:
            rec_data.append([
                rec.get('severity', 'Medium'),
                rec.get('title', ''),
                rec.get('action', '')
            ])
        rec_table = Table(rec_data, colWidths=[70, 160, 295])
        rec_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#334155')),
            ('TEXTCOLOR', (0,0), (-1,0), colors.white),
            ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
            ('FONTSIZE', (0,0), (-1,0), 8),
            ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#E2E8F0')),
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
            ('TOPPADDING', (0,0), (-1,-1), 6),
            ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ]))
        elements.append(rec_table)
        elements.append(Spacer(1, 15))

    # Detailed Log Records
    elements.append(Paragraph("Detailed Security Threat Log Breakdown", heading_style))
    log_rows = [["Timestamp", "IP Address", "Event Type", "Level", "Risk Score", "Matched Vector / Notes"]]
    
    # Sort critical / high threats to top
    sorted_logs = sorted(logs, key=lambda x: x.get('risk_score', 0), reverse=True)[:50] # Top 50 in PDF
    for log in sorted_logs:
        ts_val = log.get('timestamp', '')
        ts_str = ts_val.strftime('%Y-%m-%d %H:%M') if hasattr(ts_val, 'strftime') else str(ts_val)[:16]
        log_rows.append([
            ts_str,
            log.get('ip_address', ''),
            log.get('event_type', '')[:22],
            log.get('threat_level', ''),
            f"{log.get('risk_score', 0):.1f}",
            Paragraph(f"{', '.join(log.get('matched_keywords', [])) or log.get('analysis_notes', '')[:40]}", normal_style)
        ])

    log_table = Table(log_rows, colWidths=[75, 75, 95, 60, 50, 170])
    log_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#0F172A')),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,0), 8),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E1')),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
    ]))
    elements.append(log_table)

    doc.build(elements)
    if not filename:
        buffer.seek(0)
        return buffer.getvalue()
    return filename

def generate_excel_report(logs, summary, filename=None):
    wb = Workbook()
    
    # Sheet 1: Executive Summary
    ws_summary = wb.active
    ws_summary.title = "Executive Summary"
    ws_summary.views.sheetView[0].showGridLines = True

    # Styling definitions
    title_font = Font(name="Calibri", size=16, bold=True, color="1E293B")
    header_font = Font(name="Calibri", size=11, bold=True, color="FFFFFF")
    header_fill = PatternFill(start_color="1E293B", end_color="1E293B", fill_type="solid")
    accent_fill = PatternFill(start_color="3B82F6", end_color="3B82F6", fill_type="solid")
    thin_border = Border(
        left=Side(style='thin', color='CBD5E1'),
        right=Side(style='thin', color='CBD5E1'),
        top=Side(style='thin', color='CBD5E1'),
        bottom=Side(style='thin', color='CBD5E1')
    )

    ws_summary.cell(row=1, column=1, value="AI-BASED SECURITY LOG ANALYSIS REPORT").font = title_font
    ws_summary.cell(row=2, column=1, value=f"Generated At: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

    headers = ["Metric", "Value"]
    for col_num, h in enumerate(headers, 1):
        c = ws_summary.cell(row=4, column=col_num, value=h)
        c.font = header_font
        c.fill = header_fill

    summary_rows = [
        ("Total Logs Analyzed", summary.get('total', 0)),
        ("Critical Threat Logs", summary.get('critical', 0)),
        ("High Risk Logs", summary.get('high', 0)),
        ("Medium Risk Logs", summary.get('medium', 0)),
        ("Low Risk Logs", summary.get('low', 0)),
        ("Normal Traffic Logs", summary.get('normal', 0)),
        ("Threat Percentage", f"{summary.get('threat_percentage', 0.0):.1f}%"),
        ("Anomalies Detected", summary.get('anomalies', 0))
    ]

    for row_idx, (k, v) in enumerate(summary_rows, 5):
        c1 = ws_summary.cell(row=row_idx, column=1, value=k)
        c2 = ws_summary.cell(row=row_idx, column=2, value=v)
        c1.border = thin_border
        c2.border = thin_border

    # Sheet 2: Detailed Logs
    ws_logs = wb.create_sheet(title="Security Log Analysis")
    ws_logs.views.sheetView[0].showGridLines = True
    
    log_headers = ["ID", "Timestamp", "IP Address", "Username", "Event Type", "Threat Level", "Risk Score", "Anomaly", "Matched Keywords", "Raw Log Snippet"]
    for col_num, h in enumerate(log_headers, 1):
        c = ws_logs.cell(row=1, column=col_num, value=h)
        c.font = header_font
        c.fill = header_fill

    for r_idx, log in enumerate(logs, 2):
        kw_str = ", ".join(log.get('matched_keywords', [])) if isinstance(log.get('matched_keywords'), list) else str(log.get('matched_keywords', ''))
        ts_val = log.get('timestamp', '')
        ts_str = ts_val.strftime('%Y-%m-%d %H:%M:%S') if hasattr(ts_val, 'strftime') else str(ts_val)
        row_data = [
            log.get('id', r_idx-1),
            ts_str,
            log.get('ip_address', ''),
            log.get('username', ''),
            log.get('event_type', ''),
            log.get('threat_level', ''),
            log.get('risk_score', 0.0),
            "YES" if log.get('is_anomaly') else "NO",
            kw_str,
            str(log.get('raw_log', ''))[:150]
        ]
        for c_idx, val in enumerate(row_data, 1):
            cell = ws_logs.cell(row=r_idx, column=c_idx, value=val)
            cell.border = thin_border

    buffer = io.BytesIO()
    wb.save(buffer if not filename else filename)
    if not filename:
        buffer.seek(0)
        return buffer.getvalue()
    return filename

def generate_csv_report(logs):
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["id", "timestamp", "ip_address", "username", "event_type", "threat_level", "risk_score", "is_anomaly", "matched_keywords", "analysis_notes", "raw_log"])
    for log in logs:
        kw_str = ", ".join(log.get('matched_keywords', [])) if isinstance(log.get('matched_keywords'), list) else str(log.get('matched_keywords', ''))
        ts_val = log.get('timestamp', '')
        ts_str = ts_val.strftime('%Y-%m-%d %H:%M:%S') if hasattr(ts_val, 'strftime') else str(ts_val)
        writer.writerow([
            log.get('id', ''),
            ts_str,
            log.get('ip_address', ''),
            log.get('username', ''),
            log.get('event_type', ''),
            log.get('threat_level', ''),
            log.get('risk_score', 0.0),
            log.get('is_anomaly', False),
            kw_str,
            log.get('analysis_notes', ''),
            log.get('raw_log', '')
        ])
    return output.getvalue()

def create_bundle_zip(logs, summary, raw_logs_text=None):
    """
    Creates a single ZIP archive containing:
    1. Security_Audit_Report.pdf
    2. Security_Log_Analysis.xlsx
    3. Security_Logs_Export.csv
    4. Raw_Log_File.log (if available)
    5. Executive_Summary.txt
    """
    zip_buffer = io.BytesIO()
    timestamp_str = datetime.datetime.now().strftime('%Y%m%d_%H%M%S')

    pdf_bytes = generate_pdf_report(logs, summary)
    excel_bytes = generate_excel_report(logs, summary)
    csv_string = generate_csv_report(logs)

    with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
        # Add PDF Report
        zip_file.writestr(f"Security_Audit_Report_{timestamp_str}.pdf", pdf_bytes)
        # Add Excel Workbook
        zip_file.writestr(f"Security_Log_Analysis_{timestamp_str}.xlsx", excel_bytes)
        # Add CSV Export
        zip_file.writestr(f"Security_Logs_Export_{timestamp_str}.csv", csv_string)
        
        # Add Executive Summary Text File
        exec_summary_txt = f"""==================================================
AI-BASED SECURITY LOG ANALYZER - EXECUTIVE SUMMARY
Generated: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
==================================================

Total Analyzed Logs   : {summary.get('total', 0)}
Critical Threats      : {summary.get('critical', 0)}
High Risk Threat Logs : {summary.get('high', 0)}
Medium Risk Logs      : {summary.get('medium', 0)}
Low Risk Logs         : {summary.get('low', 0)}
Normal Logs           : {summary.get('normal', 0)}
Overall Threat Rate   : {summary.get('threat_percentage', 0.0):.1f}%
Anomalies Detected    : {summary.get('anomalies', 0)}

AI Security Recommendations:
--------------------------------------------------
"""
        for idx, rec in enumerate(summary.get('recommendations', []), 1):
            exec_summary_txt += f"{idx}. [{rec.get('severity')}] {rec.get('title')}\n   Action: {rec.get('action')}\n\n"

        zip_file.writestr(f"Executive_Summary_{timestamp_str}.txt", exec_summary_txt)

        # Add Raw Logs if provided
        if raw_logs_text:
            zip_file.writestr(f"Raw_Security_Logs_{timestamp_str}.log", raw_logs_text)

    zip_buffer.seek(0)
    return zip_buffer.getvalue()
