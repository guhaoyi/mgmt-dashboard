# Task Plan: 经营管理报表数据看板

## Goal
将飞书电子表格中的经营管理报表数据，做成一个可交互的前端数据看板，支持时间筛选、项目筛选、多维度数据分析，部署到 GitHub Pages。

## Current Phase
Phase 3

## Phases

### Phase 1: 数据理解与需求分析
- [x] 读取飞书表格全部数据
- [x] 分析数据结构（三层树形：大类→分类→明细）
- [x] 梳理关键指标和数据特点
- [x] 记录到 findings.md
- **Status:** complete

### Phase 2: 看板设计
- [x] 确定看板整体架构（单页应用，纯前端）
- [x] 设计页面布局和交互方式
- [x] 确定技术栈（HTML + CSS + JS + Chart.js）
- [x] 确定视觉风格（frontend-design skill 指导）
- **Status:** complete

### Phase 3: 前端开发
- [ ] 数据层：将表格数据转为 JSON，嵌入页面
- [ ] 筛选器：时间范围选择、项目/分类筛选
- [ ] 核心看板页面：
  - Tab1: 总览（收入/成本/利润趋势 + KPI卡片）
  - Tab2: 前端分析（各平台收入、成本构成、毛利）
  - Tab3: 后端分析（各平台收入、成本构成、毛利）
  - Tab4: 费用分析（人力成本、运营管理费明细）
  - Tab5: 利润分析（前后端对比、净利润瀑布图）
- [ ] 响应式布局 + 深色主题
- **Status:** in_progress

### Phase 4: 测试与优化
- [ ] 数据准确性验证（对照原表格）
- [ ] 交互体验优化
- [ ] 移动端适配检查
- **Status:** pending

### Phase 5: 部署交付
- [ ] 推送到 GitHub Pages
- [ ] 交付给大宝总
- **Status:** pending

## Decisions Made
| Decision | Rationale |
|----------|-----------|
| 纯前端单文件 HTML | 和之前 biz-dashboard 一致，部署简单，GitHub Pages 直接用 |
| Chart.js 图表库 | 轻量、交互好、CDN 加载，不需要构建工具 |
| 深色主题 + 金融风 | 经营数据看板，专业感强，深色减少视觉疲劳 |
| 5个Tab分区 | 数据量大，按业务逻辑分区，避免信息过载 |
| 数据内嵌JSON | 不依赖后端API，离线可用，加载快 |

## Errors Encountered
| Error | Attempt | Resolution |
|-------|---------|------------|

## Notes
- 数据覆盖 2025年1月~2026年3月（15个月）
- 有赞、快手小店等部分平台数据不完整，图表需处理null值
- 净利润波动大，需要突出显示异常月份
