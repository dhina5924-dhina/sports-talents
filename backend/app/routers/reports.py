from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import List

from backend.app.database import get_db
from backend.app.models.report import Report
from backend.app.models.user import User
from backend.app.schemas.report import ReportCreate, ReportResponse, ReportUpdateStatus
from backend.app.schemas.user import SimpleUserResponse
from backend.app.auth.dependencies import get_current_user, get_admin_user

router = APIRouter(prefix="/api/reports", tags=["Reports"])

@router.post("", response_model=ReportResponse, status_code=status.HTTP_201_CREATED)
def create_report(
    report_data: ReportCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if report_data.target_type not in ["post", "comment", "user"]:
        raise HTTPException(status_code=400, detail="Invalid target_type. Must be 'post', 'comment', or 'user'")

    new_report = Report(
        reporter_id=current_user.id,
        target_type=report_data.target_type,
        target_id=report_data.target_id,
        reason=report_data.reason.strip(),
        status="pending"
    )
    db.add(new_report)
    db.commit()
    db.refresh(new_report)

    return ReportResponse(
        id=new_report.id,
        reporter_id=new_report.reporter_id,
        reporter=SimpleUserResponse.from_orm(current_user),
        target_type=new_report.target_type,
        target_id=new_report.target_id,
        reason=new_report.reason,
        status=new_report.status,
        created_at=new_report.created_at
    )

@router.get("", response_model=List[ReportResponse])
def get_reports(
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_admin_user)
):
    reports = db.query(Report).order_by(desc(Report.created_at)).all()
    res = []
    for r in reports:
        res.append(ReportResponse(
            id=r.id,
            reporter_id=r.reporter_id,
            reporter=SimpleUserResponse.from_orm(r.reporter),
            target_type=r.target_type,
            target_id=r.target_id,
            reason=r.reason,
            status=r.status,
            created_at=r.created_at
        ))
    return res

@router.put("/{report_id}", response_model=ReportResponse)
def update_report_status(
    report_id: int,
    status_update: ReportUpdateStatus,
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_admin_user)
):
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    if status_update.status not in ["pending", "resolved", "dismissed"]:
        raise HTTPException(status_code=400, detail="Invalid status value")

    report.status = status_update.status
    db.commit()
    db.refresh(report)

    return ReportResponse(
        id=report.id,
        reporter_id=report.reporter_id,
        reporter=SimpleUserResponse.from_orm(report.reporter),
        target_type=report.target_type,
        target_id=report.target_id,
        reason=report.reason,
        status=report.status,
        created_at=report.created_at
    )
