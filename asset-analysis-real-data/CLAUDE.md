# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a financial asset analysis platform (资产分析仪表板) with two main components:
1. Python data collection system for gathering financial market data
2. React frontend dashboard for visualizing asset analysis across equities, bonds, forex, and commodities

## Development Commands

### Frontend (asset-analysis-dashboard/)
```bash
pnpm dev          # Start development server at http://localhost:5173
pnpm build        # Build for production
pnpm preview      # Preview production build
pnpm lint         # Run ESLint
```

### Data Collection (root directory)
```bash
python enhanced_data_collector.py  # Collect and process financial data
python excel_to_json_converter.py  # Convert Excel data to JSON
```

## Architecture

### Frontend Structure
- **React 19** with Vite 6.3.5 build system
- **shadcn/ui** component library (35+ components) built on Radix UI
- **Tailwind CSS 4.x** for styling
- **Section-based organization**: Each asset class (equity, bonds, forex, commodities) has dedicated section components
- **Static data flow**: Components receive data via props from `asset_data.json`

### Data Pipeline
- Python scripts collect financial data and generate JSON files
- Frontend consumes static JSON data (no real-time API integration)
- Data files: `enhanced_asset_data.json`, `updated_asset_data.json`

### Component Patterns
- Section components follow consistent structure: `{AssetType}Section.jsx`
- Custom percentile visualization components
- Mobile-responsive design using `use-mobile.js` hook
- UI components use `cn()` utility for conditional CSS classes

## Key Technical Details

- **Package Manager**: Enforced pnpm usage (version 10.4.1)
- **No TypeScript**: Pure JavaScript project
- **No Testing Framework**: No test suite configured
- **ESLint**: Flat config format with React hooks rules
- **shadcn/ui Config**: "new-york" style, neutral base color, Lucide icons
- **Chinese Interface**: UI text in Chinese for financial market context

## Important Files
- `src/components/AssetDashboard.jsx` - Main dashboard orchestrating all sections
- `src/assets/asset_data.json` - Primary data source for frontend
- `enhanced_data_collector.py` - Primary data collection script
- `components.json` - shadcn/ui configuration