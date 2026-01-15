# 在线五子棋对战系统

一个基于 WebSocket 的在线五子棋双人对战游戏。

## 功能特性

- ✅ 实时在线双人对战
- ✅ 自定义玩家昵称
- ✅ 黑棋/白棋自动分配
- ✅ 实时比分记录
- ✅ 悔棋功能
- ✅ 认输功能
- ✅ 游戏结束自动重置
- ✅ 现代简约 UI 设计

## 技术栈

### 前端
- React 18
- TDesign React 1.12.0
- TailwindCSS 3.4.17
- Socket.io Client
- Vite

### 后端
- Node.js
- Express
- Socket.io
- ES Modules

## 项目结构

```
web-Gobang/
├── client/                 # 前端项目
│   ├── src/
│   │   ├── components/     # React 组件
│   │   │   ├── ChessBoard.jsx    # 棋盘组件
│   │   │   ├── PlayerInfo.jsx    # 玩家信息
│   │   │   ├── ScoreBoard.jsx    # 比分板
│   │   │   ├── ControlPanel.jsx  # 控制面板
│   │   │   └── NameInput.jsx     # 昵称输入
│   │   ├── styles/        # 样式
│   │   ├── App.jsx        # 主应用
│   │   ├── main.jsx       # 入口文件
│   │   └── index.css      # 全局样式
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── server/                # 后端项目
    ├── src/
    │   ├── server.js      # 服务器入口
    │   └── gameLogic.js   # 游戏逻辑
    └── package.json
```

## 快速开始

### 1. 安装依赖

```bash
# 安装所有依赖
npm run install:all

# 或者分别安装
npm install
cd server && npm install
cd ../client && npm install
```

### 2. 启动服务器

```bash
# 方式一：同时启动前后端（推荐）
npm run start

# 方式二：分别启动
# 终端1：启动后端
npm run server

# 终端2：启动前端
npm run client
```

### 3. 访问游戏

前端地址：http://localhost:3000
后端地址：http://localhost:3001

## Docker 部署

### 快速部署

```bash
# 使用 Docker Compose 启动
docker-compose up -d

# 访问地址
http://localhost:3001
```

### 生产环境部署

```bash
# 使用 Nginx + 生产模式
docker-compose -f docker-compose.prod.yml up -d

# 访问地址
http://localhost
```

### NPM 脚本快捷命令

```bash
# 构建 Docker 镜像
npm run docker:build

# 启动容器
npm run docker:up

# 停止容器
npm run docker:down

# 查看日志
npm run docker:logs
```

详细的 Docker 部署指南请查看 [DOCKER_DEPLOYMENT.md](./DOCKER_DEPLOYMENT.md)

## GitHub Actions 自动部署

项目配置了 GitHub Actions 工作流，支持：

- **自动构建 Docker 镜像**：推送到 `main` 分支时自动构建
- **CI/CD**：自动测试和部署
- **自动化部署到服务器**：通过 SSH 部署

配置方法请查看 [CONTRIBUTING.md](./CONTRIBUTING.md)

## 部署到云服务器

### 使用 PM2 部署

```bash
# 安装 PM2
npm install -g pm2

# 启动服务器
cd server
pm2 start src/server.js --name gobang-server

# 启动前端（使用 Vite 生产模式）
cd ../client
npm run build
pm2 start "npx serve -s dist -l 3000" --name gobang-client

# 查看 PM2 状态
pm2 status

# 保存 PM2 配置
pm2 save
pm2 startup
```

### 使用 Nginx 反向代理

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # 前端
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # WebSocket
    location /socket.io/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 游戏规则

1. 两人在线对战，自动分配黑棋和白棋
2. 黑棋先行，双方轮流落子
3. 五子连珠（横、竖、斜）即获胜
4. 支持悔棋（在落子前可撤销）
5. 支持认输
6. 游戏结束后可重新开始
7. 任一玩家离开时，比分归零

## Socket 事件

### 客户端 -> 服务器

- `join_game` - 加入游戏
- `make_move` - 落子
- `request_undo` - 悔棋请求
- `resign` - 认输
- `restart_game` - 重新开始

### 服务器 -> 客户端

- `join_success` - 加入成功
- `game_state` - 游戏状态更新
- `game_start` - 游戏开始
- `move_made` - 落子成功
- `game_over` - 游戏结束
- `undo_success` - 悔棋成功
- `player_resign` - 玩家认输
- `game_restarted` - 游戏重启
- `game_reset` - 游戏重置
- `error` - 错误信息

## 开发说明

### 环境要求

- Node.js >= 16
- npm 或 yarn

### 开发命令

```bash
# 前端开发
cd client
npm run dev

# 后端开发（带热重载）
cd server
npm run dev
```

## 故障排除

### 问题1：输入昵称后无法进入游戏页面

**可能原因**：
1. 服务器未启动
2. Socket连接失败
3. 端口被占用

**解决方法**：
```bash
# 检查服务器是否运行
cd server
node src/server.js

# 应该看到：五子棋服务器运行在端口 3001

# 检查浏览器控制台（F12）
# 应该看到：已连接到服务器
```

### 问题2：无法连接到服务器

**解决方法**：
```bash
# 1. 确认服务器已启动
cd server && node src/server.js

# 2. 检查端口是否被占用
# Windows
netstat -ano | findstr :3001
# Linux/Mac
lsof -i :3001

# 3. 检查防火墙设置
```

### 问题3：依赖安装失败

**解决方法**：
```bash
# 清理缓存并重新安装
npm cache clean --force
npm run install:all
```

### 问题4：模块找不到错误

**原因**：`server/package.json` 缺少 `"type": "module"`

**解决方法**：已修复，确保使用最新代码

## License

MIT - 详见 [LICENSE](./LICENSE) 文件

## 贡献

欢迎提交 Issue 和 Pull Request！详见 [CONTRIBUTING.md](./CONTRIBUTING.md)

## 技术支持

如有问题，请提交 [GitHub Issues](https://github.com/your-username/web-Gobang/issues)
