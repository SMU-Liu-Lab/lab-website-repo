# 交给 OpenClaw 的部署提示词

请直接在我现有的阿里云服务器上完成 Liu Lab 实验室网站部署，不要只给操作建议。

**目标与已授权范围**

- 从 `git@github.com:SMU-Liu-Lab/lab-website-repo.git` 拉取 `main` 分支。
- 将仓库的 `server.mjs` 运行在 **127.0.0.1:8507**。
- 参考现有 **8504（RareDipper）** 的部署用户、目录组织与 **systemd 用户服务**管理方式，新增 `liulab-website.service`，实现开机启动和异常自动重启。
- 通过现有 Nginx 让 **https://liulab-genome.com/** 直接显示实验室首页，替换目前跳转 `/virtualcell/` 的根路径规则；静态资源 `/lab-assets/` 也反代到 8507。
- 我已授权下载代码、创建该服务、按需为同一部署用户启用 linger、修改上述 Nginx 路由并 reload；这些范围内直接实施，不必重复征求确认。不要改动其他网站的端口、数据或服务。

**执行步骤**

1. 先只读检查 8504 的真实 unit、运行用户、部署目录、Node.js 可用路径、8507 占用情况和当前 Nginx 有效配置，记录六个已有站点的访问基线。备份要改动的配置与同名 service；备份放在不会被 Nginx include 自动加载的位置。8507 如已被其他服务占用，先报告，不结束未知进程。
2. 把仓库检出到合适的新目录，建议该用户的 `~/apps/lab-website-repo`。若目录已存在，确认 origin 和工作树，保护本地修改，仅 fast-forward 更新，不删除目录或强制重置。SSH 不可用时可用同一仓库 HTTPS 地址及已有认证，不泄露凭据。记录 commit SHA。
3. 阅读仓库 `README.md`、`deploy/ALIYUN.md`、`deploy/liulab-website.service`、`deploy/nginx-homepage.conf`。这是原生静态页面加 Node.js 内置 HTTP 服务，**不是 Streamlit 应用**；“像 8504”指服务管理与反代方式。无需 npm 安装和构建。复用现有 Node.js 18+，优先受支持 LTS，不升级替换其他应用运行时。执行语法检查和 `node --test test/server.test.mjs`。
4. 按真实的 node 绝对路径和仓库目录调整 unit，在与 8504 相同的用户下安装并 `systemctl --user enable --now liulab-website.service`。核验 user manager、enabled/active、linger 和日志。服务仅监听环回地址，不把 8507 暴露公网，不新增安全组端口。
5. 先验证 `http://127.0.0.1:8507/`、HEAD 和全部静态资源正常。随后将仓库 Nginx 片段合入已有 HTTPS server：只替换精确根路径 `location = /`，新增/调整 `location ^~ /lab-assets/`。`proxy_pass http://127.0.0.1:8507;` **不加末尾斜杠**，保留资源路径。检查已有 server 级跳转规则，不能制造重复 location。不要整体覆盖配置。
6. 保留证书、Certbot、HTTP 自动跳 HTTPS、www 处理及六个原有子路径的代理和 WebSocket 设置。`nginx -t` 成功后才 reload Nginx。**不要重启 gateway 或整机**，因为现有 8505（械审知行）仍挂在 gateway 下。
7. 核验公网首页返回 200 且显示 Liu Lab，CSS/JS/图片正确加载，手机和桌面布局及入口正常。逐一回归原有路径：`/virtualcell/`、`/chip-search/`、`/HLA-disease/`、`/RareDipper/`、`/medreview/`、`/drugreview/`；保留大小写，不只检查首页。确认 HTTP/HTTPS/www 与证书正常。如仅旧浏览器还跳 Virtual Cell，检查历史 301/308 缓存，用无痕窗口与 curl 对照，不能改坏原 Virtual Cell 入口。
8. 如切换验证失败，恢复备份，先 `nginx -t` 再 reload；仅处理本次新增/更新的实验室主页服务，原六个应用保持运行。不要关闭共享部署用户已启用的 linger。

**完成后给我**：公网地址、部署目录、commit SHA、部署用户、服务名称与 active/enabled/linger 状态、8507 实际监听地址、Nginx 修改位置、六个旧站回归结果，以及查看日志、更新和回滚的方法。遇到真实权限或认证缺口再告诉我缺什么；不要把未执行的检查报告为通过。
