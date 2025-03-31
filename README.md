! Work in Progress, wait for stable release or you may encounter issues !
# OpenMirror

OpenMirror is a lightweight solution for hosting file mirrors using Docker. It includes:

- **Nginx Web Server**: Serves mirrored files over HTTP.
- **Rsync Cron Job**: Automatically syncs the mirror with an upstream source.
- **GoAccess Analytics**: Generates web-based reports for monitoring access logs.

## Features
- Automated mirror updates every 30 minutes.
- Web-based access to mirrored files.
- Real-time analytics dashboard with GoAccess.
- Easy setup with Docker Compose.

---

## Installation
### **1. Using Docker Compose (Recommended but WIP may encounter issues)**

#### Prerequisites
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

#### Steps
1. Clone the repository:
   ```sh
   git clone https://github.com/ChiragSukhala/OpenMirror.git
   cd OpenMirror
   ```
2. Create necessary directories:
   ```sh
   mkdir -p data logs reports
   ```
3. Start the services:
   ```sh
   docker-compose up -d
   ```
4. Access the mirror at `http://localhost:8080`
5. View reports at `http://localhost:8081`

---

### **2. Manual Setup (Without Docker)**

#### Prerequisites
- Ubuntu/Debian-based system
- Nginx
- Rsync
- GoAccess

#### Steps
1. Install dependencies:
   ```sh
   sudo apt update && sudo apt install -y nginx rsync goaccess cron
   ```
2. Configure Nginx:
   - Edit `/etc/nginx/sites-available/default` and set the document root to `/var/www/mirror`
   - Restart Nginx: `sudo systemctl restart nginx`
3. Set up Rsync sync job:
   ```sh
   echo "*/30 * * * * rsync -avz --delete rsync://mirror.example.com/repo /var/www/mirror" | sudo tee -a /etc/crontab
   ```
4. Configure GoAccess:
   ```sh
   echo "*/30 * * * * goaccess /var/log/nginx/access.log --log-format=COMBINED --output=/var/www/mirror/reports.html" | sudo tee -a /etc/crontab
   ```
5. Restart cron service:
   ```sh
   sudo systemctl restart cron
   ```

---

## Future Plans
- Support for FTP and Rsync access.
- Customizable sync intervals.
- Docker images with pre-configured settings.
- Enhanced monitoring and alerting.
- Leaderboard of mirrors

## Contributing
Contributions are welcome! Feel free to open issues or submit pull requests.

## License
MIT License.

