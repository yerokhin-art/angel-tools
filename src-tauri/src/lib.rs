// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use serde::Serialize;
use std::{fs, time::UNIX_EPOCH};

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[derive(Serialize)]
struct FileInfo {
    name: String,
    path: String,
    size: u64,
    modified_ms: Option<u64>,
}

#[tauri::command]
fn list_directory(dir: &str) -> Result<Vec<FileInfo>, String> {
    let mut out = Vec::new();
    let entries = fs::read_dir(dir).map_err(|e| e.to_string())?;
    for entry in entries {
        let entry = entry.map_err(|e| e.to_string())?;
        let path = entry.path();
        let md = entry.metadata().map_err(|e| e.to_string())?;
        if md.is_file() {
            let modified_ms = md.modified().ok()
                .and_then(|t| t.duration_since(UNIX_EPOCH).ok())
                .map(|d| d.as_millis() as u64);
            out.push(FileInfo {
                name: path.file_name().unwrap_or_default().to_string_lossy().to_string(),
                path: path.to_string_lossy().to_string(),
                size: md.len(),
                modified_ms,
            });
        }
    }
    Ok(out)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![greet, list_directory])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
