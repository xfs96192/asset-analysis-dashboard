# 资产分析仪表板 (Asset Analysis Dashboard)

一个综合性的金融资产分析平台，提供多资产类别的实时数据分析和可视化展示。

## 🚀 项目概述

本项目包含两个主要部分：
- **数据收集系统**: Python脚本自动收集各类金融市场数据
- **可视化仪表板**: React前端应用展示资产分析结果

## 📊 支持的资产类别

### 权益类
- 上证指数 (PE/PB估值、股债性价比)
- 标普500 (PE/PB估值、股债性价比)  
- 中证转债 (转股溢价率、纯债溢价率、隐含波动率)

### 债券类
- 10年期美国国债收益率
- 7-10年国开债
- 1-3年高信用等级债券

### 汇率
- USDCNY (中美利差、美元指数)

### 商品
- 沪金 (内外盘价差、美国实际利率)
- 原油 (WTI与布油价差、美元指数)
- 螺纹钢 (螺卷差、铁矿价格)
- 豆粕 (期现价差、持仓量)

## 🛠 技术栈

### 前端
- **React 19** - 用户界面框架
- **Vite** - 构建工具
- **Tailwind CSS** - 样式框架
- **Radix UI** - 组件库
- **Recharts** - 图表库
- **Lucide React** - 图标库

### 后端
- **Python 3.x** - 数据收集脚本
- **pandas** - 数据处理
- **numpy** - 数值计算
- **requests** - API调用

## 📋 环境要求

### 前端要求
- Node.js >= 18.0.0
- pnpm >= 8.0.0 (推荐) 或 npm

### 后端要求
- Python >= 3.8
- pip 包管理器

## 🚀 快速开始

### 1. 克隆项目
```bash
git clone <repository-url>
cd asset-analysis-real-data
```

### 2. 数据收集设置

#### 安装Python依赖
```bash
pip install pandas numpy requests datetime
```

#### 配置API密钥 (可选)
编辑 `enhanced_data_collector.py` 文件，替换以下API密钥：
```python
self.alpha_vantage_key = "your_alpha_vantage_key"
self.finnhub_key = "your_finnhub_key"
```

#### 运行数据收集
```bash
python enhanced_data_collector.py
```

### 3. 前端应用设置

#### 进入前端目录
```bash
cd asset-analysis-dashboard
```

#### 安装依赖
```bash
# 使用 pnpm (推荐)
pnpm install

# 或使用 npm
npm install
```

#### 启动开发服务器
```bash
# 使用 pnpm
pnpm dev

# 或使用 npm
npm run dev
```

#### 构建生产版本
```bash
# 使用 pnpm
pnpm build

# 或使用 npm
npm run build
```

### 4. 访问应用
打开浏览器访问: `http://localhost:5173`

## 📁 项目结构

```
asset-analysis-real-data/
├── README.md                           # 项目说明文档
├── enhanced_data_collector.py          # 数据收集脚本
├── enhanced_asset_data.json           # 收集的资产数据
├── 指标值.xlsx                        # Excel指标数据
├── 近1月净值走势.xlsx                  # Excel走势数据
└── asset-analysis-dashboard/           # 前端应用目录
    ├── package.json                    # 项目依赖配置
    ├── vite.config.js                 # Vite配置文件
    ├── src/
    │   ├── App.jsx                    # 主应用组件
    │   ├── components/                # React组件
    │   │   ├── AssetDashboard.jsx     # 主仪表板
    │   │   ├── EquitySection.jsx      # 权益部分
    │   │   ├── BondSection.jsx        # 债券部分
    │   │   ├── ForexSection.jsx       # 汇率部分
    │   │   ├── CommoditySection.jsx   # 商品部分
    │   │   └── ui/                    # UI组件库
    │   ├── assets/                    # 静态资源
    │   │   └── asset_data.json        # 前端数据文件
    │   └── lib/                       # 工具函数
    └── public/                        # 公共资源
```

## 🔧 配置说明

### 数据源配置
项目支持多种数据源：
- Yahoo Finance API (免费)
- Alpha Vantage API (需要注册)
- Finnhub API (需要注册)

### 自定义配置
- 修改 `enhanced_data_collector.py` 中的资产列表和指标
- 调整前端组件中的显示样式和布局
- 更新数据刷新频率和缓存策略

## 📱 功能特性

- ✅ 多资产类别实时数据展示
- ✅ 历史走势图表可视化
- ✅ 分位数排名和相对估值
- ✅ 响应式设计，支持移动端
- ✅ PDF导出功能
- ✅ 截图分享功能
- ✅ 数据自动刷新
- ✅ 错误处理和加载状态

## 🚨 注意事项

1. **API限制**: 免费API有调用次数限制，建议注册获取正式API密钥
2. **数据延迟**: 某些数据源可能有15-20分钟延迟
3. **网络要求**: 需要稳定的网络连接获取实时数据
4. **浏览器兼容**: 推荐使用现代浏览器（Chrome、Firefox、Safari、Edge）

## 🔄 数据更新

### 手动更新
```bash
python enhanced_data_collector.py
```

### 自动更新 (可选)
可以设置定时任务（cron job或Windows计划任务）定期运行数据收集脚本。

## 🤝 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 📞 支持与反馈

如果您遇到问题或有改进建议：
- 提交 Issue
- 发送邮件至 [your-email@example.com]
- 参与讨论区交流

---

**免责声明**: 本项目仅用于教育和研究目的，不构成投资建议。投资有风险，决策需谨慎。

长度合适,但是汇率资产下方有一大片空白,思考有什么优化的方式'/Users/fanshengxia/Desktop/FireS
  hot Capture 030 - 多资产投资分析平台 - 银行理财资产配置 - [localhost] (1).png'