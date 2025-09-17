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
import { CaretDownOutlined, CaretRightOutlined, ExpandOutlined, ShrinkOutlined } from '@ant-design/icons';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

interface KindData {
  kindName: string;
  kindNumber: number;
  nip: string;
  description: string;
  totalSize: number;
}

interface EditableTableProps {
  allExpanded?: boolean;
  expandedKeys?: number[];
  setExpandedKeys?: (keys: number[]) => void;
}

const EditableTable: React.FC<EditableTableProps> = ({
  allExpanded: parentAllExpanded,
  expandedKeys: parentExpandedKeys,
  setExpandedKeys: parentSetExpandedKeys
}) => {
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

  // Handle expand all/collapse all from parent
  useEffect(() => {
    if (parentAllExpanded !== undefined && sortedData.length > 0) {
      if (parentAllExpanded) {
        const allKeys = sortedData.map((item) => item.kindNumber);
        setExpandedRowKeys(allKeys);
        if (parentSetExpandedKeys) parentSetExpandedKeys(allKeys);
      } else {
        setExpandedRowKeys([]);
        if (parentSetExpandedKeys) parentSetExpandedKeys([]);
      }
    }
  }, [parentAllExpanded, sortedData, parentSetExpandedKeys]);

  const handleExpand = (expanded: boolean, record: KindData) => {
    let newKeys: number[];
    if (expanded) {
      newKeys = [...expandedRowKeys, record.kindNumber];
    } else {
      newKeys = expandedRowKeys.filter(key => key !== record.kindNumber);
    }
    setExpandedRowKeys(newKeys);
    if (parentSetExpandedKeys) parentSetExpandedKeys(newKeys);
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
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{
              color: 'rgba(0, 255, 255, 1)',
              fontSize: '14px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '20px',
              height: '20px',
              flexShrink: 0
            }}>
              {isExpanded ? <CaretDownOutlined /> : <CaretRightOutlined />}
            </span>
            <span style={{
              color: 'rgba(255, 255, 255, 0.95)',
              fontWeight: isExpanded ? 600 : 500
            }}>
              {text}
            </span>
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
      render: (text: number) => {
        const size = text.toFixed(3);
        const intensity = Math.min(text / 10, 1); // Scale intensity based on size
        return (
          <div style={{
            display: 'inline-block',
            padding: '4px 12px',
            background: `linear-gradient(135deg,
              rgba(0, 255, 255, ${0.1 + intensity * 0.1}) 0%,
              rgba(0, 191, 255, ${0.05 + intensity * 0.05}) 100%)`,
            border: `1px solid rgba(0, 255, 255, ${0.3 + intensity * 0.3})`,
            borderRadius: '8px',
            color: 'rgba(0, 255, 255, 0.95)',
            fontWeight: 600,
            fontSize: '0.9rem',
            boxShadow: `
              0 2px 8px rgba(0, 255, 255, ${0.2 * intensity}),
              inset 0 1px 2px rgba(0, 255, 255, ${0.2 + intensity * 0.2})`,
            textShadow: `0 0 ${4 + intensity * 4}px rgba(0, 255, 255, 0.6)`,
            transform: 'translateZ(0)',
            transition: 'all 0.3s ease'
          }}>
            {size} GB
          </div>
        );
      },
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
          color: 'rgba(255, 255, 255, 0.95)', // White text for titles like Bitcoin chart
        },
        ticks: {
          font: {
            size: 12,
          },
          color: 'rgba(255, 255, 255, 0.9)', // White text like Bitcoin chart
        },
        grid: {
          color: 'rgba(0, 255, 255, 0.15)', // Match Bitcoin borderBase
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
          color: 'rgba(255, 255, 255, 0.95)', // White text for titles like Bitcoin chart
        },
        ticks: {
          font: {
            size: 11,
          },
          color: 'rgba(255, 255, 255, 0.9)', // White text like Bitcoin chart
        },
        grid: {
          color: 'rgba(0, 255, 255, 0.15)', // Match Bitcoin borderBase
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
          color: 'rgba(255, 255, 255, 0.95)', // White text for legend like Bitcoin chart
        },
      },
      filler: {
        propagate: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `Total Size: ${context.raw.toFixed(3)} GB`,
        },
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#06B6D4', // Primary color like Bitcoin chart
        bodyColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: '#06B6D4',
        borderWidth: 1,
      },
    },
    layout: {
      padding: 0,
    },
    animation: {
      duration: 1000,
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
            gradient.addColorStop(0, 'rgba(0, 255, 255, 0.15)'); // Match Bitcoin chart gradient
            gradient.addColorStop(1, 'rgba(0, 255, 255, 0.05)'); // Subtle fade
            return gradient;
          },
          borderColor: '#06B6D4', // Match liquid blue theme primary color (from Bitcoin chart)
          pointBackgroundColor: '#06B6D4',
          pointBorderColor: 'rgba(255, 255, 255, 0.95)', // White border like Bitcoin chart
          pointHoverBackgroundColor: 'rgba(255, 255, 255, 0.95)',
          pointHoverBorderColor: '#06B6D4',
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    };

    return (
      <div style={{
        padding: '24px',
        background: `linear-gradient(135deg,
          rgba(0, 10, 20, 0.8) 0%,
          rgba(0, 20, 40, 0.6) 50%,
          rgba(0, 10, 30, 0.7) 100%)`,
        borderRadius: '16px',
        margin: '16px',
        backdropFilter: 'blur(30px) saturate(150%)',
        WebkitBackdropFilter: 'blur(30px) saturate(150%)',
        border: '2px solid rgba(0, 255, 255, 0.2)',
        boxShadow: `
          0 20px 40px rgba(0, 255, 255, 0.15),
          0 10px 20px rgba(0, 191, 255, 0.1),
          inset 0 2px 4px rgba(0, 255, 255, 0.3),
          inset 0 -2px 4px rgba(0, 191, 255, 0.2),
          0 0 80px rgba(0, 255, 255, 0.05)`,
        position: 'relative',
        overflow: 'hidden',
        transform: 'translateZ(0) perspective(1000px)',
        transformStyle: 'preserve-3d',
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent 0%, rgba(0, 255, 255, 0.6) 50%, transparent 100%)',
        }} />
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
              style={{
                padding: isMobile ? ' 0 .5rem .5rem .5rem' : '0 1.5rem 1.5rem 1.5rem',
                borderRadius: '12px',
                overflow: 'hidden',
              }}
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
                style: {
                  cursor: 'pointer',
                  transition: 'background 0.3s ease',
                }
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