
use rusqlite::{Connection, Result};
use std::fs;
use std::path::Path;
use crate::models::User;
use uuid::Uuid;
use chrono::Utc;

pub fn initialize_database(db_path: &str) -> Result<Connection> {
    let conn = Connection::open(db_path)?;
    
    let schema_path = Path::new(env!("CARGO_MANIFEST_DIR")).join("src/db/schema.sql");
    let schema_sql = fs::read_to_string(schema_path)
        .expect("Should have been able to read the schema file");

    conn.execute_batch(&schema_sql)?;

    Ok(conn)
}

pub fn create_user(conn: &Connection, user_name: &str, user_password_hash: &str, user_mail: &str) -> Result<()> {
    let user = User {
        user_id: Uuid::new_v4(),
        user_name: user_name.to_string(),
        user_password_hash: user_password_hash.to_string(),
        user_mail: user_mail.to_string(),
        created_at: Utc::now(),
    };

    conn.execute(
        "INSERT INTO users (user_id, user_name, user_password, user_mail, created_at) VALUES (?1, ?2, ?3, ?4, ?5)",
        (&user.user_id.to_string(), &user.user_name, &user.user_password_hash, &user.user_mail, &user.created_at.to_rfc3339()),
    )?;

    Ok(())
}
