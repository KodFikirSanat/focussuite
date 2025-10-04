
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
// ... other helper functions will be added as needed ...

// User CRUD
pub fn create_user(conn: &Connection, user: &User) -> Result<()> {
    conn.execute("INSERT INTO users (user_id, user_name, user_password, user_mail, created_at) VALUES (?1, ?2, ?3, ?4, ?5)",
        params![&user.user_id.to_string(), &user.user_name, &user.user_password_hash, &user.user_mail, &user.created_at.to_rfc3339()])?;
    Ok(())
}
// ... all other CRUD operations for all 12 tables ...
