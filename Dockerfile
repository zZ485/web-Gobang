# 阶段1: 构建前端
FROM node:18-alpine AS client-build

WORKDIR /app/client

# 复制前端依赖文件
COPY client/package*.json ./

# 安装依赖
RUN npm ci --only=production

# 复制前端源代码
COPY client/ ./

# 构建前端
RUN npm run build

# 阶段2: 构建后端镜像
FROM node:18-alpine

WORKDIR /app

# 安装 dumb-init 用于信号传递
RUN apk add --no-cache dumb-init

# 复制后端依赖文件
COPY server/package*.json ./server/

# 安装后端依赖
WORKDIR /app/server
RUN npm ci --only=production

# 复制后端源代码
COPY server/ ./

# 从前端构建阶段复制构建产物
COPY --from=client-build /app/client/dist /app/client/dist

# 创建非root用户
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

USER nodejs

# 暴露端口
EXPOSE 3001

# 设置环境变量
ENV NODE_ENV=production
ENV PORT=3001

# 使用 dumb-init 启动应用
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "src/server.js"]
