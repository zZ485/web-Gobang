# Docker 部署指南

本指南提供了使用 Docker 和 Docker Compose 部署五子棋应用的完整说明。

## 目录

- [快速开始](#快速开始)
- [构建镜像](#构建镜像)
- [使用 Docker Compose](#使用-docker-compose)
- [生产环境部署](#生产环境部署)
- [故障排查](#故障排查)

## 快速开始

### 前置要求

- Docker 20.10+
- Docker Compose 2.0+

### 构建并运行

```bash
# 构建镜像
docker build -t gobang-app .

# 运行容器
docker run -d -p 3001:3001 --name gobang-app gobang-app
```

## 构建镜像

### 使用 Dockerfile

```bash
# 构建镜像
docker build -t gobang-app:latest .

# 查看镜像
docker images | grep gobang
```

### 多阶段构建说明

本项目的 Dockerfile 使用多阶段构建：

1. **client-build 阶段**: 构建 React 前端应用
2. **最终阶段**: 创建生产环境 Node.js 镜像，包含后端和前端构建产物

## 使用 Docker Compose

### 开发环境

```bash
# 构建并启动服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down

# 重新构建
docker-compose up -d --build
```

访问地址: `http://localhost:3001`

### 生产环境

生产环境使用 Nginx 作为反向代理，提供更好的性能和安全性。

```bash
# 构建并启动
docker-compose -f docker-compose.prod.yml up -d
```

访问地址: `http://localhost`

## 生产环境部署

### 配置 SSL 证书

1. 创建 SSL 目录:
```bash
mkdir -p nginx/ssl
```

2. 将 SSL 证书文件放入 `nginx/ssl` 目录:
   - `nginx/ssl/cert.pem` - 证书文件
   - `nginx/ssl/key.pem` - 私钥文件

3. 修改 `nginx/nginx.conf` 添加 HTTPS 配置（可选）

### 环境变量配置

可以通过 `docker-compose.yml` 配置环境变量:

```yaml
environment:
  - NODE_ENV=production
  - PORT=3001
  # 添加其他环境变量
```

### 数据持久化

如果需要持久化数据，可以添加 volume:

```yaml
volumes:
  - ./data:/app/data
```

## 故障排查

### 查看容器日志

```bash
# 查看特定容器日志
docker logs gobang-app

# 实时查看日志
docker logs -f gobang-app
```

### 进入容器

```bash
# 进入正在运行的容器
docker exec -it gobang-app sh
```

### 检查容器状态

```bash
# 查看所有容器状态
docker ps -a

# 查看资源使用情况
docker stats
```

### 网络问题

如果遇到连接问题，检查:

1. 端口是否正确映射
2. 防火墙是否开放相应端口
3. 容器间网络是否正常

```bash
# 检查容器网络
docker network ls
docker network inspect <network-name>
```

## 性能优化建议

1. **使用 Alpine 基础镜像** - 已在 Dockerfile 中实现
2. **多阶段构建** - 减小最终镜像大小
3. **健康检查** - 自动重启失败容器
4. **资源限制** - 在 docker-compose.yml 中设置

```yaml
deploy:
  resources:
    limits:
      cpus: '1'
      memory: 512M
    reservations:
      cpus: '0.5'
      memory: 256M
```

## 安全建议

1. 使用非 root 用户运行应用 (已实现)
2. 定期更新基础镜像
3. 使用环境变量存储敏感信息
4. 配置防火墙规则
5. 使用 HTTPS (生产环境)

## 清理

```bash
# 停止并删除容器
docker-compose down

# 删除镜像
docker rmi gobang-app

# 清理未使用的资源
docker system prune -a
```

## 支持

如有问题，请提交 Issue。
