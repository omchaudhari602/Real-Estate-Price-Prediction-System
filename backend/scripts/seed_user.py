"""Seed a default admin user into the local development database.

This script is intentionally simple and SQLite-friendly so it works even when
SQLAlchemy metadata initialization hasn't run yet.

Usage:
  & .venv\Scripts\Activate.ps1
  cd backend
  python scripts/seed_user.py --email admin@example.com --password password
"""

import argparse
import sqlite3
from pathlib import Path

# Fixed imports by removing the 'backend.' prefix to avoid path conflicts
from core.config import settings
from services.auth_service import get_password_hash


def resolve_sqlite_path() -> Path:
    db_url = settings.DATABASE_URL
    if not db_url.startswith("sqlite"):
        raise ValueError("This local seed script currently supports sqlite DATABASE_URL only.")

    # support sqlite:///relative.db and sqlite:////absolute.db
    if db_url.startswith("sqlite:////"):
        return Path(db_url.replace("sqlite:////", "/", 1))
    return Path(db_url.replace("sqlite:///", "", 1))


def ensure_table(conn: sqlite3.Connection) -> None:
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            hashed_password TEXT NOT NULL,
            full_name TEXT,
            is_active INTEGER NOT NULL DEFAULT 1,
            is_superuser INTEGER NOT NULL DEFAULT 0,
            role TEXT NOT NULL DEFAULT 'user'
        )
        """
    )
    conn.commit()


def seed_user(email: str, password: str, full_name: str = "Admin") -> None:
    db_path = resolve_sqlite_path()
    db_path.parent.mkdir(parents=True, exist_ok=True)

    conn = sqlite3.connect(db_path)
    try:
        ensure_table(conn)
        cur = conn.cursor()
        cur.execute("SELECT id FROM users WHERE email = ?", (email,))
        if cur.fetchone():
            print(f"User {email} already exists. Skipping.")
            return

        hashed = get_password_hash(password)
        cur.execute(
            """
            INSERT INTO users (email, hashed_password, full_name, is_active, is_superuser, role)
            VALUES (?, ?, ?, 1, 1, 'admin')
            """,
            (email, hashed, full_name),
        )
        conn.commit()
        print(f"Created admin user: {email}")
    finally:
        conn.close()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Seed a local admin user into sqlite DB")
    parser.add_argument("--email", default="omchaudhari@gmail.com")
    parser.add_argument("--password", default="chaudhari@27")
    parser.add_argument("--full-name", default="Admin")
    args = parser.parse_args()
    seed_user(args.email, args.password, args.full_name)