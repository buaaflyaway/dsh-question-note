# dsh-question-note

[![npm version](https://img.shields.io/npm/v/dsh-question-note.svg)](https://www.npmjs.com/package/dsh-question-note)
[![license](https://img.shields.io/npm/l/dsh-question-note.svg)](LICENSE)

DSH（DeepSeek Harness）「交互式问答」弹窗增强插件：**用户点选某个选项后，在该选项正下方出现一个可选的补充说明输入框；填写的内容与选中的选项一并传给模型。**

## 效果

- 原版弹窗的样式、功能、交互全部保留（组件是官方 `QuestionComposer` 的忠实移植，同一套 CSS 令牌与几何）。
- **补充说明按选项独立存储**：每个被选中的选项下方各有一个自己的补充输入框，互不共享、不随勾选变化移动；取消勾选时输入框隐藏，文字保留（重新勾选会恢复）。单选题换选选项时同理，各选项各记各的。
- 提交时答案格式不变：`{ "answers": [ { "id": "...", "selected": ["选项文字"], "custom": "…" } ] }`。`custom` 的组装规则：单选 = 补充文本原文；多选 = 每个有补充的选项一行、格式「选项文字: 补充」（模型可分清哪句对应哪个选项）；底部自由回答行若有内容追加在最后。不填补充说明时行为与原版完全一致。
- 底部「其他（自定义输入）」行保留，是独立的自由回答入口（单选打字清空已选 = 原版语义；多选与勾选并存 = 原版语义）。
- 计划审查（plan-review）类卡片、审批卡片、超时后续答、已结算回答回看等全部由官方组件处理，本插件不接管。

## 与原版的唯一行为差异

启用后，**单选点选项不再自动跳到下一题**（原版会跳，但那会让用户没机会填写补充说明），而是停留在当前题并展开输入框；在输入框里回车或点「下一题」按钮进入下一题，最后一题回车即提交。

## 实现原理（面向二次开发者）

- 纯客户端 Cordis 插件：浏览器半往 `conversation.composer` 链式槽以 `priority: -10`（官方在默认 0）注册增强版组件，链选举「数值小者先跑、第一个 select 非 null 者胜出」，因此增强版先被询问并接管通用问题卡的渲染；官方插件的卡片注册、倒计时、投影、续答机制原样复用（`src/client/carrier.ts` 以结构化方式消费官方载体对象）。
- 鸭子类型失配时 `select` 返回 null → 安全降级为官方弹窗（功能缺失但弹窗可用）。
- 合并方案零协议改动：宿主端 `userQuestions.answer()` 只校验「每题恰好回答一次」，不禁止 `selected` 与 `custom` 并存；工具结果与超时续答消息都是原样 JSON 透传。

## 开发与安装

```sh
pnpm install
pnpm run build     # 产出 lib/index.js（宿主半）与 lib/client.js（浏览器半）
pnpm run check     # 产物语法检查

# 安装到 desktop 配置（会写入 dsh.profile.bundles，需重启 DSH 生效）
dsh plugin --profile desktop add <本目录路径或 npm 包名>
```

## 版本兼容

针对 DSH 0.2.0-rc 族（`@deepseek-ai/*` peer `^0.2.0-rc.1`）。官方弹窗组件内部结构若在后续版本变化，需同步调整 `src/client/carrier.ts` 的结构匹配与 `src/client/composer.tsx` 的移植。
