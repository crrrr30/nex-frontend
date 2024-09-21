#[derive(Debug, serde::Serialize, serde::Deserialize)]
struct MyCustomStruct {
    my_value: String,
}

#[tauri::command(rename_all = "snake_case")]
fn my_custom_command(my_value: String) -> MyCustomStruct {
    println!("{} was invoked from JS!", my_value);
    MyCustomStruct {
        my_value: format!("{} was invoked from JS!", my_value),
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![my_custom_command])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
