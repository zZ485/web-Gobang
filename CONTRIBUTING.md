# Contributing to Web Gobang

感谢您对五子棋项目的关注！我们欢迎任何形式的贡献。

## 如何贡献

### 报告 Bug

如果您发现了 bug，请：

1. 检查 [Issues](https://github.com/your-username/web-Gobang/issues) 确保该 bug 尚未报告
2. 创建新的 Issue，包含：
   - 清晰的标题
   - 详细的问题描述
   - 重现步骤
   - 预期行为
   - 实际行为
   - 环境信息（操作系统、浏览器版本等）

### 提出新功能

我们欢迎新功能的建议！在创建 Issue 之前，请先：

1. 检查是否已有类似的功能请求
2. 描述新功能的用途和价值
3. 如果可能，提供设计草图或实现思路

### 提交代码

#### 开发环境设置

```bash
# 克隆仓库
git clone https://github.com/your-username/web-Gobang.git
cd web-Gobang

# 安装依赖
npm run install:all

# 启动开发服务器
npm run start
```

#### 代码规范

- 前端使用 React + TailwindCSS
- 后端使用 Node.js + Express + Socket.io
- 使用 ES Modules
- 遵循现有代码风格
- 添加必要的注释

#### 提交 Pull Request

1. Fork 仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

#### Pull Request 要求

- 清晰描述更改内容
- 引用相关的 Issue
- 确保代码通过测试
- 更新相关文档

## 项目结构

```
web-Gobang/
├── client/                 # React 前端
│   ├── src/
│   │   ├── components/     # 可复用组件
│   │   ├── App.jsx        # 主应用组件
│   │   └── main.jsx       # 应用入口
│   └── package.json
├── server/                 # Node.js 后端
│   ├── src/
│   │   ├── server.js      # 服务器入口
│   │   └── gameLogic.js   # 游戏逻辑
│   └── package.json
├── nginx/                  # Nginx 配置
└── docker-compose.yml      # Docker 编排
```

## 开发指南

### 添加新功能

1. 在 `server/src/` 中添加后端逻辑
2. 在 `client/src/` 中添加前端组件
3. 更新 Socket 事件（如果需要）
4. 更新 README.md 文档

### 测试

```bash
# 前端测试
cd client
npm run dev

# 后端测试
cd server
npm run dev
```

## 获取帮助

- 查看 [README.md](./README.md) 了解项目概况
- 查看 [DOCKER_DEPLOYMENT.md](./DOCKER_DEPLOYMENT.md) 了解部署方法
- 提交 Issue 获取支持

## 许可证

通过贡献代码，您同意您的贡献将在 [MIT License](LICENSE) 下发布。

谢谢您的贡献！
