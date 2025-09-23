import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { useTranslation } from 'react-i18next';
import TransactionItem from './TransactionItem/TransactionItem';
import { getUserActivities, WalletTransaction } from '@app/api/activity.api';
import * as S from './Transactions.styles';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { Modal } from 'antd';
import { ViewTransactions } from '@app/components/relay-dashboard/common/ViewAll/ViewTransactions';
import styled from 'styled-components';
import { Line } from 'react-chartjs-2';
import { BaseSkeleton } from '@app/components/common/BaseSkeleton/BaseSkeleton';
import { ChartOptions } from 'chart.js';
import { liquidBlueTheme } from '@app/styles/themes/liquidBlue/liquidBlueTheme';
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
import { TransactionCard } from './TransactionItem/TransactionItem.styles';
import ButtonTrigger from '../unconfirmed-transactions/components/ButtonTrigger/ButtonTrigger';
import { useHandleLogout } from '@app/hooks/authUtils';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 1rem;
`;

const LiquidWrapper = styled.div`
  background: var(--additional-background-color);
  box-shadow: var(--box-shadow-nft-color);
  border-radius: 7px;
  padding: 1.5rem 1.25rem;
  position: relative;
  overflow: hidden;
`;

export const ActivityStory: React.FC = () => {
  const [story, setStory] = useState<WalletTransaction[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const handleLogout = useHandleLogout();

  const { t } = useTranslation();

  useEffect(() => {
    getUserActivities(handleLogout)
      .then((res) => {
        setStory(res);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Failed to load user activities:', error);
        setIsLoading(false);
      });
  }, [handleLogout]);

  const activityContent =
    story.length > 0 ? (
      story.map((item) => (
        <BaseCol key={item.id} span={24}>
          <TransactionItem {...item} />
        </BaseCol>
      ))
    ) : (
      <div className="liquid-empty-state">
        <span className="liquid-text">{t('No transaction data')}</span>
        <div className="liquid-icon">📊</div>
      </div>
    );

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const TransactionSkeletons = () => {
    return (
      <div className="liquid-loading-container">
        <div className="liquid-loader"></div>
        <p className="liquid-text">{t('common.loading')}</p>
      </div>
    );
  };

  const prepareChartData = () => {
    const sortedStory = [...story].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Filter out negative values and their corresponding labels
    const positiveStory = sortedStory.filter((item) => parseFloat(item.value) > 0);

    const labels = positiveStory.map((item) => new Date(item.date).toLocaleDateString());
    const amounts = positiveStory.map((item) => {
      const amount = parseFloat(item.value);
      return isNaN(amount) ? 0 : amount;
    });

    return {
      labels,
      datasets: [
        {
          label: 'Transaction Amount',
          data: amounts,
          fill: true,
          backgroundColor: (context: any) => {
            const ctx = context.chart.ctx;
            const gradient = ctx.createLinearGradient(0, 0, 0, 400);
            // Fix: Use a direct color value instead of object
            gradient.addColorStop(0, 'rgba(0, 255, 255, 0.15)');
            gradient.addColorStop(1, 'rgba(0, 255, 255, 0.05)');
            return gradient;
          },
          borderColor: liquidBlueTheme.primary,
          pointBackgroundColor: liquidBlueTheme.primary,
          pointBorderColor: liquidBlueTheme.textMain,
          pointHoverBackgroundColor: liquidBlueTheme.textMain,
          pointHoverBorderColor: liquidBlueTheme.primary,
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    };
  };

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Amount',
          font: {
            size: 14,
            weight: 'bold',
          },
          color: liquidBlueTheme.textMain,
        },
        ticks: {
          font: {
            size: 12,
          },
          color: liquidBlueTheme.textLight,
        },
        grid: {
          color: liquidBlueTheme.borderBase,
        },
      },
      x: {
        title: {
          display: true,
          text: 'Date',
          font: {
            size: 14,
            weight: 'bold',
          },
          color: liquidBlueTheme.textMain,
        },
        ticks: {
          font: {
            size: 11,
          },
          color: liquidBlueTheme.textLight,
        },
        grid: {
          color: liquidBlueTheme.borderBase,
        },
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            size: 12,
          },
          color: liquidBlueTheme.textMain,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: liquidBlueTheme.primary,
        bodyColor: liquidBlueTheme.textMain,
        borderColor: liquidBlueTheme.primary,
        borderWidth: 1,
      },
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart',
    },
    hover: {
      mode: 'nearest' as const,
      intersect: true,
    },
  };

  // Transaction Modal Component - rendered via portal
  const TransactionModal = () => {
    if (!isModalVisible) return null;
    
    return ReactDOM.createPortal(
      <Modal
        title={<span className="liquid-glow-text">{t('nft.yourTransactions')}</span>}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={900}
        className="liquid-modal"
        centered
        destroyOnClose
      >
        <div style={{ height: '400px', marginBottom: '20px' }}>
          <Line data={prepareChartData()} options={chartOptions} />
        </div>
        <div className="liquid-transactions-list">
          {isLoading ? <TransactionSkeletons /> : <S.ActivityRow gutter={[26, 26]}>{activityContent}</S.ActivityRow>}
        </div>
      </Modal>,
      document.body
    );
  };

  return (
    <LiquidWrapper className="liquid-dashboard-element">
      <TitleContainer>
        <S.Title level={2} className="liquid-glow-text">{t('nft.yourTransactions')}</S.Title>
        <ViewTransactions
          bordered={false}
          onClick={showModal}
          className="liquid-button-text"
        >
          {t('nft.viewTransactions')}
        </ViewTransactions>
      </TitleContainer>

      <ButtonTrigger amount={0}/>

      {/* Liquid glass divider between Unconfirmed and Confirmed transactions */}
      <div
        style={{
          width: '100%',
          height: '2px',
          background: 'linear-gradient(90deg, transparent, rgba(0, 255, 255, 0.2), rgba(45, 212, 191, 0.15), rgba(0, 255, 255, 0.2), transparent)',
          margin: '1.25rem 0',
          position: 'relative',
          borderRadius: '1px',
          boxShadow: '0 0 10px rgba(0, 255, 255, 0.1), inset 0 0 3px rgba(255, 255, 255, 0.05)',
        }}
      />

      {isLoading ? <TransactionSkeletons /> : <S.ActivityRow gutter={[26, 26]}>{activityContent}</S.ActivityRow>}

      {/* Transaction Modal - rendered via portal */}
      <TransactionModal />
    </LiquidWrapper>
  );
};