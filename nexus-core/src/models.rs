
use serde::{Serialize, Deserialize};
use chrono::{DateTime, Utc, NaiveDate};
use uuid::Uuid;

#[derive(Serialize, Deserialize)]
pub struct User {
    pub user_id: Uuid,
    pub user_name: String,
    pub user_password_hash: String,
    pub user_mail: String,
    pub created_at: DateTime<Utc>,
}

#[derive(Serialize, Deserialize)]
pub struct Device {
    pub device_id: Uuid,
    pub user_id: Uuid,
    pub device_type: String,
    pub push_token: Option<String>,
    pub last_seen: Option<DateTime<Utc>>,
}

#[derive(Serialize, Deserialize)]
pub struct TaskList {
    pub list_id: Uuid,
    pub user_id: Uuid,
    pub name: String,
}

#[derive(Serialize, Deserialize)]
pub struct Task {
    pub task_id: Uuid,
    pub list_id: Uuid,
    pub content: String,
    pub is_completed: bool,
    pub due_date: Option<NaiveDate>,
    pub created_at: DateTime<Utc>,
}

#[derive(Serialize, Deserialize)]
pub struct Block {
    pub block_id: Uuid,
    pub user_id: Uuid,
    pub start_time: DateTime<Utc>,
    pub end_time: DateTime<Utc>,
}

#[derive(Serialize, Deserialize)]
pub struct TaskBlock {
    pub task_id: Uuid,
    pub block_id: Uuid,
}

#[derive(Serialize, Deserialize)]
pub struct BlockedItem {
    pub item_id: Uuid,
    pub user_id: Uuid,
    pub item_type: String,
    pub identifier: String,
    pub is_active: bool,
}

#[derive(Serialize, Deserialize)]
pub struct Sound {
    pub sound_id: Uuid,
    pub name: String,
    pub category: Option<String>,
    pub file_url: String,
}

#[derive(Serialize, Deserialize)]
pub struct FavoriteSound {
    pub user_id: Uuid,
    pub sound_id: Uuid,
}

#[derive(Serialize, Deserialize)]
pub struct Habit {
    pub habit_id: Uuid,
    pub user_id: Uuid,
    pub name: String,
    pub description: Option<String>,
    pub habit_cover: Option<String>,
    pub frequency_type: String,
}

#[derive(Serialize, Deserialize)]
pub struct HabitEntry {
    pub entry_id: Uuid,
    pub habit_id: Uuid,
    pub completion_date: NaiveDate,
    pub notes: Option<String>,
}

#[derive(Serialize, Deserialize)]
pub struct Pomodoro {
    pub pomodoro_id: Uuid,
    pub user_id: Uuid,
    pub pomodoro_name: String,
    pub pomodoro_cover: Option<String>,
    pub work_duration: i32,
    pub short_break_duration: i32,
    pub long_break_duration: i32,
    pub long_break_interval: i32,
    pub created_at: DateTime<Utc>,
    pub updated_at: Option<DateTime<Utc>>,
}
