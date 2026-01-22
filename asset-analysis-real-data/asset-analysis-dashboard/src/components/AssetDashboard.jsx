import React, { useState, useEffect } from 'react';
import assetDataJson from '../assets/asset_data.json';
import EquitySection from './EquitySection';
import BondSection from './BondSection';
import ForexSection from './ForexSection';
import CommoditySection from './CommoditySection';

const AssetDashboard = () => {
  const [assetData, setAssetData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      setAssetData(assetDataJson);
      setLoading(false);
    } catch (error) {
      console.error('加载数据失败:', error);
      setLoading(false);
    }
  }, []);

  const handleExportPDF = () => {
    window.print();
  };

  const handleScreenshot = () => {
    alert('请使用浏览器的截图功能（通常是 Ctrl+Shift+S 或右键菜单中的"截图"选项）');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">正在加载数据...</p>
        </div>
      </div>
    );
  }

  if (!assetData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">数据加载失败</p>
        </div>
      </div>
    );
  }

  const getLastUpdated = (data) => {
    if (!data) return '';
    let maxDate = '';

    const checkCategory = (categoryData) => {
      if (!categoryData) return;
      Object.values(categoryData).forEach(asset => {
        if (asset.price_series && asset.price_series.length > 0) {
          const lastDate = asset.price_series[asset.price_series.length - 1].date;
          if (!maxDate || lastDate > maxDate) {
            maxDate = lastDate;
          }
        }
      });
    };

    checkCategory(data.equity);
    checkCategory(data.bond);
    checkCategory(data.commodity);
    checkCategory(data.forex);

    return maxDate;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* 页面头部 */}
      <div className="bg-white shadow-sm border-b border-gray-200 print:shadow-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                多资产投资分析平台
              </h1>
              <p className="text-gray-600 mt-1">
                银行理财资产配置分析 • 数据截至: {getLastUpdated(assetData)}
              </p>
            </div>

            {/* 导出按钮 */}
            <div className="flex space-x-3 print:hidden">
              <button
                onClick={handleExportPDF}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                打印/导出PDF
              </button>
              <button
                onClick={handleScreenshot}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                截图导出
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4">
        {/* 使用网格布局，桌面端2列，移动端1列，自适应高度 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:items-start">
          {/* 权益资产分析 */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-white mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <h2 className="text-lg font-bold text-white">权益资产分析</h2>
              </div>
            </div>
            <div className="p-4">
              <EquitySection data={assetData.equity} />
            </div>
          </div>

          {/* 商品资产分析 */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-orange-600 to-orange-700 px-4 py-3">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-white mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <h2 className="text-lg font-bold text-white">商品资产分析</h2>
              </div>
            </div>
            <div className="p-4">
              <CommoditySection data={assetData.commodity} />
            </div>
          </div>

          {/* 债券资产分析 */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-green-700 px-4 py-3">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-white mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <h2 className="text-lg font-bold text-white">债券资产分析</h2>
              </div>
            </div>
            <div className="p-4">
              <BondSection data={assetData.bond} />
            </div>
          </div>

          {/* 汇率资产分析 */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-4 py-3">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-white mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                <h2 className="text-lg font-bold text-white">汇率资产分析</h2>
              </div>
            </div>
            <div className="p-4">
              <ForexSection data={assetData.forex} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetDashboard;

