# Task Plan: 经营管理报表数据看板

## Goal
将飞书电子表格中的经营管理报表数据，做成可交互的前端数据看板，支持时间筛选、多维度数据分析。

## Current Phase
Phase 5 ✅ COMPLETE

## Phases

### Phase 1: 数据理解与需求分析
- [x] 读取飞书表格全部数据
- [x] 分析数据结构（三层树形：大类→分类→明细）
- [x] 梳理关键指标和数据特点
- **Status:** complete

### Phase 2: 看板设计
- [x] 确定看板整体架构（单页应用，纯前端）
- [x] 设计页面布局和交互方式
- [x] 确定技术栈（HTML + CSS + JS + Chart.js + datalabels）
- [x] 确定视觉风格（深色金融风）
- **Status:** complete

### Phase 3: V1 前端开发
- [x] 数据层：表格数据转 JSON 内嵌
- [x] 5个Tab基础图表
- [x] 筛选器：时间范围 + 快捷按钮
- **Status:** complete (有tooltip bug)

### Phase 4: V2 全面升级
- [x] 扩展到7个Tab / 42个图表
- [x] 引入 datalabels 插件，关键图表直接显示数字
- [x] 所有图表统一 interaction mode: index
- [x] 添加 crosshair 竖向虚线插件
- [x] tooltip 显示完整金额
- [x] 新增维度：平台集中度、获客成本率、费用率、异常监控、YoY同比
- **Status:** complete

### Phase 5: 部署与文档
- [x] GitHub Pages 部署
- [x] 设计规范文档（供后续看板复用）
- [x] 合并方案文档（总看板架构）
- [x] 完整 README.md
- **Status:** complete

## Decisions Made
| Decision | Rationale |
|----------|-----------|
| 纯前端单文件 HTML | 部署简单，GitHub Pages 直接用 |
| Chart.js + datalabels | 轻量、交互好、数据标签支持 |
| 深色主题 + 金融风 | 经营数据看板，专业感强 |
| 7个Tab分区 | 总览/前端/后端/成本/人力/运营/利润，按业务逻辑分区 |
| 数据内嵌JSON | 不依赖后端API，离线可用 |
| crosshair插件 | 竖向虚线提升数据定位体验 |
| interaction mode:index | 统一悬浮显示同月所有数据 |

## Notes
- 此看板的设计规范已作为标准，后续新看板按此风格执行
- 合并总看板方案见 README.md
