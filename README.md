# Inkwell 📝

> 一款跨平台的 Markdown 博客写作工具 —— 支持 Web、桌面端（Electron）与移动端（Capacitor）

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite)](https://vitejs.dev/)

## 简介

Inkwell 是一个基于 React + TypeScript + Vite 构建的 Markdown 博客写作与管理工具。项目采用统一的前端代码库，通过 Electron 打包为桌面应用，通过 Capacitor 打包为 Android / iOS 移动应用，并支持以 PWA 形式在浏览器中离线使用，让你在任意设备上都能随时记录和整理博客草稿。

## ✨ 功能特性

- **Markdown 编辑与实时预览**：基于 `react-markdown`、`remark-gfm` 和 `rehype-highlight`，支持 GFM 语法与代码高亮
- **本地优先存储**：使用 IndexedDB（`idb`）在本地保存文章数据，无需联网即可写作
- **跨平台支持**：
  - 🌐 Web / PWA（可安装、离线可用）
  - 🖥️ 桌面端（Windows / macOS / Linux，基于 Electron）
  - 📱 移动端（Android / iOS，基于 Capacitor）
- **轻量状态管理**：使用 `zustand` 管理应用状态
- **现代化 UI**：`lucide-react` 图标 + Tailwind CSS

## 🛠 技术栈

| 分类 | 技术 |
| --- | --- |
| 前端框架 | React 18 + TypeScript |
| 构建工具 | Vite 6 |
| 样式 | Tailwind CSS |
| 路由 | React Router |
| 状态管理 | Zustand |
| 本地存储 | IndexedDB (idb) |
| Markdown 渲染 | react-markdown / remark-gfm / rehype-highlight |
| 桌面端 | Electron + electron-builder |
| 移动端 | Capacitor (Android / iOS) |
| PWA | vite-plugin-pwa |

## 📦 快速开始

### 环境要求

- Node.js 18+
- pnpm

### 安装依赖

```bash
pnpm install
```

### 本地开发（Web）

```bash
pnpm dev
```

访问 [http://localhost:5173](http://localhost:5173) 即可查看效果。

### 本地开发（桌面端 / Electron）

```bash
pnpm electron:dev
```

### 构建

```bash
# 构建 Web 产物
pnpm build

# 构建桌面端安装包（Windows / macOS / Linux）
pnpm electron:build

# 构建 Android 应用
pnpm capacitor:sync
pnpm capacitor:build:android
```

### 代码检查

```bash
pnpm lint    # ESLint 检查
pnpm check   # TypeScript 类型检查
```

## 📁 项目结构

```
Blog-Post-Push/
├── electron/          # Electron 主进程代码
├── public/            # 静态资源
├── src/               # 前端源码（React + TypeScript）
├── .github/workflows/ # CI/CD 工作流
├── capacitor.config.ts
├── vite.config.ts
└── package.json
```

## 🤝 贡献

欢迎提交 Issue 或 Pull Request 来完善这个项目！

## 📄 License

本项目基于 [MIT License](LICENSE) 开源。
