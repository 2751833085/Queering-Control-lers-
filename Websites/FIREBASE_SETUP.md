# Firebase 配置指南 — Queering-Control-lers

本文档说明如何在 **Queering-Control-lers-/Websites** 项目中配置并使用 Firebase 项目 **The T-Rex Game**。

---

## 一、Firebase 控制台操作

### 1. 从 Firebase Hosting 移除 RitualAndArtifacts（可选）

如果之前 RitualAndArtifacts 部署在同一 Firebase 项目上，Hosting 上可能仍有旧站点。可以：

- 登录 [Firebase Console](https://console.firebase.google.com/)
- 选择项目 **elevator-game-8a4bb**
- 左侧 **Hosting** → 如有旧部署，可在列表里删除对应部署或站点（视 UI 而定）

若不再部署 RitualAndArtifacts，则不再需要做任何 Hosting 操作，Firebase 项目可继续用于新项目。

---

## 二、在新项目目录中配置 Firebase

### 2.1 进入新项目目录

```bash
cd "/Users/muyimoi/Library/Mobile Documents/com~apple~CloudDocs/我的文件/课程/帕森斯/GitHub/Queering-Control-lers-/Websites"
```

### 2.2 使用已有 Firebase 项目

如已有 Firebase 项目（例如 `elevator-game-8a4bb`），可直接关联：

```bash
firebase use elevator-game-8a4bb
```

如尚未关联，首次可执行：

```bash
firebase login
firebase init
```

在 `firebase init` 时：

- 选择：**Hosting**（以及 Firestore 等，按需选择）
- 项目：选择 **elevator-game-8a4bb**（或使用已有项目）
- 发布目录：输入 `public`（或你实际的网站根目录）
- 单页应用：按需选择 `Yes` 或 `No`

### 2.3 手动创建 Firebase 配置文件

若希望手动配置，可在 `Websites` 下创建：

**`.firebaserc`**（项目别名）：

```json
{
  "projects": {
    "default": "elevator-game-8a4bb"
  }
}
```

**`firebase.json`**（Hosting 与 Firestore 配置示例）：

```json
{
  "hosting": {
    "public": "public",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"]
  },
  "firestore": {
    "rules": "firestore.rules"
  }
}
```

如有 Firestore，可新建 **`firestore.rules`**（按需调整）：

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;  // 开发阶段，生产环境应加权限
    }
  }
}
```

---

## 三、项目结构与前端代码

### 3.1 目录结构建议

```
Websites/
├── .firebaserc
├── firebase.json
├── firestore.rules
├── public/              # 网站根目录（可改为其他）
│   ├── index.html
│   ├── app.js
│   └── ...
└── FIREBASE_SETUP.md
```

### 3.2 在前端中配置 Firebase（复用 elevator-game-8a4bb）

在 HTML 或 JS 中引入 Firebase SDK，并填入当前项目配置，例如：

```html
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore-compat.js"></script>
<script>
  var firebaseConfig = {
    apiKey: "AIzaSyCpSpPI2Ak6Ts4uMJ3tBqPPLziGDKssZGE",
    authDomain: "elevator-game-8a4bb.firebaseapp.com",
    databaseURL: "https://elevator-game-8a4bb-default-rtdb.firebaseio.com",
    projectId: "elevator-game-8a4bb",
    storageBucket: "elevator-game-8a4bb.firebasestorage.app",
    messagingSenderId: "258702222821",
    appId: "1:258702222821:web:9000b3f408dc56bfb73b0c",
    measurementId: "G-BJPXKL7YPB"
  };
  firebase.initializeApp(firebaseConfig);
  var db = firebase.firestore();
</script>
```

> 如需最新配置：Firebase Console → 项目设置 → 常规 → 你的应用 → SDK 片段与配置。

---

## 四、常用命令

| 操作           | 命令                     |
|----------------|--------------------------|
| 本地预览       | `firebase serve`         |
| 部署到 Hosting | `firebase deploy`        |
| 仅部署 Hosting | `firebase deploy --only hosting` |
| 仅部署 Firestore 规则 | `firebase deploy --only firestore:rules` |
| 查看当前项目   | `firebase projects:list` |
| 切换项目      | `firebase use <项目ID>`  |

---

## 五、关于 RitualAndArtifacts 的说明

RitualAndArtifacts 已完成迁移为本地运行版本：

- 已移除所有 Firebase 相关代码
- 已删除 `.firebaserc`、`firebase.json`、`firestore.rules`
- 游戏仅在本地运行，使用 `localStorage` 存储统计
- 运行方式：使用任意静态服务器（如 `npx serve public`）打开 `public` 目录

---

## 六、常见问题

**Q: 如何在同一 Firebase 项目下部署多个站点？**

A: 在 `firebase.json` 的 `hosting` 中配置多个 `site`，并为每个站点指定 `target`，例如：

```json
"hosting": [
  {
    "target": "queering-controllers",
    "public": "public",
    "ignore": ["firebase.json", "**/.*"]
  }
]
```

然后执行：`firebase target:apply hosting queering-controllers <site-id>`

**Q: 新项目需要单独创建 Firebase 项目吗？**

A: 不必须。可继续使用 `elevator-game-8a4bb`，只需在同一项目中配置多个 Hosting 站点或不同 Firestore 集合即可。
