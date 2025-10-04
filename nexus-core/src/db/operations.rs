
use rusqlite::{Connection, Result, params, Row};
use std::fs;
use std::path::Path;
use crate::models::{User, Device, TaskList, Task, Block, TaskBlock, BlockedItem, Sound, FavoriteSound, Habit, HabitEntry, Pomodoro};
use uuid::Uuid;
use chrono::{Utc, DateTime, NaiveDate};

pub fn initialize_database(db_path: &str) -> Result<Connection> {
    let conn = Connection::open(db_path)?;
    let schema_path = Path::new(env!("CARGO_MANIFEST_DIR")).join("src/db/schema.sql");
    let schema_sql = fs::read_to_string(schema_path).expect("Failed to read schema file");
    conn.execute_batch(&schema_sql)?;
    Ok(conn)
}

// Helper functions for row mapping
fn row_to_user(row: &Row) -> rusqlite::Result<User> {
    Ok(User {
        user_id: Uuid::parse_str(row.get_ref(0)?.as_str()?).unwrap(),
        user_name: row.get(1)?,
        user_password_hash: row.get(2)?,
        user_mail: row.get(3)?,
        created_at: DateTime::parse_from_rfc3339(row.get_ref(4)?.as_str()?).unwrap().with_timezone(&Utc),
    })
}

fn row_to_device(row: &Row) -> rusqlite::Result<Device> {
    Ok(Device {
        device_id: Uuid::parse_str(row.get_ref(0)?.as_str()?).unwrap(),
        user_id: Uuid::parse_str(row.get_ref(1)?.as_str()?).unwrap(),
        device_type: row.get(2)?,
        push_token: row.get(3)?,
        last_seen: row.get_ref(4)?.as_str().ok().and_then(|s| DateTime::parse_from_rfc3339(s).ok()).map(|dt| dt.with_timezone(&Utc)),
    })
}
fn row_to_task_list(row: &Row) -> rusqlite::Result<TaskList> {
    Ok(TaskList {
        list_id: Uuid::parse_str(row.get_ref(0)?.as_str()?).unwrap(),
        user_id: Uuid::parse_str(row.get_ref(1)?.as_str()?).unwrap(),
        name: row.get(2)?,
    })
}

fn row_to_task(row: &Row) -> rusqlite::Result<Task> {
    Ok(Task {
        task_id: Uuid::parse_str(row.get_ref(0)?.as_str()?).unwrap(),
        list_id: Uuid::parse_str(row.get_ref(1)?.as_str()?).unwrap(),
        content: row.get(2)?,
        is_completed: row.get(3)?,
        due_date: row.get_ref(4)?.as_str().ok().and_then(|s| NaiveDate::parse_from_str(s, "%Y-%m-%d").ok()),
        created_at: DateTime::parse_from_rfc3339(row.get_ref(5)?.as_str()?).unwrap().with_timezone(&Utc),
    })
}
// ... other helper functions will be added as needed ...

// User CRUD
pub fn create_user(conn: &Connection, user: &User) -> Result<()> {
    conn.execute("INSERT INTO users (user_id, user_name, user_password, user_mail, created_at) VALUES (?1, ?2, ?3, ?4, ?5)",
        params![&user.user_id.to_string(), &user.user_name, &user.user_password_hash, &user.user_mail, &user.created_at.to_rfc3339()])?;
    Ok(())
}
// TaskList CREATE
pub fn create_task_list(conn: &Connection, task_list: &TaskList) -> Result<()> {
    conn.execute(
        "INSERT INTO task_lists (list_id, user_id, name) VALUES (?1, ?2, ?3)",
        params![&task_list.list_id.to_string(), &task_list.user_id.to_string(), &task_list.name],
    )?;
    Ok(())
}

// Task CREATE
pub fn create_task(conn: &Connection, task: &Task) -> Result<()> {
    conn.execute(
        "INSERT INTO tasks (task_id, list_id, content, is_completed, due_date, created_at) VALUES (?1, ?2, ?3, ?4, ?5, ?6)",
        params![&task.task_id.to_string(), &task.list_id.to_string(), &task.content, &task.is_completed, &task.due_date.map(|d| d.to_string()), &task.created_at.to_rfc3339()],
    )?;
    Ok(())
}

// TaskList READ (by list_id)
pub fn get_task_list(conn: &Connection, list_id: Uuid) -> Result<Option<TaskList>> {
    let mut stmt = conn.prepare("SELECT list_id, user_id, name FROM task_lists WHERE list_id = ?1")?;
    let mut rows = stmt.query_map(params![list_id.to_string()], row_to_task_list)?;
    rows.next().transpose()
}
// Task UPDATE
pub fn update_task_status(conn: &Connection, task_id: Uuid, is_completed: bool) -> Result<usize> {
    conn.execute(
        "UPDATE tasks SET is_completed = ?1 WHERE task_id = ?2",
        params![is_completed, task_id.to_string()],
    )
}

// Task READ (by task_id)
pub fn get_task(conn: &Connection, task_id: Uuid) -> Result<Option<Task>> {
    let mut stmt = conn.prepare("SELECT task_id, list_id, content, is_completed, due_date, created_at FROM tasks WHERE task_id = ?1")?;
    let mut rows = stmt.query_map(params![task_id.to_string()], row_to_task)?;
    rows.next().transpose()
}
// ... all other CRUD operations for all 12 tables ...

// TaskList READ (by user)
pub fn get_task_lists_by_user_id(conn: &Connection, user_id: Uuid) -> Result<Vec<TaskList>> {
    let mut stmt = conn.prepare("SELECT list_id, user_id, name FROM task_lists WHERE user_id = ?1")?;
    let rows = stmt.query_map(params![user_id.to_string()], row_to_task_list)?;
    
    let mut task_lists = Vec::new();
    for row in rows {
        task_lists.push(row?);
    }
    
    Ok(task_lists)
}
