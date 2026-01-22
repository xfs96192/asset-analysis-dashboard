import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { TrendingUp, TrendingDown, Minus, Target, BarChart3, Sparkles, Award } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const AssetOverview = ({ data }) => {
  // 计算各资产类别的平均评级
  const calculateCategoryScore = (categoryData) => {
    let totalScore = 0;
    let count = 0;
    
    Object.values(categoryData).forEach(subcategory => {
      subcategory.forEach(indicator => {
        // 根据评级计算分数
        let score = 50; // 默认中性
        switch (indicator.rating) {
          case '极具吸引力': score = 90; break;
          case '较具吸引力': score = 75; break;
          case '中性': case '中低位': case '中高位': score = 50; break;
          case '偏贵': score = 25; break;
          case '昂贵': case '高位': score = 10; break;
          case '低位': score = 80; break;
        }
        totalScore += score;
        count++;
      });
    });
    
    return count > 0 ? Math.round(totalScore / count) : 50;
  };

  const categoryScores = {
    权益: calculateCategoryScore(data.权益),
    债券: calculateCategoryScore(data.债券),
    汇率: calculateCategoryScore(data.汇率),
    商品: calculateCategoryScore(data.商品)
  };

  const pieData = Object.entries(categoryScores).map(([category, score]) => ({
    name: category,
    value: score,
    color: score >= 70 ? '#38a169' : score >= 50 ? '#d69e2e' : '#e53e3e'
  }));

  const barData = Object.entries(categoryScores).map(([category, score]) => ({
    category,
    score,
    color: score >= 70 ? '#38a169' : score >= 50 ? '#d69e2e' : '#e53e3e'
  }));

  const getScoreLabel = (score) => {
    if (score >= 70) return '具有吸引力';
    if (score >= 50) return '中性';
    return '谨慎';
  };

  const getScoreColor = (score) => {
    if (score >= 70) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 50) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getScoreIcon = (score) => {
    if (score >= 70) return <Award className="w-4 h-4 text-green-600" />;
    if (score >= 50) return <Target className="w-4 h-4 text-yellow-600" />;
    return <TrendingDown className="w-4 h-4 text-red-600" />;
  };

  return (
    <div className="space-y-8">
      <div className="animate-fade-in">
        <h2 className="section-title flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-primary" />
          市场概览
        </h2>
        <p className="text-muted-foreground mb-6 text-lg">
          基于历史数据分析的各大类资产当前投资价值评估
        </p>
      </div>

      {/* 核心指标卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(categoryScores).map(([category, score], index) => (
          <Card 
            key={category} 
            className="asset-card hover-lift animate-scale-in group relative overflow-hidden"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-500"></div>
            <CardHeader className="pb-3 relative z-10">
              <CardTitle className="flex items-center justify-between">
                <span className="text-lg font-semibold">{category}资产</span>
                {getScoreIcon(score)}
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold metric-value bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    {score}
                  </span>
                  <Badge className={`${getScoreColor(score)} border px-3 py-1 font-medium`}>
                    {getScoreLabel(score)}
                  </Badge>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ 
                      width: `${score}%`,
                      '--start-color': score >= 70 ? '#38a169' : score >= 50 ? '#d69e2e' : '#e53e3e',
                      '--end-color': score >= 70 ? '#48bb78' : score >= 50 ? '#ecc94b' : '#f56565'
                    }}
                  ></div>
                </div>
                <p className="text-sm text-muted-foreground font-medium">
                  综合评分 (0-100)
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 图表展示 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 饼图 - 资产配置建议 */}
        <Card className="asset-card hover-lift chart-container animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              资产吸引力分布
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}分`, '评分']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 柱状图 - 评分对比 */}
        <Card className="asset-card hover-lift chart-container animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              各类资产评分对比
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="category" stroke="#64748b" />
                <YAxis domain={[0, 100]} stroke="#64748b" />
                <Tooltip 
                  formatter={(value) => [`${value}分`, '评分']}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* 市场洞察 */}
      <Card className="asset-card hover-lift animate-slide-up">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            市场洞察与配置建议
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <div className="w-1 h-5 bg-gradient-to-b from-primary to-accent rounded-full"></div>
                当前市场特征
              </h4>
              <ul className="space-y-3">
                <li className="insight-card bg-blue-50 border-blue-400 text-blue-800">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm">权益市场估值处于相对合理区间，部分指标显示投资价值</span>
                  </div>
                </li>
                <li className="insight-card bg-yellow-50 border-yellow-400 text-yellow-800">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm">债券收益率位于历史低位，配置价值有限</span>
                  </div>
                </li>
                <li className="insight-card bg-purple-50 border-purple-400 text-purple-800">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm">汇率波动加剧，需关注中美利差变化</span>
                  </div>
                </li>
                <li className="insight-card bg-green-50 border-green-400 text-green-800">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm">商品价格分化明显，结构性机会显现</span>
                  </div>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <div className="w-1 h-5 bg-gradient-to-b from-accent to-primary rounded-full"></div>
                配置建议
              </h4>
              <ul className="space-y-3">
                <li className="insight-card bg-green-50 border-green-400 text-green-800">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm">适度增配权益资产，关注估值修复机会</span>
                  </div>
                </li>
                <li className="insight-card bg-yellow-50 border-yellow-400 text-yellow-800">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm">债券配置保持中性，等待更好时机</span>
                  </div>
                </li>
                <li className="insight-card bg-blue-50 border-blue-400 text-blue-800">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm">汇率对冲策略，降低汇率风险敞口</span>
                  </div>
                </li>
                <li className="insight-card bg-purple-50 border-purple-400 text-purple-800">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm">商品配置精选品种，关注供需基本面</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AssetOverview;

