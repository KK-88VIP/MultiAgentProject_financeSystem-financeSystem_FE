/**
 * ============================================
 * 文件名称: TopNav.tsx
 * 文件版本: V1.1
 * 文件用途: 顶部导航栏组件（Logo、公司筛选器、年度筛选器、角色标识、刷新按钮）
 * 创建时间: 2026-04-20
 * 最新修改: 2026-04-21
 * 修改人: aQian (前端开发)
 * 说明: 66%/34% 布局的顶部公共导航区域
 * ============================================
 */

import React, { useEffect } from 'react';
import { Layout, Select, Button, Space, Tag, Typography } from 'antd';
import { SearchOutlined, UserOutlined, BarChartOutlined } from '@ant-design/icons';
import { useFilterStore } from '../../stores/filterStore';
import { useAuthStore } from '../../stores/authStore';
import { useDashboardStore } from '../../stores/dashboardStore';

const { Header } = Layout;
const { Text } = Typography;

const TopNav: React.FC = () => {
  const { role, authorizedCompanies } = useAuthStore();
  const {
    selectedCompany,
    selectedYear,
    yearOptions,
    hasFilterPermission,
    setCompany,
    setYear,
    companyList,
    fetchFilterOptions,
  } = useFilterStore();
  const { refreshAllData, isLoading } = useDashboardStore();

  // 初始化获取公司列表（仅调用一次，权限初始化在 DashboardPage 中完成）
  useEffect(() => {
    fetchFilterOptions();
  }, [fetchFilterOptions]);

  // 判断是否为子公司财务（权限控制）
  const isSubFinance = role === 'sub_company_finance';

  // 子公司财务且仅有 1 个授权公司时禁用修改（0 个授权公司视为未限制，可选择）
  const isCompanyDisabled = !hasFilterPermission || (isSubFinance && authorizedCompanies.length === 1 && !!selectedCompany);

  return (
    <Header className="bg-white border-b px-4 flex items-center justify-between shadow-sm sticky top-0 z-50">
      <Space size="large">
        {/* Logo 区 */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
            <BarChartOutlined className="text-white text-lg" />
          </div>
          <Text strong className="text-lg">财务智能分析</Text>
        </div>

        {/* 过滤器区 */}
        <Space size="middle" className="ml-8">
          <div className="flex items-center gap-2">
            <span className="text-gray-500 text-sm">主体:</span>
            <Select
              placeholder="选择公司"
              style={{ minWidth: 200, maxWidth: 400 }}
              value={selectedCompany}
              onChange={setCompany}
              disabled={isCompanyDisabled}
              options={companyList.map((c) => ({ label: c.company_name, value: c.company_id }))}
              allowClear={false}
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-gray-500 text-sm">年度:</span>
            <Select
              placeholder="选择年度"
              style={{ width: 180 }}
              value={selectedYear}
              onChange={setYear}
              options={yearOptions.map((year) => ({ label: String(year), value: year }))}
              allowClear={false}
              disabled={!hasFilterPermission}
            />
          </div>

          <Button
            type="primary"
            icon={<SearchOutlined />}
            onClick={refreshAllData}
            loading={isLoading}
            disabled={!selectedCompany || !selectedYear}
          >
            查询
          </Button>
        </Space>
      </Space>

      <Space size="middle">
        {/* 用户角色标识 */}
        <div className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full border">
          <UserOutlined className="text-gray-400" />
          <Tag color={role === 'management' ? 'blue' : 'green'} className="mr-0 border-none bg-transparent">
            {role === 'management' ? '管理层' : '子公司财务'}
          </Tag>
        </div>
      </Space>
    </Header>
  );
};

export default TopNav;
