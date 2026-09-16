# 阿里云：8507 + systemd 用户服务 + Nginx

## 目标

- 仓库：`git@github.com:SMU-Liu-Lab/lab-website-repo.git`，分支 `main`。
- 本地后端：`http://127.0.0.1:8507`，由 `server.mjs` 提供静态页面。
- 用户服务：`liulab-website.service`，开机启动、异常自动重启，参考当前 8504 应用的用户及管理方式。
- 公网：首页 `https://liulab-genome.com/`；静态资源 `/lab-assets/`。
- 原有六个应用维持原路径、端口、服务和数据库，不需要停止或重启。尤其不要重启承载 8505 的 gateway。

此方案按用户最新授权替换此前直接用 Nginx 读取静态文件的方案。源码同步不代表服务器已经部署。

## 1. 读取现状、建立回滚点

确认 8504 的 systemd 用户服务属于哪个用户、实际目录组织、user manager 及 linger 状态。检查 8507 是否已占用，不能终止不明进程。读取 `nginx -T` 的有效配置，定位处理主域名的 HTTPS server、根路径跳转及 www 策略。

记录六个应用当前 HTTP 状态与页面标题作为基线。备份实际要修改的 Nginx 文件、任何同名 service 及现有主页版本；Nginx 备份存入不被 include 通配符加载的目录。若有已有 checkout 的未提交修改，先保留并报告，不覆盖。

## 2. 获取代码与 Node.js

在与 8504 相同的部署用户下检出仓库。建议路径 `~/apps/lab-website-repo`，可根据现有目录调整。

```bash
mkdir -p ~/apps
git clone --branch main git@github.com:SMU-Liu-Lab/lab-website-repo.git ~/apps/lab-website-repo
cd ~/apps/lab-website-repo
git rev-parse HEAD
command -v node
node --version
node --check server.mjs
node --test test/server.test.mjs
```

如该目录已是对应仓库，应核对 origin 和工作树，再 `git pull --ff-only origin main`。如 SSH 不可达，可使用同一仓库的 HTTPS 地址 `https://github.com/SMU-Liu-Lab/lab-website-repo.git`，仅复用已有认证；不要把令牌写入 remote。不要删除或强制重置现有目录。

Node.js 要求 18+，优先复用现有受支持 LTS。无第三方包，无需 `npm install` 或运行构建。不覆盖升级服务器其他项目使用的运行时。

## 3. 安装用户服务

根据 `command -v node` 得到的真实绝对路径及检出目录调整 `deploy/liulab-website.service`，安装到该用户 `~/.config/systemd/user/liulab-website.service`。模板中的 `/usr/bin/node` 只是常见路径；若 Node 由 nvm 安装，需要使用其真实绝对路径。user unit 中不添加 `User=`。

在正确的用户 systemd 会话中执行：

```bash
systemctl --user daemon-reload
systemctl --user enable --now liulab-website.service
systemctl --user status liulab-website.service --no-pager
journalctl --user -u liulab-website.service -n 50 --no-pager
```

用 `loginctl show-user <部署用户名> -p Linger` 检查。为确保退出会话及重启后继续运行，若尚未启用，使用必要的管理员权限执行 `loginctl enable-linger <部署用户名>`。已有 8504 若已满足这点，无需重复修改。不要改系统其他服务的启动模式；回滚时也不要关闭共用用户的 linger。

确认 `ss -ltnp` 显示只监听 `127.0.0.1:8507`，不是 `0.0.0.0:8507` 或 `[::]:8507`。不新增云安全组或防火墙入站端口。通过 `curl -fsS http://127.0.0.1:8507/` 及所有 `/lab-assets/` 文件核实响应，`curl -I` 验证 HEAD。服务本地健康后再改 Nginx。

## 4. 合并 Nginx

把 `deploy/nginx-homepage.conf` 的两个 location 合入**现有 HTTPS server 块**：

1. `location = /` 精确根路径替换原来跳往 `/virtualcell/` 的规则。
2. `location ^~ /lab-assets/` 转发静态资源；`proxy_pass http://127.0.0.1:8507;` 不带末尾斜杠，保留完整上游资源路径。

不要整个覆盖 nginx.conf/server，不新增重复 `location = /`，不要加入接管所有子路径的 SPA fallback。若存在 server 级根路径 return/rewrite，应按实际作用域调整；保留 HTTP→HTTPS、证书、Certbot、www 策略及所有原有 proxy/WebSocket 配置。

```bash
sudo nginx -t
# 仅在上面的检查成功后：
sudo systemctl reload nginx
```

## 5. 核验与反馈

- 公网根路径 200，HTML 包含 Liu Lab 和刘黔伟，不再跳往 Virtual Cell。
- CSS、JS、官网照片与细胞主题图均 200，Content-Type 正确。资源位于 `/lab-assets/`。
- 桌面/手机页面、导航、六个平台按钮、论文链接可用。
- 分别回归 `/virtualcell/`、`/chip-search/`、`/HLA-disease/`、`/RareDipper/`、`/medreview/`、`/drugreview/`，与基线对照，不仅检查根域名。
- HTTP 仍跳 HTTPS，www 保持现有策略；证书正常。
- `systemctl --user is-active/is-enabled liulab-website.service` 和 linger 状态正确。不通过重启整机来测试。
- 如果 curl 已正确而旧浏览器仍跳 Virtual Cell，可能是历史 301/308 缓存；用无痕窗口或清理该域名重定向缓存验证，不修改 `/virtualcell/` 的正常入口来绕过缓存。

交付时报告检出的 commit、实际目录、服务用户/名称、监听地址、Nginx 修改位置、检查结果、备份及回滚方法。不能把未执行的公网或应用功能检查说成通过。

## 更新与回滚

后续更新记录当前 commit，确认工作树干净后 fast-forward 拉取，运行检查，再只重启 `liulab-website.service`。有工作树修改或历史分叉时先保留状态，不强制覆盖。

若本次上线失败，恢复修改前 Nginx 备份，`nginx -t` 成功后 reload；新建的本服务可以停止，原六个应用不动。若是更新已有本服务，恢复之前的 service 和已记录版本（保留用户修改），重新加载 user unit 并仅重启本服务。不要删除任何应用目录或数据库。

参考：[Nginx proxy_pass 文档](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_pass)、[systemd loginctl 源文档](https://github.com/systemd/systemd/blob/main/man/loginctl.xml)。
