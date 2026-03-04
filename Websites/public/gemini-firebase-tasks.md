# 给 Gemini 的操作指令 — Firebase 与 The T-Rex Game

请按下列指令协助用户完成 Firebase 相关操作。

---

## 精简版（可直接复制给 Gemini）

```
【请帮我完成以下操作】

项目：The T-Rex Game（Queering-Control-lers）
Firebase 项目 ID：elevator-game-8a4bb
当前 Hosting URL：https://elevator-game-8a4bb.web.app

请帮我：

1. 在 Firebase Hosting 中添加自定义域名，将 elevator-game-8a4bb.web.app 替换为更符合 "The T-Rex Game" 的访问地址。
2. 或指导我如何在 Firebase Console 中完成自定义域名配置（若你有权限代操作，请直接执行）。
3. 完成后告诉我新的访问地址。

我已有/将购买的自定义域名是：__________（请用户填写）

若暂时无法配置自定义域名，请给出分步操作说明，方便我在 Firebase Console 中自行完成。
```

---

## 任务列表（可按需选择）

### 任务 A：配置自定义域名

**给 Gemini 的指令：**

> 我的 Firebase 项目「The T-Rex Game」（项目 ID: elevator-game-8a4bb）当前 Hosting 地址是 elevator-game-8a4bb.web.app，我想改成自定义域名。请：
> 1. 告诉我 Firebase Console 中配置自定义域名的具体步骤（每一步要点击哪里）。
> 2. 若我的域名是 _____（请填写），请说明需要添加的 DNS 记录（类型、名称、值）。

---

### 任务 B：检查 / 更新 Hosting 配置

**给 Gemini 的指令：**

> 请帮我检查 Firebase 项目 elevator-game-8a4bb 的 Hosting 配置，确认：
> 1. 当前部署的站点和文件是否正确。
> 2. 若需要调整 firebase.json 中的 hosting 配置，请给出修改建议。

---

### 任务 C：Firestore 规则 / 数据结构

**给 Gemini 的指令：**

> The T-Rex Game 项目（elevator-game-8a4bb）需要 Firestore 存储排行榜和控制台数据。请：
> 1. 设计适合的 Firestore 集合结构（collection/document）。
> 2. 给出对应的 firestore.rules 安全规则示例。
> 3. 说明如何在前端（index.html、leaderboard.html、console.html）中读写这些数据。

---

### 任务 D：部署相关

**给 Gemini 的指令：**

> 我的项目在 Queering-Control-lers-/Websites，使用 firebase deploy 部署。请：
> 1. 确认 .firebaserc 和 firebase.json 配置是否正确。
> 2. 若部署失败，根据错误信息给出解决方案。
> 3. 部署成功后，列出所有可访问的 URL（主站、排行榜、控制台等）。

---

## 上下文信息（供 Gemini 参考）

| 项目 | 值 |
|------|-----|
| 项目显示名 | The T-Rex Game |
| Firebase 项目 ID | elevator-game-8a4bb |
| 本地路径 | Queering-Control-lers-/Websites |
| Hosting 根目录 | public |
| 页面 | index.html, leaderboard.html, console.html, gemini-instructions.html |

---

*将上方「精简版」或任意「任务」复制给 Gemini，即可让它协助操作。*
