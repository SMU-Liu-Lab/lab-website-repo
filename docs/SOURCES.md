# 内容来源与核验

核验日期：2026-09-16。页面为简体中文概括，不冒充学校官网原文。实验室展示名暂采用“Liu Lab · 刘黔伟实验室”。

## 导师

[南方医科大学官方导师主页](https://yjsxt.smu.edu.cn/Open/TeacherInfo.aspx?id=dTeWZWZZ9gDZ!lbvXlQPSw==)，网页显示更新于 2026-01-09。通过 HTTPS 直接获取 HTML 成功（web.open 抓取失败未作内容依据）。

核实：中文姓名刘黔伟，教授，博士导师，南方医科大学南方医院；英文简介为血液科。正文列出用户提供的邮箱 `qianweiliu@smu.edu.cn`，与摘要表中旧 Outlook 邮箱不同，网站采用用户提供且正文证实的学校邮箱。研究方向是血液病/肿瘤临床流行病学、克隆性造血（CHIP）及癌前状态、心理肿瘤学。硕士/博士/博士后指导、Karolinska Institutet 合作和通信地址均来自官网正文。

官网照片见 `ASSET_SOURCES.md`，从官网原始图片地址下载，未改动肖像。没有增加未经来源支持的头衔、教育经历、课题经费、获奖、论文数量或成员。

## 论文

使用 NCBI Entrez 技能检索并逐篇读取 PubMed efetch 记录。以下均包含 Qianwei Liu 和其南方医院血液科对应单位。姓名之外还以邮箱、ORCID 和单位交叉核验；未宣称其为第一作者/通讯作者。中文主题为标题概括，不是临床建议。

| PMID / 链接 | 期刊 / 年份 | DOI | 归属证据 |
|---|---|---|---|
| [42570703](https://pubmed.ncbi.nlm.nih.gov/42570703/) | Clinical Medicine (London), 2026 | 10.1016/j.clinme.2026.100635 | Qianwei Liu + 南方医院血液科 + qianweiliu@smu.edu.cn |
| [42185299](https://pubmed.ncbi.nlm.nih.gov/42185299/) | Nature Communications, 2026 | 10.1038/s41467-026-73530-1 | Qianwei Liu + 南方医院血液科 + ORCID 0000-0002-4687-100X |
| [41981103](https://pubmed.ncbi.nlm.nih.gov/41981103/) | Leukemia, 2026 | 10.1038/s41375-026-02946-x | Qianwei Liu + 南方医院血液科 + 学校邮箱 + 同一 ORCID |
| [41296017](https://pubmed.ncbi.nlm.nih.gov/41296017/) | Blood Advances, 2026 | 10.1182/bloodadvances.2024015776 | Qianwei Liu + 南方医院血液科及广东省相关血液病研究中心 |
| [40787700](https://pubmed.ncbi.nlm.nih.gov/40787700/) | American Journal of Hematology, 2025 | 10.1002/ajh.70028 | Qianwei Liu + 南方医院血液科 + 同一 ORCID |
| [40264090](https://pubmed.ncbi.nlm.nih.gov/40264090/) | BMC Medicine, 2025 | 10.1186/s12916-025-04077-z | Qianwei Liu + 南方医院血液科 + 学校邮箱 |
| [40038140](https://pubmed.ncbi.nlm.nih.gov/40038140/) | European Journal of Epidemiology, 2025 | 10.1007/s10654-025-01207-y | Qianwei Liu + 南方医院血液科/KI + 学校邮箱 + 同一 ORCID |
| [39764177](https://pubmed.ncbi.nlm.nih.gov/39764177/) | EClinicalMedicine, 2024 | 10.1016/j.eclinm.2024.102753 | Qianwei Liu + 南方医院血液科及广东省相关血液病研究中心 |

年份按期刊正式发表/卷期处理，非简单按 PMID 或上线检索时间推断。41296017 使用正式卷期 2026，39764177 正式发表年份为 2024。

排除同名材料化学论文 PMID 38419359（Ostwald ripening for designing time-dependent crystal hydrogels），其作者单位不能对应用户指定身份。页面的 PubMed 检索入口是方便继续检索，并不表示所有同名结果都属于本实验室。

## 平台

六个网址、大小写与功能描述以用户粘贴的部署清单为基础。HTTPS GET 全部返回 HTTP 200；前四个请求仅返回 Streamlit 引导页，单凭该响应不能证明应用功能正常或确认具体内容。后两个页面的标题及科研演示说明与用户描述一致。未上传材料、运行分析或修改任何远程服务。

CHIP Search 的清单描述为 ChIP-seq 检索，但后续通过真实浏览器成功加载了应用正文：标题为 **CHIP Risk Explorer**，页面显示“CHIP 风险可视化与查询”“基于分组（性别/年龄/基因突变）的疾病风险展示”，包含 OR 风险因素 Top10、全部疾病 OR、性别/年龄/基因突变/疾病类型筛选及风险结果。因此网站根据实际页面纠正为 CHIP 风险查询与森林图，不再写 ChIP-seq。仅观察默认页面，没有操作筛选、下载或运行分析。

## 模板与设计参考

- [Allan Lab 网站模板说明](https://www.allanlab.org/aboutwebsite.html)：MIT 许可，基于 Jekyll/Bootstrap。
- [Allan Lab 源码](https://github.com/mpa139/allanlab)。
- [Caltech Van Valen Lab](https://www.vanvalen.caltech.edu/) 及[模板来源说明](https://www.vanvalen.caltech.edu/aboutwebsite.html)。

借鉴学术站点“研究、导师/成员、论文”等信息组织及数据与模板分离的维护方式。本项目没有复制模板代码、文案、图片或机构标志；使用原生 HTML/CSS/JavaScript 重新实现，方便现有 Nginx 静态部署。
