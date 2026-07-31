# Deploy — Hostinger KVM2 VPS (Litvanya, Ubuntu 24.04)

Domain: `civicexplorer.org` (DNS A kaydını Hostinger panelinden VPS IP'sine yönlendirin,
önce bunu yapın — certbot domain'in gerçekten VPS'e işaret ettiğini kontrol ediyor).

Tüm komutlar VPS'e SSH ile bağlandıktan sonra çalıştırılır.

## 1. Sunucu sertleştirme (ilk kurulumda, bir kere)

```bash
apt update && apt upgrade -y

adduser deploy
usermod -aG sudo deploy
rsync --archive --chown=deploy:deploy ~/.ssh /home/deploy   # kendi public key'iniz root'ta zaten kayıtlıysa

# /etc/ssh/sshd_config içinde şu satırları ayarlayın:
#   PasswordAuthentication no
#   PermitRootLogin no
systemctl restart sshd

ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
```
Bundan sonra `deploy` kullanıcısıyla SSH'layın, root ile değil.

## 2. Node.js, PostgreSQL, Nginx

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs postgresql postgresql-contrib nginx certbot python3-certbot-nginx

sudo -u postgres psql -c "CREATE USER archipelago WITH PASSWORD 'GUCLU_SIFRE_BURAYA';"
sudo -u postgres psql -c "CREATE DATABASE archipelago OWNER archipelago;"
```

## 3. Uygulamayı sunucuya kopyalama

Yerelde (bu repo kökünden):
```bash
git push   # ya da rsync ile server/ ve dist/ klasörlerini VPS'e kopyalayın
```
VPS'te:
```bash
sudo mkdir -p /var/www/archipelago-api /var/www/archipelago
sudo chown -R deploy:deploy /var/www/archipelago-api /var/www/archipelago

cd /var/www/archipelago-api
git clone <repo-url> .   # ya da rsync
cd server
npm install --omit=dev
psql -U archipelago -d archipelago -h 127.0.0.1 -f schema.sql

cp .env.example .env
# .env içini doldurun: DATABASE_URL şifresi, ALLOWED_ORIGIN=https://civicexplorer.org
```

Frontend build'i (yerelde `npm run build` sonrası oluşan `dist/`) `/var/www/archipelago/dist` içine kopyalanır.

## 4. API'yi systemd servisi olarak çalıştırma

`/etc/systemd/system/archipelago-api.service`:
```ini
[Unit]
Description=Archipelago API
After=network.target postgresql.service

[Service]
User=deploy
WorkingDirectory=/var/www/archipelago-api/server
ExecStart=/usr/bin/node server.js
Restart=always
EnvironmentFile=/var/www/archipelago-api/server/.env

[Install]
WantedBy=multi-user.target
```
```bash
sudo systemctl daemon-reload
sudo systemctl enable --now archipelago-api
sudo systemctl status archipelago-api
```

## 5. Nginx + TLS

`/etc/nginx/sites-available/civicexplorer`:
```nginx
# Kişisel veri (session_id hariç) IP adresi içermez; yine de access log'da
# IP tutmamak için log formatını anonimleştiriyoruz.
log_format anon '$remote_addr_anon - [$time_local] "$request" $status';
map $remote_addr $remote_addr_anon {
  ~(?P<ip>\d+\.\d+\.\d+)\.\d+  $ip.0;   # IPv4 son oktedi at
  default 0.0.0.0;
}

server {
  listen 80;
  server_name civicexplorer.org www.civicexplorer.org;

  root /var/www/archipelago/dist;
  index index.html;
  access_log /var/log/nginx/civicexplorer.access.log anon;

  location / { try_files $uri /index.html; }

  location /api/ {
    proxy_pass http://127.0.0.1:3001/;
  }
}
```
```bash
sudo ln -s /etc/nginx/sites-available/civicexplorer /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d civicexplorer.org -d www.civicexplorer.org
```
Certbot otomatik yenileme için bir systemd timer kurar, ekstra bir şey yapmanız gerekmez.

## 6. Retention (otomatik silme) cron'u

Grant/DMP'nizde belirttiğiniz saklama süresine göre `12 months` değerini ayarlayın:
```bash
crontab -e -u deploy
```
```
0 3 * * * PGPASSWORD=GUCLU_SIFRE_BURAYA psql -U archipelago -d archipelago -h 127.0.0.1 -c "DELETE FROM sessions WHERE started_at < now() - interval '12 months';"
```

## 7. Yeniden deploy (her güncellemede)

```bash
cd /var/www/archipelago-api && git pull && cd server && npm install --omit=dev
sudo systemctl restart archipelago-api
# frontend güncellemesi: yeni dist/ klasörünü /var/www/archipelago/dist içine kopyalayın
sudo systemctl reload nginx
```

## Yapılacaklar (unutmayın)
- [ ] DNS A kaydı `civicexplorer.org` → VPS IP
- [ ] Hostinger'dan DPA (Data Processing Agreement) talep edin/imzalayın
- [ ] `.env` içindeki şifreyi güçlü ve benzersiz yapın, repoya asla commitlemeyin
- [ ] DMP'de saklama süresini netleştirip cron'daki `12 months` değerini buna göre ayarlayın
