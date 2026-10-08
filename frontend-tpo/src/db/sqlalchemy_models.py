"""
CampusLink Placement Operations Platform - SQLAlchemy 2.0 Models
Multi-tenant, Object-Level Security (RLS) enabled.
"""

from datetime import datetime, timezone
import uuid
from typing import List, Optional
from sqlalchemy import (
    Column, String, Integer, Numeric, Boolean, DateTime, ForeignKey, 
    Text, Enum as SQLEnum, UniqueConstraint, Index
)
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

def generate_uuid():
    return uuid.uuid4()

class Institution(Base):
    __tablename__ = "institutions"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=generate_uuid)
    code = Column(String(32), unique=True, nullable=False)
    name = Column(String(255), nullable=False)
    type = Column(String(64), nullable=False)
    city = Column(String(128), nullable=False)
    state = Column(String(128), nullable=False)
    established_year = Column(Integer, nullable=False)
    accreditation = Column(String(64), default="NAAC A++")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    campuses = relationship("Campus", back_populates="institution", cascade="all, delete-orphan")
    students = relationship("Student", back_populates="institution", cascade="all, delete-orphan")
    jobs = relationship("Job", back_populates="institution", cascade="all, delete-orphan")
    drives = relationship("PlacementDrive", back_populates="institution", cascade="all, delete-orphan")


class Campus(Base):
    __tablename__ = "campuses"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=generate_uuid)
    institution_id = Column(UUID(as_uuid=True), ForeignKey("institutions.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    code = Column(String(32), nullable=False)
    address = Column(Text)

    institution = relationship("Institution", back_populates="campuses")


class User(Base):
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=generate_uuid)
    email = Column(String(255), unique=True, nullable=False)
    full_name = Column(String(255), nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(64), default="COLLEGE_TPO")
    institution_id = Column(UUID(as_uuid=True), ForeignKey("institutions.id", ondelete="SET NULL"), nullable=True)
    campus_id = Column(UUID(as_uuid=True), ForeignKey("campuses.id", ondelete="SET NULL"), nullable=True)
    phone = Column(String(32))
    status = Column(String(32), default="ACTIVE")
    last_login_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))


class Student(Base):
    __tablename__ = "students"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=generate_uuid)
    institution_id = Column(UUID(as_uuid=True), ForeignKey("institutions.id", ondelete="CASCADE"), nullable=False, index=True)
    campus_id = Column(UUID(as_uuid=True), ForeignKey("campuses.id", ondelete="SET NULL"), nullable=True)
    roll_number = Column(String(64), nullable=False)
    full_name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    phone = Column(String(32))
    gender = Column(String(16))
    department = Column(String(128), nullable=False)
    branch = Column(String(32), nullable=False)
    graduation_year = Column(Integer, nullable=False)
    mentor_id = Column(UUID(as_uuid=True), ForeignKey("mentors.id", ondelete="SET NULL"))
    readiness_level = Column(String(64), default="DEVELOPING")
    placement_status = Column(String(64), default="UNPLACED")
    is_flagged_at_risk = Column(Boolean, default=False)
    risk_score = Column(Numeric(5, 2), default=0.0)
    placement_willingness = Column(Boolean, default=True)
    profile_completion_pct = Column(Integer, default=0)
    resume_verified = Column(Boolean, default=False)

    institution = relationship("Institution", back_populates="students")
    academics = relationship("StudentAcademics", back_populates="student", uselist=False, cascade="all, delete-orphan")
    applications = relationship("Application", back_populates="student", cascade="all, delete-orphan")
    offers = relationship("Offer", back_populates="student", cascade="all, delete-orphan")

    __table_args__ = (
        UniqueConstraint('institution_id', 'roll_number', name='uk_student_roll_inst'),
    )


class StudentAcademics(Base):
    __tablename__ = "student_academics"
    
    student_id = Column(UUID(as_uuid=True), ForeignKey("students.id", ondelete="CASCADE"), primary_key=True)
    cgpa = Column(Numeric(4, 2), nullable=False)
    tenth_percentage = Column(Numeric(5, 2))
    twelfth_percentage = Column(Numeric(5, 2))
    active_backlogs = Column(Integer, default=0)
    history_of_backlogs = Column(Integer, default=0)

    student = relationship("Student", back_populates="academics")


class Company(Base):
    __tablename__ = "companies"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=generate_uuid)
    name = Column(String(255), unique=True, nullable=False)
    industry = Column(String(128), nullable=False)
    tier = Column(String(64), default="TIER_2_DREAM")
    website = Column(String(255))
    status = Column(String(32), default="APPROVED")

    recruiters = relationship("Recruiter", back_populates="company", cascade="all, delete-orphan")
    jobs = relationship("Job", back_populates="company", cascade="all, delete-orphan")


class Recruiter(Base):
    __tablename__ = "recruiters"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=generate_uuid)
    company_id = Column(UUID(as_uuid=True), ForeignKey("companies.id", ondelete="CASCADE"), nullable=False)
    full_name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    phone = Column(String(32))
    designation = Column(String(128))
    status = Column(String(32), default="APPROVED")

    company = relationship("Company", back_populates="recruiters")


