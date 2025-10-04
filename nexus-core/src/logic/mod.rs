
use crate::db::operations;
use crate::models::{TaskList, Task};
use rusqlite::Connection;
use uuid::Uuid;
use chrono::Utc;

pub fn get_all_task_lists_for_user(conn: &Connection, user_id: Uuid) -> Result<Vec<TaskList>, rusqlite::Error> {
    operations::get_task_lists_by_user_id(conn, user_id)
}

pub fn create_new_task_list(conn: &Connection, user_id: Uuid, name: String) -> Result<TaskList, rusqlite::Error> {
    let new_task_list = TaskList {
        list_id: Uuid::new_v4(),
        user_id,
        name,
    };
    operations::create_task_list(conn, &new_task_list)?;
    Ok(new_task_list)
}

pub fn add_task_to_list(conn: &Connection, user_id: Uuid, list_id: Uuid, content: String) -> Result<Task, String> {
    match operations::get_task_list(conn, list_id) {
        Ok(Some(task_list)) => {
            if task_list.user_id != user_id {
                return Err("Access denied: Task list does not belong to the user".to_string());
            }

            let new_task = Task {
                task_id: Uuid::new_v4(),
                list_id,
                content,
                is_completed: false,
                due_date: None,
                created_at: Utc::now(),
            };

            match operations::create_task(conn, &new_task) {
                Ok(_) => Ok(new_task),
                Err(e) => Err(format!("Failed to create task: {}", e)),
            }
        }
        Ok(None) => Err("Task list not found".to_string()),
        Err(e) => Err(format!("Database error: {}", e)),
    }
}

pub fn mark_task_as_complete(conn: &Connection, user_id: Uuid, task_id: Uuid) -> Result<(), String> {
    match operations::get_task(conn, task_id) {
        Ok(Some(task)) => {
            match operations::get_task_list(conn, task.list_id) {
                Ok(Some(task_list)) => {
                    if task_list.user_id != user_id {
                        return Err("Access denied: Task does not belong to the user".to_string());
                    }

                    match operations::update_task_status(conn, task_id, true) {
                        Ok(_) => Ok(()),
                        Err(e) => Err(format!("Failed to update task: {}", e)),
                    }
                }
                Ok(None) => Err("Internal error: Task list not found for task".to_string()),
                Err(e) => Err(format!("Database error: {}", e)),
            }
        }
        Ok(None) => Err("Task not found".to_string()),
        Err(e) => Err(format!("Database error: {}", e)),
    }
}
