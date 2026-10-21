from pathlib import Path

ROOT = Path(__file__).resolve().parent


def test_index_has_todo_layout():
    html = (ROOT / "index.html").read_text(encoding="utf-8")
    assert "To-Do List" in html
    assert "todo-form" in html
    assert "todo-list" in html


def test_script_uses_local_storage():
    script = (ROOT / "script.js").read_text(encoding="utf-8")
    assert "localStorage" in script
    assert "STORAGE_KEY" in script


def test_script_supports_task_actions():
    script = (ROOT / "script.js").read_text(encoding="utf-8")
    assert "addTask" in script
    assert "toggleTask" in script
    assert "deleteTask" in script


def test_css_has_app_styles():
    css = (ROOT / "styles.css").read_text(encoding="utf-8")
    assert ".todo-card" in css
    assert ".todo-item" in css