class Job(Base):
    __tablename__ = "jobs"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=generate_uuid)
    company_id = Column(UUID(as_uuid=True), ForeignKey("companies.id", ondelete="CASCADE"), nullable=False)
    institution_id = Column(UUID(as_uuid=True), ForeignKey("institutions.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    role_type = Column(String(64), default="FULL_TIME")
    ctc_lpa = Column(Numeric(6, 2), nullable=False)
    stipend_per_month = Column(Numeric(10, 2))
    location = Column(String(255), nullable=False)
    description = Column(Text)
    min_cgpa = Column(Numeric(4, 2), default=6.0)
    max_backlogs = Column(Integer, default=0)
    status = Column(String(64), default="PENDING_TPO_REVIEW")
    openings = Column(Integer, default=5)

    company = relationship("Company", back_populates="jobs")
    institution = relationship("Institution", back_populates="jobs")
    applications = relationship("Application", back_populates="job", cascade="all, delete-orphan")


class CandidateAccess(Base):
    """
    CRITICAL OBJECT-LEVEL ACCESS CONTROL RECORD.
    Recruiters CANNOT browse or inspect candidates until explicit CandidateAccess is granted by TPO.
    """
    __tablename__ = "candidate_access"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=generate_uuid)
    institution_id = Column(UUID(as_uuid=True), ForeignKey("institutions.id", ondelete="CASCADE"), nullable=False, index=True)
    company_id = Column(UUID(as_uuid=True), ForeignKey("companies.id", ondelete="CASCADE"), nullable=False, index=True)
    job_id = Column(UUID(as_uuid=True), ForeignKey("jobs.id", ondelete="CASCADE"), nullable=False)
    student_id = Column(UUID(as_uuid=True), ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    application_id = Column(UUID(as_uuid=True), ForeignKey("applications.id", ondelete="CASCADE"), nullable=False)
    granted_by_tpo_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    granted_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    access_status = Column(String(32), default="ACTIVE")
    data_visibility_scope = Column(String(64), default="FULL_VERIFIED_PROFILE")


class Application(Base):
    __tablename__ = "applications"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=generate_uuid)
    student_id = Column(UUID(as_uuid=True), ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    job_id = Column(UUID(as_uuid=True), ForeignKey("jobs.id", ondelete="CASCADE"), nullable=False)
    institution_id = Column(UUID(as_uuid=True), ForeignKey("institutions.id", ondelete="CASCADE"), nullable=False)
    company_id = Column(UUID(as_uuid=True), ForeignKey("companies.id", ondelete="CASCADE"), nullable=False)
    applied_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    is_eligible = Column(Boolean, default=True)
    ineligibility_reason = Column(Text)
    ai_match_score = Column(Numeric(5, 2))
    tpo_verified = Column(Boolean, default=False)
    status = Column(String(64), default="APPLIED")

    student = relationship("Student", back_populates="applications")
    job = relationship("Job", back_populates="applications")


class PlacementDrive(Base):
    __tablename__ = "placement_drives"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=generate_uuid)
    institution_id = Column(UUID(as_uuid=True), ForeignKey("institutions.id", ondelete="CASCADE"), nullable=False, index=True)
    company_id = Column(UUID(as_uuid=True), ForeignKey("companies.id", ondelete="CASCADE"), nullable=False)
    job_id = Column(UUID(as_uuid=True), ForeignKey("jobs.id", ondelete="CASCADE"), nullable=False)
    drive_name = Column(String(255), nullable=False)
    drive_date = Column(DateTime, nullable=False)
    venue = Column(String(255))
    status = Column(String(64), default="SCHEDULED")
    infrastructure_capacity = Column(Integer, default=120)

    institution = relationship("Institution", back_populates="drives")


class Offer(Base):
    __tablename__ = "offers"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=generate_uuid)
    institution_id = Column(UUID(as_uuid=True), ForeignKey("institutions.id", ondelete="CASCADE"), nullable=False, index=True)
    student_id = Column(UUID(as_uuid=True), ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    company_id = Column(UUID(as_uuid=True), ForeignKey("companies.id", ondelete="CASCADE"), nullable=False)
    job_id = Column(UUID(as_uuid=True), ForeignKey("jobs.id", ondelete="CASCADE"), nullable=False)
    designation = Column(String(255), nullable=False)
    ctc_lpa = Column(Numeric(6, 2), nullable=False)
    offer_date = Column(DateTime, nullable=False)
    acceptance_deadline = Column(DateTime, nullable=False)
    status = Column(String(64), default="OFFERED")
    is_dream_offer = Column(Boolean, default=False)

    student = relationship("Student", back_populates="offers")


class Mentor(Base):
    __tablename__ = "mentors"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=generate_uuid)
    institution_id = Column(UUID(as_uuid=True), ForeignKey("institutions.id", ondelete="CASCADE"), nullable=False)
    full_name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False)
    phone = Column(String(32))
    department = Column(String(128), nullable=False)
    designation = Column(String(128), nullable=False)
    is_active = Column(Boolean, default=True)


class AuditLog(Base):
    __tablename__ = "audit_logs"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=generate_uuid)
    institution_id = Column(UUID(as_uuid=True), ForeignKey("institutions.id", ondelete="SET NULL"), nullable=True)
    user_id = Column(UUID(as_uuid=True), nullable=False)
    user_name = Column(String(255), nullable=False)
    user_role = Column(String(64), nullable=False)
    action = Column(String(64), nullable=False)
    resource_type = Column(String(64), nullable=False)
    resource_id = Column(String(128), nullable=False)
    details = Column(Text)
    ip_address = Column(String(64))
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
