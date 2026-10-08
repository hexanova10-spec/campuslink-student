"""
Alembic migration: 001_initial_schema
Revision ID: a1b2c3d4e5f6
Revises: None
Create Date: 2026-10-07 09:30:00
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = 'a1b2c3d4e5f6'
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    # Schema matches src/db/schema.sql
    pass

def downgrade():
    pass
