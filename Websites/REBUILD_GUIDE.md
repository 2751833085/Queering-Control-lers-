# 新项目重建指南 — The T-Rex Game

你已删除旧项目并创建了新的 Firebase 项目。按下列步骤完成配置。

> **策略提醒**：一个 Firebase 项目可包含多个 Web App。未来若有新项目，在项目设置中「添加应用」即可，无需新建 Firebase 项目。详见 `FIREBASE_STRATEGY.md`。

---

## 一、你需要准备的信息

请从 **Firebase Console** 获取以下内容，并发给 Cursor（或填到下方）：

### 1. 项目 ID

- 打开 [Firebase Console](https://console.firebase.google.com/)
- 选择新项目「The T-Rex Game」
- 点击 ⚙️ 项目设置 → 顶部「项目 ID」一栏即为项目 ID（例如 `the-t-rex-game-xxxxx`）

**发给 Cursor：** `项目 ID：_______________`

---

### 2. Web 应用配置

- Firebase Console → 项目设置 → 常规 → 往下找到「你的应用」
- 若尚未添加 Web 应用，点击「添加应用」→ 选择 Web (</>) → 注册
- 复制出现的 `firebaseConfig` 对象，例如：

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "xxx.firebaseapp.com",
  databaseURL: "https://xxx-default-rtdb.firebaseio.com",
  projectId: "xxx",
  storageBucket: "xxx.firebasestorage.app",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:xxxxxxxx",
  measurementId: "G-XXXXXXXX"
};
```

**发给 Cursor：** 直接粘贴完整的 `firebaseConfig` 对象。

---

### 3. Hosting 站点 ID（如已创建多站点）

若你创建了多个 Hosting 站点，需要指定要部署到哪个：

- Firebase Console → Hosting → 查看站点列表
- 每个站点有一个 ID，例如 `t-rex-game-8a4bb-f5af9`

**发给 Cursor：** `Hosting 站点 ID：_______________`  
（若只有一个默认站点，可不填，我会用默认配置。）

---

### 4. Firestore 与 Hosting 是否已启用

- Firestore：在 Console 左侧是否有「Firestore Database」
- Hosting：是否有「Hosting」

若未启用，先按提示完成初始化。

---

## 二、发给 Cursor 的模板消息

复制以下内容，填好空格后发给 Cursor：

```
【新 Firebase 项目配置】

我删除了旧项目，已创建新的 Firebase 项目 The T-Rex Game，请帮我更新本地配置。

1. 项目 ID：_____________________

2. Web 应用 firebaseConfig（完整复制 Firebase Console 中的配置）：
   （粘贴 firebaseConfig 对象）

3. Hosting 站点 ID（若有多个站点需指定）：_____________________
   （若只有一个默认站点可留空）

4. 是否需要启用 Analytics：是 / 否
```

---

## 三、给 Gemini 的协作说明

复制以下内容发给 Gemini，让它协助完成控制台和说明类工作：

```
【请协助我完成 Firebase 新项目配置】

我已删除旧的 elevator-game-8a4bb 项目，创建了新的 Firebase 项目 The T-Rex Game。

请帮我：

1. 确认 Firestore、Hosting 是否已正确启用；若未启用，给出分步操作说明。

2. 若我创建了多个 Hosting 站点，请说明如何在 firebase.json 和 .firebaserc 中指定目标站点进行部署。

3. 给出从零初始化 Firebase 项目的命令行步骤（firebase login、firebase init 等）。

4. 代码实现部分我会交给 Cursor，请只提供配置说明和操作步骤，不要直接修改项目文件。
```

---

## 四、Cursor 将帮你完成的事

收到你提供的信息后，Cursor 会：

1. 更新 `.firebaserc` 中的项目 ID
2. 更新 `public/firebase-config.js` 中的完整 Firebase 配置
3. 若有 Hosting 站点 ID，更新 `firebase.json` 和 `targets` 配置
4. 执行 `firebase deploy` 并确认是否成功
5. 告诉你最终的访问地址

---

## 五、快速检查清单

- [ ] 新项目已在 Firebase Console 中创建
- [ ] 已添加 Web 应用并拿到 firebaseConfig
- [ ] Firestore 已启用（若需要）
- [ ] Hosting 已启用
- [ ] 已执行 `firebase login` 并选择正确账号
- [ ] 已将项目 ID 和 firebaseConfig 发给 Cursor
