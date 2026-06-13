from backend.core.config import settings
import sqlalchemy as sa
from pathlib import Path
print('DATABASE_URL:', settings.DATABASE_URL)
if settings.DATABASE_URL.startswith('sqlite'):
    p = settings.DATABASE_URL.replace('sqlite:///','')
    print('sqlite path:', p)
    print('exists?', Path(p).exists())
    try:
        e = sa.create_engine(settings.DATABASE_URL)
        with e.connect() as conn:
            rows = conn.execute(sa.text("SELECT name FROM sqlite_master WHERE type='table'"))
            print('tables:', [r[0] for r in rows.fetchall()])
    except Exception as ex:
        print('sync engine error:', ex)
else:
    print('Not sqlite DB')
