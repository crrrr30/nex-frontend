use std::{net::SocketAddr, path::PathBuf};

pub async fn get_client(
    rp_addr: Option<SocketAddr>,
    node_path: Option<PathBuf>,
) -> anyhow::Result<nex_common::Client> {
    if let Some(addr) = rp_addr {
        nex_common::Client::connect_rpc(addr).await
    } else if let Some(path) = node_path {
        nex_common::Client::connect_path(path).await
    } else {
        unreachable!("Either rpc_addr or node_path must be provided");
    }
}
