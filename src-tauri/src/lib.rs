mod nex_client;
use std::{
    net::{IpAddr, Ipv4Addr, SocketAddr},
    path::PathBuf,
};

use nex_common::{Package, PackageMetadata, VersionMeta};

#[derive(Debug, Clone)]
struct NexFrontendState(nex_common::Client);

#[derive(Debug, serde::Serialize, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
struct PackageFile {
    path: String,
    install_path: String,
}

#[derive(Debug, serde::Serialize, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
struct PackageDTO {
    name: String,
    version: VersionMeta,
    description: String,
    ticket: String,
}

#[derive(Debug, serde::Serialize, serde::Deserialize)]
struct MyCustomStruct {
    my_value: String,
}

#[tauri::command]
async fn create_package(
    state: tauri::State<'_, NexFrontendState>,
    name: String,
    version: String,
    description: String,
    package_dir: String,
    selected_files: Vec<PackageFile>,
) -> Result<String, String> {
    let client = &state.0;

    let meta = PackageMetadata {
        name,
        description,
        dependencies: Default::default(),
        version: version.parse().unwrap(),
        files: selected_files
            .iter()
            .map(|file| {
                let path = PathBuf::from(&file.path);
                let install_path = PathBuf::from(&file.install_path);
                (install_path, path)
            })
            .collect(),
        category: Some("Utility".into()),
    };

    let package_dir = PathBuf::from(package_dir);
    let package = Package::create_from_package_meta(package_dir, meta, &client.iroh)
        .await
        .unwrap();

    let ticket = package.share().await.unwrap();

    Ok(ticket.0.to_string())
}

#[tauri::command]
async fn list_packages(
    state: tauri::State<'_, NexFrontendState>,
) -> Result<Vec<PackageDTO>, String> {
    let client = &state.0;
    let packages = client.list_packages().await.unwrap();
    println!("{:#?}", packages);

    let mut package_list = vec![];
    for package in packages {
        let name = package.get_name(&client.iroh).await.unwrap();

        if let Some(name) = name {
            let description = package
                .get_description(&client.iroh)
                .await
                .unwrap()
                .unwrap();
            let version = package
                .get_latest_version_meta(&client.iroh)
                .await
                .unwrap()
                .unwrap();

            package_list.push(PackageDTO {
                name,
                version,
                description,
                ticket: package.share().await.unwrap().0.to_string(),
            })
        }
    }

    Ok(package_list)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let socket = SocketAddr::new(IpAddr::V4(Ipv4Addr::new(127, 0, 0, 1)), 4919);
    let client =
        tauri::async_runtime::block_on(nex_client::get_client(Some(socket), None)).unwrap();

    tauri::Builder::default()
        .plugin(tauri_plugin_clipboard_manager::init())
        .manage(NexFrontendState(client))
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle()
                    .plugin(
                        tauri_plugin_log::Builder::default()
                            .level(log::LevelFilter::Info)
                            .build(),
                    )
                    .unwrap();
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![list_packages, create_package])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
