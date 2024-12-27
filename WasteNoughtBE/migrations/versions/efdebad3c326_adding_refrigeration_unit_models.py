"""Adding refrigeration unit models"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy import text

revision = 'efdebad3c326'
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    # Create users table first
    op.create_table(
        'users',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('email', sa.Text(), nullable=False),
        sa.Column('username', sa.Text(), nullable=False),
        sa.Column('password', sa.Text(), nullable=False),
        sa.Column('security_question', sa.Text(), nullable=False),
        sa.Column('security_answer', sa.Text(), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('email'),
        sa.UniqueConstraint('username')
    )

    # Then refrigeration_units
    op.create_table(
        'refrigeration_units',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(50), nullable=False),
        sa.Column('is_demo', sa.Boolean(), default=False),
        sa.PrimaryKeyConstraint('id')
    )

    # Then user_refrigeration_units
    op.create_table(
        'user_refrigeration_units',
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('refrigeration_unit_id', sa.Integer(), nullable=False),
        sa.Column('access_granted', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id']),
        sa.ForeignKeyConstraint(['refrigeration_unit_id'], ['refrigeration_units.id']),
        sa.PrimaryKeyConstraint('user_id', 'refrigeration_unit_id')
    )

    # Finally temperature_readings
    op.create_table(
        'temperature_readings',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('refrigeration_unit_id', sa.Integer(), nullable=False),
        sa.Column('timestamp', sa.DateTime(), nullable=False),
        sa.Column('temperature', sa.Float(), nullable=False),
        sa.ForeignKeyConstraint(['refrigeration_unit_id'], ['refrigeration_units.id']),
        sa.PrimaryKeyConstraint('id')
    )

    # Insert demo unit
    op.execute(text("INSERT INTO refrigeration_units (id, name, is_demo) VALUES (1, 'Beer Fridge - Demo Unit', TRUE)"))

def downgrade():
    op.drop_table('temperature_readings')
    op.drop_table('user_refrigeration_units')
    op.drop_table('refrigeration_units')
    op.drop_table('users')
