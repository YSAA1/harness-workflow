from __future__ import annotations

from pathlib import Path


def git_config_path(root: Path) -> Path | None:
    git = root / ".git"
    if git.is_dir():
        return git / "config"
    if git.is_file():
        text = git.read_text(encoding="utf-8", errors="replace").strip()
        prefix = "gitdir:"
        if text.lower().startswith(prefix):
            gitdir = text[len(prefix):].strip()
            gitdir_path = Path(gitdir)
            if not gitdir_path.is_absolute():
                gitdir_path = (root / gitdir_path).resolve()
            return gitdir_path / "config"
    return None


def has_github_remote(root: Path) -> dict:
    config = git_config_path(root)
    if not config or not config.exists():
        return {"present": False, "source": None}
    text = config.read_text(encoding="utf-8", errors="replace")
    return {"present": "github.com" in text, "source": str(config)}
