# Financial Spreadsheet Application (PoC)

A comprehensive proof-of-concept financial modeling application built with React, Vite, and SpreadJS, featuring interconnected spreadsheets with dynamic cross-sheet formulas and real-time calculations.

## 📊 Project Overview

This project demonstrates a sophisticated financial spreadsheet application that connects multiple financial sheets through dynamic cross-sheet references. The application showcases advanced spreadsheet functionality with real-time data synchronization across different financial domains.

### **Key Capabilities**
- **8 Interconnected Financial Sheets**: Revenue, HR, Expenses, Capex, Budget Plan, Profit Loss, Financial Summary, and Assumptions
- **Dynamic Cross-Sheet Formulas**: Automatic data flow between sheets with real-time updates
- **JSON Template System**: Pre-configured spreadsheet templates for rapid financial model setup
- **Real-Time Financial Dashboard**: Live calculations of KPIs, variances, and performance metrics

## 🏗️ Architecture

### **Technology Stack**
- **Frontend**: React 19 with Vite build system
- **Spreadsheet Engine**: SpreadJS (GrapeCity) - Enterprise-grade spreadsheet component
- **Styling**: Tailwind CSS with custom UI components
- **State Management**: React hooks with custom spreadsheet management
- **Build Tools**: Vite, ESLint, PostCSS, Autoprefixer

### **Project Structure**
```
poc-spreadjs-server-4/
├── client/                          # React frontend application
│   ├── public/
│   │   ├── libs/spreadjs/          # SpreadJS library files
│   │   └── templates/              # JSON spreadsheet templates
│   │       ├── sample-revenue-channel.json
│   │       ├── sample-hr.json
│   │       ├── sample-expenses.json
│   │       ├── sample-capex.json
│   │       ├── sample-budget-plan.json
│   │       ├── sample-profit-loss.json
│   │       ├── sample-financial-summary.json
│   │       └── sample-assumptions.json
│   ├── src/
│   │   ├── components/
│   │   │   ├── SpreadSheetEditor.jsx
│   │   │   └── ui/                 # Reusable UI components
│   │   ├── hooks/
│   │   │   └── useSpreadSheet.js   # Custom spreadsheet management hook
│   │   ├── lib/
│   │   │   └── utils.js
│   │   └── pages/
│   │       └── SpreadSheetEditorPageJSONTemplateCreation.jsx
│   ├── package.json
│   └── README.md                   # Client-specific documentation
└── README.md                       # Project overview (this file)
```

## 🔄 Data Flow Architecture

The application demonstrates sophisticated data relationships across financial domains:

```
Revenue Channel → Budget Plan (Revenue Actuals)
     ↓
HR → Budget Plan (HR Costs Actuals)
     ↓
Expenses → Profit Loss (Operating Expenses)
     ↓
Capex → Profit Loss (Depreciation) → Financial Summary (ROI)
     ↓
Budget Plan → Financial Summary (Variance Analysis)
```

### **Cross-Sheet Relationships**
- **Budget Plan** pulls actuals from Revenue Channel, HR, Expenses, and Capex sheets
- **Profit Loss** calculates from operational data with quarterly breakdowns
- **Financial Summary** provides executive dashboard with calculated KPIs
- All relationships update in real-time when source data changes

## 🚀 Quick Start

### **Prerequisites**
- Node.js 16+
- npm or yarn

### **Installation & Setup**

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd poc-spreadjs-server-4
   ```

2. **Install client dependencies**
   ```bash
   cd client
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:5173
   ```

### **Build for Production**
```bash
cd client
npm run build
```

## 📈 Financial Sheets Overview

### **Operational Sheets**
- **Revenue Channel**: Sales breakdown by channel (Online, Retail, Wholesale, Direct)
- **HR**: Employee count and salary budget by department
- **Expenses**: Operating expenses (Marketing, R&D, Admin, etc.)
- **Capex**: Capital expenditures with depreciation calculations

### **Analysis Sheets**
- **Budget Plan**: Master budget with variance analysis against actuals
- **Profit Loss**: Quarterly and annual P&L with dynamic calculations
- **Financial Summary**: Key financial metrics and performance indicators
- **Assumptions**: External factors and market assumptions

## 🔧 Key Features

### **Advanced Spreadsheet Functionality**
- **Cross-Sheet References**: Formulas referencing data from other sheets
- **Dynamic Calculations**: Real-time updates when source data changes
- **Shared Formulas**: Efficient formula application across cell ranges
- **Template System**: JSON-based spreadsheet templates for consistency

### **Financial Calculations**
- **Revenue Growth**: `(Q4 - Q1) / Q1 * 100`
- **Profit Margin**: `Net Profit / Revenue * 100`
- **ROI**: `Net Profit / Capex * 100`
- **Cash Flow**: `Net Profit + Depreciation`
- **Variance Analysis**: `(Actual - Planned) / Planned * 100`

### **User Experience**
- **Responsive Design**: Works across desktop and mobile devices
- **Real-Time Updates**: Instant calculation updates across all sheets
- **Professional UI**: Clean, spreadsheet-like interface
- **Template Loading**: One-click loading of pre-configured financial models

## 🎯 Use Cases

### **Financial Planning**
- Budget vs actual analysis across all departments
- Real-time financial dashboard for executives
- Scenario planning with interconnected assumptions

### **Business Intelligence**
- Cross-functional financial visibility
- Automated variance reporting
- Performance tracking against targets

### **Proof of Concept**
- Demonstrates advanced spreadsheet integration
- Shows real-time data synchronization
- Validates complex financial modeling capabilities

## 🛠️ Development

### **Available Scripts**
```bash
cd client

# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### **Adding New Templates**
1. Create JSON template in `client/public/templates/`
2. Ensure proper SpreadJS JSON structure
3. Add cross-sheet references as needed
4. Update component to load new template

### **Extending Functionality**
- Add new calculation formulas
- Create additional financial sheets
- Implement new cross-sheet relationships
- Enhance UI components

## 📋 Requirements

### **System Requirements**
- Node.js 16.0 or higher
- Modern web browser with ES6 support
- 4GB RAM recommended for development

### **Dependencies**
- React 19.1.1
- Vite 7.1.10
- SpreadJS (included in public/libs)
- Tailwind CSS 3.x
- Radix UI components

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-functionality`)
3. Make your changes
4. Test cross-sheet relationships
5. Commit your changes (`git commit -am 'Add new functionality'`)
6. Push to the branch (`git push origin feature/new-functionality`)
7. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Troubleshooting

### **Common Issues**
- **Template Loading Errors**: Ensure all JSON templates are valid
- **Cross-Sheet References**: Verify sheet names match exactly in formulas
- **Build Errors**: Clear node_modules and reinstall dependencies
- **Performance Issues**: Close unused browser tabs during development

### **Debugging**
- Check browser console for JavaScript errors
- Validate JSON templates with a JSON validator
- Test individual sheets before checking cross-sheet relationships

## 📞 Support

For technical questions or issues:
1. Check the client README.md for detailed component documentation
2. Review SpreadJS documentation for spreadsheet-specific features
3. Create an issue in the repository for bugs or feature requests

---

**Note**: This is a proof-of-concept application demonstrating advanced spreadsheet integration capabilities. For production use, additional security, testing, and scalability considerations would be required.