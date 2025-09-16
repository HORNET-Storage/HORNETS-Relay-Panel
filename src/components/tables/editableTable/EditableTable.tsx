import React, { useState, useEffect } from 'react';
import { BaseTable } from '@app/components/common/BaseTable/BaseTable';
import { useTranslation } from 'react-i18next';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { Line } from 'react-chartjs-2';
import { ChartOptions } from 'chart.js';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import useKindData from '@app/hooks/useKindData';
import useKindTrendData from '@app/hooks/useKindTrendData';
import { Breakpoint } from 'antd/lib/_util/responsiveObserve';
import { useResponsive } from '@app/hooks/useResponsive';
import { BaseSkeleton } from '@app/components/common/BaseSkeleton/BaseSkeleton';
import { CaretDownOutlined, CaretRightOutlined } from '@ant-design/icons';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

interface KindData {
  kindName: string;
  kindNumber: number;
  nip: string;
  description: string;
  totalSize: number;
}

const EditableTable: React.FC = () => {
  const [form] = BaseForm.useForm();
  const { t } = useTranslation();
  const { kindData: initialKindData, isLoading } = useKindData();
  const [sortedData, setSortedData] = useState<KindData[]>([]);
  const [expandedRowKeys, setExpandedRowKeys] = useState<number[]>([]);
  const [sortOrder, setSortOrder] = useState<'ascend' | 'descend'>('descend');
  const [sortField, setSortField] = useState<string>('totalSize');
  const { isMobile, isDesktop, isTablet } = useResponsive();

  useEffect(() => {
    if (initialKindData && initialKindData.length > 0) {
      const sorted = [...initialKindData].sort((a: KindData, b: KindData) => {
        if (sortField === 'totalSize') {
          return sortOrder === 'descend' ? b.totalSize - a.totalSize : a.totalSize - b.totalSize;
        } else if (sortField === 'nip') {
          return sortOrder === 'descend' ? b.nip.localeCompare(a.nip) : a.nip.localeCompare(b.nip);
        } else if (sortField === 'kindName') {
          return sortOrder === 'descend' ? b.kindName.localeCompare(a.kindName) : a.kindName.localeCompare(b.kindName);
        } else {
          return sortOrder === 'descend' ? b.kindNumber - a.kindNumber : a.kindNumber - b.kindNumber;
        }
      });
      setSortedData(sorted);
    } else {
      setSortedData([]);
    }
  }, [initialKindData, sortOrder, sortField]);

  const handleExpand = (expanded: boolean, record: KindData) => {
    if (expanded) {
      setExpandedRowKeys([...expandedRowKeys, record.kindNumber]);
    } else {
      setExpandedRowKeys(expandedRowKeys.filter(key => key !== record.kindNumber));
    }
  };

  const handleChange = (pagination: any, filters: any, sorter: any) => {
    setSortOrder(sorter.order);
    setSortField(sorter.field);
  };

  const columns = [
    {
      title: t('common.kindName'),
      dataIndex: 'kindName',
      width: '30%',
      editable: false,
      sorter: true,
      sortOrder: sortField === 'kindName' ? sortOrder : undefined,
      render: (text: string, record: KindData) => {
        const isExpanded = expandedRowKeys.includes(record.kindNumber);
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: 'rgba(0, 191, 255, 1)', fontSize: '14px' }}>
              {isExpanded ? <CaretDownOutlined /> : <CaretRightOutlined />}
            </span>
            {text}
          </div>
        );
      },
    },
    {
      title: t('common.nip'),
      dataIndex: 'nip',
      width: '15%',
      editable: false,
      sorter: true,
      sortOrder: sortField === 'nip' ? sortOrder : undefined,
      responsive: ['lg'] as Breakpoint[],
    },
    {
      title: t('common.description'),
      dataIndex: 'description',
      width: '40%',
      editable: false,
      responsive: ['md'] as Breakpoint[],
    },
    {
      title: t('common.totalSize'),
      dataIndex: 'totalSize',
      width: '15%',
      editable: false,
      render: (text: number) => `${text.toFixed(3)} GB`,
      sorter: true,
      sortOrder: sortField === 'totalSize' ? sortOrder : undefined,
    }
  ];

  const getChartOptions = (): ChartOptions<'line'> => ({
    responsive: true,
    maintainAspectRatio: false,
    backgroundColor: 'transparent',
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Total Size (GB)',
          font: {
            size: 12,
            weight: 'bold',
          },
          color: 'rgba(0, 255, 255, 0.9)', // Liquid cyan for titles
        },
        ticks: {
          font: {
            size: 11,
          },
          color: 'rgba(0, 255, 255, 0.6)', // Lighter cyan for tick labels
        },
        grid: {
          color: 'rgba(0, 255, 255, 0.05)', // Very subtle cyan grid
          drawBorder: false,
        },
      },
      x: {
        title: {
          display: true,
          text: 'Month',
          font: {
            size: 12,
            weight: 'bold',
          },
          color: 'rgba(0, 255, 255, 0.9)', // Liquid cyan for titles
        },
        ticks: {
          font: {
            size: 11,
          },
          color: 'rgba(0, 255, 255, 0.6)', // Lighter cyan for tick labels
        },
        grid: {
          color: 'rgba(0, 255, 255, 0.05)', // Very subtle cyan grid
          drawBorder: false,
        },
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            size: 13,
          },
          color: 'rgba(0, 255, 255, 0.9)', // Liquid cyan for legend
        },
      },
      filler: {
        propagate: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `Total Size: ${context.raw.toFixed(3)} GB`,
        },
        backgroundColor: 'rgba(0, 10, 20, 0.95)',
        titleColor: 'rgba(0, 255, 255, 1)', // Liquid cyan
        bodyColor: 'rgba(255, 255, 255, 0.9)',
        borderColor: 'rgba(0, 255, 255, 0.3)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        padding: 12,
      },
    },
    layout: {
      padding: 0,
    },
    animation: {
      duration: 800,
      easing: 'easeInOutQuart',
    },
    hover: {
      mode: 'nearest' as const,
      intersect: true,
    },
  });

  const ChartRow: React.FC<{ record: KindData }> = ({ record }) => {
    const { trendData, isLoading: isTrendLoading } = useKindTrendData(record.kindNumber);
    
    const chartData = {
      labels: trendData ? trendData.map((data: any) => data.month) : [],
      datasets: [
        {
          label: `Kind ${record.kindNumber}`,
          data: trendData ? trendData.map((data: any) => data.totalSize) : [],
          fill: true,
          backgroundColor: (context: any) => {
            const ctx = context.chart.ctx;
            const gradient = ctx.createLinearGradient(0, 0, 0, 400);
            gradient.addColorStop(0, 'rgba(0, 255, 255, 0.3)'); // Liquid cyan
            gradient.addColorStop(1, 'rgba(0, 255, 255, 0.02)'); // Fade to transparent
            return gradient;
          },
          borderColor: 'rgba(0, 255, 255, 0.8)', // Liquid cyan border
          pointBackgroundColor: 'rgba(0, 255, 255, 0.9)',
          pointBorderColor: 'rgba(0, 255, 255, 0.5)',
          pointHoverBackgroundColor: '#00FFFF',
          pointHoverBorderColor: 'rgba(0, 255, 255, 1)',
          tension: 0.4,
        },
      ],
    };

    return (
      <div style={{
        padding: '20px',
        background: 'rgba(0, 10, 20, 0.6)', // Dark background with transparency
        borderRadius: '12px',
        margin: '10px',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)', // Safari support
        border: '1px solid rgba(0, 255, 255, 0.15)',
        boxShadow: '0 8px 32px rgba(0, 255, 255, 0.1), inset 0 1px 0 rgba(0, 255, 255, 0.2)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {isTrendLoading ? (
          <div style={{
            height: '300px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'rgba(255, 255, 255, 0.6)'
          }}>
            Loading chart data...
          </div>
        ) : trendData && trendData.length > 0 ? (
          <div style={{
            height: '300px',
            position: 'relative',
            backgroundColor: 'transparent'
          }}>
            <style>{`
              .chart-container-${record.kindNumber} {
                background: transparent !important;
              }
              .chart-container-${record.kindNumber} canvas {
                background: transparent !important;
                background-color: transparent !important;
              }
              .chart-container-${record.kindNumber} > div {
                background: transparent !important;
              }
            `}</style>
            <div
              className={`chart-container-${record.kindNumber}`}
              style={{
                background: 'transparent',
                height: '100%'
              }}
            >
              <Line data={chartData} options={getChartOptions()} />
            </div>
          </div>
        ) : (
          <div style={{
            height: '100px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'rgba(255, 255, 255, 0.6)'
          }}>
            {t('common.noTrendDataAvailable')}
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <BaseForm form={form} component={false}>
        {isLoading ? <BaseSkeleton /> :
          sortedData.length > 0 ? (
            <BaseTable
              size={isDesktop || isTablet ? 'middle' : 'small'}
              bordered
              style={{ padding: isMobile ? ' 0 .5rem .5rem .5rem' : '0 1.5rem 1.5rem 1.5rem' }}
              dataSource={sortedData}
              columns={columns}
              rowKey="kindNumber"
              rowClassName={(record) => {
                const isExpanded = expandedRowKeys.includes(record.kindNumber);
                return `editable-row ${isExpanded ? 'expanded-row' : ''}`;
              }}
              expandable={{
                expandedRowRender: (record) => <ChartRow record={record} />,
                expandedRowKeys: expandedRowKeys,
                onExpand: handleExpand,
                expandRowByClick: true,
                showExpandColumn: false,
              }}
              pagination={false}
              loading={isLoading}
              onChange={handleChange}
              onRow={(record) => ({
                style: { cursor: 'pointer' }
              })}
            />
          ) : (
            <div>{'No Data Available'}</div>
          )
        }
      </BaseForm>
    </div>
  );
};

export default EditableTable;