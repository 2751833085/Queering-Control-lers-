# Firebase 项目策略 — 一个项目，多个 Web App

## 策略说明

使用 **一个 Firebase 项目**，通过 **创建多个 Web App** 来容纳不同的游戏/子项目：

```
Firebase 项目（如 elevator-game-8a4bb）
├── Web App 1: The T-Rex Game     → appId: ...web:xxx, measurementId: G-xxx
├── Web App 2: 未来项目 A          → 新建 Web App 即可
└── Web App 3: 未来项目 B          → 新建 Web App 即可
```

### 优点

- 共享 Firestore、Hosting、Auth 等资源
- 每个 Web App 有独立的 Analytics（measurementId）
- 无需创建新 Firebase 项目
- 配置管理更简单

### 添加新项目时

1. Firebase Console → 项目设置 → 常规
2. 在「你的应用」中点击 **添加应用** → 选择 Web (</>)
3. 注册并获取新的 `firebaseConfig`（appId、measurementId 会不同）
4. 将新 config 填入对应项目的 `firebase-config.js`

### Hosting 多站点（可选）

若不同项目需要不同 URL，可在同一项目中创建多个 Hosting 站点：

- 默认站点：`elevator-game-8a4bb.web.app`
- 站点 2：`t-rex-game-xxx.web.app`
- 在 `firebase.json` 中用 `target` 指定部署目标

---

*本策略适用于：多个游戏/项目共用同一 Firebase 后端，各自有独立前端与 Analytics。*
