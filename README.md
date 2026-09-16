# Liu Lab · 刘黔伟实验室

面向南方医科大学南方医院血液科的实验室门户。静态页面由 Node.js 服务监听 `127.0.0.1:8507`，使用与既有 8504 应用相同的 systemd 用户服务管理方式，经现有 Nginx 接入 `https://liulab-genome.com/`。无数据库、无 npm 依赖，不改动原有 8501–8506 服务。

仓库：`git@github.com:SMU-Liu-Lab/lab-website-repo.git`，分支 `main`。

## 内容

- 首页与六个平台快捷入口
- 成果与科研工具：Virtual Cell、CHIP Search、HLA Disease Database、RareDipper、械审知行、药审知行
- 三个研究方向、导师介绍、学校官网照片与联系方式
- 8 篇经 PubMed 作者单位／邮箱／ORCID 核验的精选论文
- 成员板块：当前留空，显示待更新文案

## 本地预览

在此目录运行 `node preview.mjs`，然后打开 http://127.0.0.1:4173 。也可直接双击 `dist/index.html` 查看。

## 内容维护

1. 平台链接、简介、论文与成员：编辑 `dist/lab-assets/content.js`。
2. 导师文字、研究方向、联系地址：编辑 `dist/index.html`。
3. 配色、版式和手机适配：编辑 `dist/lab-assets/styles.css`。
4. 将 `members: []` 改为下列格式即可增加成员；名字和简介请使用真实内容：

```js
members: [
  { name: '真实姓名', role: '博士研究生', description: '研究方向简介' }
],
```

论文新增条目使用 `year`、`title`、`journal`、`pmid`、`doi`、`topic` 字段。维护者应核验作者身份；不把同名作者论文直接加入，不从作者排序推断共同第一或通讯作者。

## 部署

在服务器检出仓库后，用现有 Node.js 18+（优先受支持的 LTS）执行 `node server.mjs`，默认监听 `127.0.0.1:8507`；不需要 `npm install` 或构建。生产运行由 systemd 管理，不使用 `preview.mjs`。

- 完整操作说明：`deploy/ALIYUN.md`
- systemd 用户服务模板：`deploy/liulab-website.service`
- Nginx 反代片段：`deploy/nginx-homepage.conf`
- 可直接交给 OpenClaw 的提示词：`deploy/OPENCLAW_PROMPT.md`

用户已授权把域名根路径改为本主页；实际服务器下载、启动和切换由 OpenClaw 执行。本仓库准备与 Git 同步不代表生产服务器已上线。

## 检查

`npm run check` 检查 JS 语法；`npm test` 检查静态资源、HEAD、方法限制、路径隔离及环回监听。均不需要安装依赖。

## 证据与素材

- `docs/SOURCES.md`：导师、论文、模板及平台说明来源。
- `docs/ASSET_SOURCES.md`：官网照片来源、生成式装饰图提示词。
- `docs/VALIDATION.md`：本次实际完成的检查及其边界。

视觉与布局为本项目重新实现，仅参考 Allan Lab 模板的学术内容组织；未复制其源码或校徽。首页细胞图是 AI 生成的概念装饰图，不是实验数据。站点不依赖外部字体/CDN，所有页面资源随 `dist/` 交付。
