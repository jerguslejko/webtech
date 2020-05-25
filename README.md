- Install Node package manager (npm), the latest stable version of Node and SQLite3
```bash
sudo apt install npm
sudo npm cache clean -f
sudo npm install -g n
sudo n stable
sudo apt-get install sqlite3
```
- Set up webapp (only once):
```bash
npm install
npm run database:setup
```
- Run webapp:
```bash
npm run dev
```
- Open it on your web browser (Firefox reccomended) via https://localhost:5000
  - Your browser may deem our app not safe (because we have a self-issued SSL certificate). Ignore this.

- You can login with our demo account details:
  - Username = "user"
  - Password = "password"
