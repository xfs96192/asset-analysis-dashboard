#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
计算股债性价比历史数据

股债性价比 = 股票指数市盈率倒数 - 10年国债收益率
即：股债性价比 = (1/PE) - 10年国债收益率
"""

import sqlite3
import pandas as pd
import json
from datetime import datetime

# 数据库路径
DB_PATH = '/Users/fanshengxia/Desktop/data_api/data/financial_data.db'

def fetch_data():
    """从数据库中提取沪深300 PE数据和10年期国债收益率数据"""
    conn = sqlite3.connect(DB_PATH)

    # 查询沪深300 PE数据
    query_csi300_pe = """
    SELECT
        date,
        value as pe_ratio
    FROM time_series_data
    WHERE wind_code = '000300.SH'
    AND field_name = 'val_pe_nonnegative'
    ORDER BY date
    """

    df_pe = pd.read_sql_query(query_csi300_pe, conn)
    print(f"沪深300 PE数据记录数: {len(df_pe)}")
    print(f"时间范围: {df_pe['date'].min()} 至 {df_pe['date'].max()}")

    # 查询10年期国债收益率数据
    query_bond_10y = """
    SELECT
        date,
        value as bond_yield_10y
    FROM time_series_data
    WHERE wind_code = 'S0059749'
    AND field_name = 'value'
    ORDER BY date
    """

    df_bond = pd.read_sql_query(query_bond_10y, conn)
    print(f"\n10年期国债收益率数据记录数: {len(df_bond)}")
    print(f"时间范围: {df_bond['date'].min()} 至 {df_bond['date'].max()}")

    conn.close()

    return df_pe, df_bond

def calculate_equity_bond_ratio(df_pe, df_bond):
    """计算股债性价比"""

    # 合并两个数据集（按日期）
    df_merged = pd.merge(df_pe, df_bond, on='date', how='inner')

    print(f"\n合并后的数据记录数: {len(df_merged)}")
    print(f"时间范围: {df_merged['date'].min()} 至 {df_merged['date'].max()}")

    # 计算PE倒数（盈利收益率）
    # 注意：PE为0或极小值时需要处理
    df_merged['earnings_yield'] = 1 / df_merged['pe_ratio']

    # 计算股债性价比 = PE倒数 - 10年国债收益率
    # 注意：国债收益率通常是百分比形式，需要转换为小数
    # 如果数据库中存储的是百分比（例如2.5表示2.5%），需要除以100
    # 先检查数据范围来判断
    sample_bond_yield = df_merged['bond_yield_10y'].head(10)
    print(f"\n国债收益率样本数据（前10条）:\n{sample_bond_yield}")

    # 如果国债收益率大于1，说明是百分比形式，需要除以100
    if df_merged['bond_yield_10y'].mean() > 1:
        print("\n检测到国债收益率为百分比形式，将除以100转换为小数")
        df_merged['bond_yield_10y_decimal'] = df_merged['bond_yield_10y'] / 100
    else:
        print("\n检测到国债收益率已是小数形式")
        df_merged['bond_yield_10y_decimal'] = df_merged['bond_yield_10y']

    # 计算股债性价比
    df_merged['equity_bond_ratio'] = df_merged['earnings_yield'] - df_merged['bond_yield_10y_decimal']

    # 选择输出字段
    df_result = df_merged[[
        'date',
        'pe_ratio',
        'earnings_yield',
        'bond_yield_10y',
        'bond_yield_10y_decimal',
        'equity_bond_ratio'
    ]].copy()

    # 重命名字段以便于理解
    df_result.columns = [
        '日期',
        '沪深300市盈率PE',
        'PE倒数_盈利收益率',
        '10年国债收益率_原始',
        '10年国债收益率_小数',
        '股债性价比'
    ]

    return df_result

def save_results(df_result):
    """保存结果到CSV和JSON文件"""

    # 保存为CSV
    csv_path = '/Users/fanshengxia/Desktop/市场观点美化/asset-analysis-real-data/equity_bond_ratio_history.csv'
    df_result.to_csv(csv_path, index=False, encoding='utf-8-sig')
    print(f"\n✓ CSV文件已保存: {csv_path}")

    # 保存为JSON
    json_path = '/Users/fanshengxia/Desktop/市场观点美化/asset-analysis-real-data/equity_bond_ratio_history.json'

    # 转换为JSON格式
    result_dict = {
        'metadata': {
            'calculation_date': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            'formula': '股债性价比 = (1/PE) - 10年国债收益率',
            'data_source': '沪深300指数PE + 中债国债到期收益率10年',
            'record_count': len(df_result),
            'date_range': {
                'start': df_result['日期'].min(),
                'end': df_result['日期'].max()
            }
        },
        'data': df_result.to_dict(orient='records')
    }

    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(result_dict, f, ensure_ascii=False, indent=2)

    print(f"✓ JSON文件已保存: {json_path}")

    return csv_path, json_path

def print_statistics(df_result):
    """打印统计信息"""
    print("\n" + "="*80)
    print("股债性价比统计信息")
    print("="*80)

    print(f"\n数据记录数: {len(df_result)}")
    print(f"时间范围: {df_result['日期'].min()} 至 {df_result['日期'].max()}")

    print("\n各指标统计:")
    print(df_result.describe())

    # 找出极值
    print("\n股债性价比历史极值:")
    max_idx = df_result['股债性价比'].idxmax()
    min_idx = df_result['股债性价比'].idxmin()

    print(f"\n最高值: {df_result.loc[max_idx, '股债性价比']:.4f}")
    print(f"  日期: {df_result.loc[max_idx, '日期']}")
    print(f"  PE: {df_result.loc[max_idx, '沪深300市盈率PE']:.2f}")
    print(f"  国债收益率: {df_result.loc[max_idx, '10年国债收益率_小数']:.4f} ({df_result.loc[max_idx, '10年国债收益率_原始']:.2f}%)")

    print(f"\n最低值: {df_result.loc[min_idx, '股债性价比']:.4f}")
    print(f"  日期: {df_result.loc[min_idx, '日期']}")
    print(f"  PE: {df_result.loc[min_idx, '沪深300市盈率PE']:.2f}")
    print(f"  国债收益率: {df_result.loc[min_idx, '10年国债收益率_小数']:.4f} ({df_result.loc[min_idx, '10年国债收益率_原始']:.2f}%)")

    # 最新数据
    print(f"\n最新数据 ({df_result['日期'].max()}):")
    latest = df_result.iloc[-1]
    print(f"  沪深300 PE: {latest['沪深300市盈率PE']:.2f}")
    print(f"  PE倒数(盈利收益率): {latest['PE倒数_盈利收益率']:.4f} ({latest['PE倒数_盈利收益率']*100:.2f}%)")
    print(f"  10年国债收益率: {latest['10年国债收益率_小数']:.4f} ({latest['10年国债收益率_原始']:.2f}%)")
    print(f"  股债性价比: {latest['股债性价比']:.4f}")

    print("\n" + "="*80)

def main():
    """主函数"""
    print("开始计算股债性价比...")
    print("="*80)

    # 1. 提取数据
    print("\n步骤1: 从数据库提取数据")
    df_pe, df_bond = fetch_data()

    # 2. 计算股债性价比
    print("\n步骤2: 计算股债性价比")
    df_result = calculate_equity_bond_ratio(df_pe, df_bond)

    # 3. 保存结果
    print("\n步骤3: 保存结果")
    csv_path, json_path = save_results(df_result)

    # 4. 打印统计信息
    print_statistics(df_result)

    print("\n✓ 计算完成！")
    print(f"\n输出文件:")
    print(f"  - CSV: {csv_path}")
    print(f"  - JSON: {json_path}")

if __name__ == '__main__':
    main()
