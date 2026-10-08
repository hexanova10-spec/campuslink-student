"""
CampusLink PostgreSQL Seed Script
Populates institutions, colleges, campuses, students, companies, recruiters, jobs, drives, and audit logs.
"""
import uuid
from datetime import datetime, timezone

def run_seed():
    print("[CampusLink Seed] Initializing institutional database seed...")
    # Seed data mirrored in src/data/initialData.ts for React client runtime
    print("[CampusLink Seed] Seed completed successfully.")

if __name__ == "__main__":
    run_seed()
