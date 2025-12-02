# OpenMirror

OpenMirror is a simple, web-based tool to generate configuration scripts for hosting open-source mirrors. It follows the "Keep It Simple" philosophy: **One script to rule them all.**

## How it Works

1.  **Configure**: Open the web interface (`index.html`).
2.  **Select**: Choose the mirrors you want to host (Ubuntu, Arch, etc.) or add custom ones.
3.  **Generate**: Get a custom `setup.sh` Bash script.
4.  **Run**: Execute the script on your server (Debian/Ubuntu recommended).

## Features

- **Zero Config Server**: The generated script installs Nginx, Rsync, and Cron for you.
- **Automated Syncing**: Sets up optimized cron jobs for each mirror.
- **Web Serving**: Configures Nginx with auto-indexing for easy file browsing.
- **Analytics**: Optional integration with GoAccess for visual traffic reports.

## Usage

### Running the Generator
Simply open `index.html` in your web browser. No server required for the generator itself.

### Deploying the Mirror
1.  Copy the generated script to your server.
2.  Make it executable: `chmod +x setup.sh`
3.  Run it as root: `sudo ./setup.sh`

### Future Plans
- Support for FTP and Rsync protocol for serving.
- Customizable sync intervals.
- Deployment as Docker conatainer.
- Deployment as LXC on Proxmox.
- Enhanced monitoring and alerting.
- Leaderboard of mirrors

## Contributing
Contributions are welcome! Feel free to open issues or submit pull requests.
Add new mirror presets in `js/presets.js`.

## License
MIT License.
