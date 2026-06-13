"""Generate a local `.env` from `.env.example`.

This script will create a `.env` file in the repo root if it does not exist.
It will copy values from `.env.example` and generate a secure SECRET_KEY if the
example value is the placeholder `replace-with-a-secure-random-value`.

Usage:
  & .venv\Scripts\Activate.ps1
  python scripts/generate_env.py
"""
import secrets
from pathlib import Path


def load_example(path: Path) -> dict:
    data = {}
    if not path.exists():
        raise FileNotFoundError(f"{path} not found")
    for ln in path.read_text().splitlines():
        ln = ln.strip()
        if not ln or ln.startswith('#'):
            continue
        if '=' in ln:
            k, v = ln.split('=', 1)
            data[k.strip()] = v.strip()
    return data


def write_env(path: Path, mapping: dict):
    lines = []
    for k, v in mapping.items():
        lines.append(f"{k}={v}")
    path.write_text('\n'.join(lines) + '\n')


def main():
    root = Path(__file__).resolve().parents[1]
    example = root / '.env.example'
    out = root / '.env'
    if out.exists():
        print('.env already exists; leaving it untouched')
        return
    data = load_example(example)
    # generate SECRET_KEY if example placeholder present or empty
    sk = data.get('SECRET_KEY', '')
    if not sk or sk == 'replace-with-a-secure-random-value':
        data['SECRET_KEY'] = secrets.token_urlsafe(48)
        print('Generated secure SECRET_KEY')
    write_env(out, data)
    print('Wrote .env (do not commit secrets to git)')


if __name__ == '__main__':
    main()
