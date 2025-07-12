import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { BaseInput } from '@app/components/common/inputs/BaseInput/BaseInput';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { BaseSpin } from '@app/components/common/BaseSpin/BaseSpin';
import { Alert } from 'antd';
import * as S from './SendForm.styles';
import { truncateString } from '@app/utils/utils';
import useBalanceData from '@app/hooks/useBalanceData';
import { BaseCheckbox } from '@app/components/common/BaseCheckbox/BaseCheckbox';
import config from '@app/config/config';
import TieredFees from './components/TieredFees/TieredFees';
import useWalletAuth from '@app/hooks/useWalletAuth'; // Import the auth hook
import { deleteWalletToken, readToken } from '@app/services/localStorage.service'; // Assuming this is where deleteWalletToken is defined
import { bech32 } from 'bech32';
interface SendFormProps {
  onSend: (status: boolean, address: string, amount: number, txid?: string, message?: string) => void;
}

interface PendingTransaction {
  txid: string;
  feeRate: number;
  timestamp: string; // ISO format string
  amount: number;
  recipient_address: string;
  enable_rbf: boolean;
}

export type tiers = 'low' | 'med' | 'high';

const SendForm: React.FC<SendFormProps> = ({ onSend }) => {
  const { balanceData, isLoading } = useBalanceData();
  const { isAuthenticated, login, token, loading: authLoading, checkWalletHealth, walletHealth, healthLoading } = useWalletAuth(); // Use the auth hook

  const [loading, setLoading] = useState(false);

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const [inValidAmount, setInvalidAmount] = useState(false);
  const [addressError, setAddressError] = useState(false);

  const [amountWithFee, setAmountWithFee] = useState<number | null>(null);

  const [fee, setFee] = useState<number>(0);
  const [feeRate, setFeeRate] = useState<number>(0);
  const [formData, setFormData] = useState({
    address: '',
    amount: '1',
  });

  const [txSize, setTxSize] = useState<number | null>(null);
  const [txSizeCalculating, setTxSizeCalculating] = useState(false);

  const [enableRBF, setEnableRBF] = useState(false); // Default to false

  // Memoize the isValidAddress check to prevent unnecessary recalculations
  const isValidAddress = useCallback((address: string) => {
    if (address.length === 0) {
      return false;
    }
    return validateBech32Address(address);
  }, []);

  // Health check when component mounts or when authentication status changes
  useEffect(() => {
    if (isAuthenticated) {
      checkWalletHealth();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]); // Only depend on isAuthenticated to prevent excessive calls

  // First useEffect - Transaction size calculation
  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      const fetchTransactionSize = async () => {
        if (isValidAddress(formData.address) && isDetailsOpen) {
          // Prevent multiple simultaneous transaction size calculations
          if (txSizeCalculating) {
            console.log('Transaction size calculation already in progress, skipping');
            return;
          }

          try {
            setTxSizeCalculating(true);
            
            if (!isAuthenticated) {
              console.log('Not Authenticated.');
              await login();
              return;
            }

            // Check wallet health before making transaction calculations
            const health = await checkWalletHealth();
            if (!health || health.status !== 'healthy' || !health.chain_synced) {
              console.log('Wallet not ready (unhealthy or not synced), skipping transaction calculation');
              return;
            }

            let response = await fetch(`${config.baseURL}/api/wallet-proxy/calculate-tx-size`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                recipient_address: formData.address,
                spend_amount: parseInt(formData.amount),
                priority_rate: feeRate,
              }),
            });

            // Handle 401 by re-authenticating and retrying
            if (response.status === 401) {
              const errorText = await response.text();
              if (errorText.includes('Token expired') || errorText.includes('Unauthorized: Invalid token')) {
                console.log('Session expired. Re-authenticating and retrying...');
                deleteWalletToken();
                await login();
                
                // Retry the request with the new token
                response = await fetch(`${config.baseURL}/api/wallet-proxy/calculate-tx-size`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify({
                    recipient_address: formData.address,
                    spend_amount: parseInt(formData.amount),
                    priority_rate: feeRate,
                  }),
                });
                
                if (!response.ok) {
                  throw new Error(`HTTP error! status: ${response.status}`);
                }
              } else {
                throw new Error(errorText);
              }
            }

            const result = await response.json();
            setTxSize(result.txSize);
          } catch (error) {
            console.error('Error fetching transaction size:', error);
            setTxSize(null);
          } finally {
            setTxSizeCalculating(false);
          }
        }
      };

      fetchTransactionSize();
    }, 500);

    return () => clearTimeout(debounceTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.address, formData.amount, feeRate, isDetailsOpen]); // Only depend on actual form changes

  // Second useEffect - Fee calculation
  useEffect(() => {
    const estimatedFee = txSize ? txSize * feeRate : 0;
    setFee(estimatedFee);
  }, [txSize, feeRate]);

  // Third useEffect - Amount with fee calculation
  useEffect(() => {
    const amount = parseInt(formData.amount) || 0;
    setAmountWithFee(amount + fee);
  }, [fee, formData.amount]);

  // Fourth useEffect - Amount validation
  useEffect(() => {
    const amount = parseInt(formData.amount) || 0;
    const isInvalid = formData.amount.length <= 0 || (balanceData ? amount > balanceData.latest_balance : false);
    setInvalidAmount(isInvalid);
  }, [formData.amount, balanceData]);

  const handleFeeRateChange = useCallback((fee: number) => {
    setFeeRate(fee); // Update the new fee when it changes
  }, []);


  function validateBech32Address(address: string) {
    try {
      const decoded = bech32.decode(address);
      const validPrefixes = ['bc', 'tb']; // 'bc' for mainnet, 'tb' for testnet
      if (validPrefixes.includes(decoded.prefix)) {
        return true;
      } else {
        console.log('Invalid prefix.');
        return false;
      }
    } catch (err) {
      if (err instanceof Error) {
        console.error('Invalid Bech32 address:', err.message);
      } else {
        console.error('Invalid Bech32 address:', err);
      }
      return false;
    }
  }

  const handleAddressSubmit = () => {
    const isValid = isValidAddress(formData.address);

    if (isValid) {
      setAddressError(false);
      setIsDetailsOpen(true);
    } else {
      setAddressError(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSend = async () => {
    if (loading || inValidAmount) return;

    // Check wallet health before allowing transaction
    if (!isAuthenticated || !walletHealth || walletHealth.status !== 'healthy' || 
        !walletHealth.chain_synced) {
      return; // Don't proceed if wallet is not ready
    }

    setLoading(true);

    const selectedFee = feeRate; // The user-selected fee rate

    const transactionRequest = {
      choice: 1, // New transaction option
      recipient_address: formData.address,
      spend_amount: parseInt(formData.amount),
      priority_rate: selectedFee,
      enable_rbf: enableRBF,
    };

    try {
      // Step 1: Ensure the user is authenticated
      if (!isAuthenticated) {
        await login(); // Perform login if not authenticated
      }


      // Step 2: Initiate the new transaction with the JWT token via panel API
      const response = await fetch(`${config.baseURL}/api/wallet-proxy/transaction`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Include JWT token in headers
        },
        body: JSON.stringify(transactionRequest),
      });

      if (response.status === 401) {
        const errorText = await response.text();
        if (errorText.includes('Token expired') || errorText.includes('Unauthorized: Invalid token')) {
          // Token has expired, trigger a re-login
          console.log('Session expired. Please log in again.');
          deleteWalletToken(); // Clear the old token
          await login(); // Re-initiate login
        }
        throw new Error(errorText);
      }

      const result = await response.json();

      // Check the status from the wallet's response
      if (result.status === 'success' || result.status === 'pending') {
        // Step 2: If the transaction succeeds or is pending, update the pending transactions
        const pendingTransaction: PendingTransaction = {
          txid: result.txid,
          feeRate: Math.round(selectedFee), // Ensure feeRate is an integer
          timestamp: new Date().toISOString(), // Already in correct ISO format expected by Go's time.Time
          amount: parseInt(formData.amount, 10), // Parse amount as an integer
          recipient_address: formData.address,
          enable_rbf: enableRBF, // Already boolean and correct
        };

        // Fetch the JWT token using readToken()
        const pendingToken = readToken();

        const pendingResponse = await fetch(`${config.baseURL}/api/pending-transactions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${pendingToken}`, // Use the token from readToken()
          },
          body: JSON.stringify(pendingTransaction),
        });

        const pendingResult = await pendingResponse.json();

        // Step 3: Handle the final result from updating pending transactions
        if (pendingResponse.ok) {
          setLoading(false);
          onSend(true, formData.address, transactionRequest.spend_amount, result.txid, pendingResult.message); // Notify parent
        } else {
          setLoading(false);
          onSend(false, formData.address, 0, '', pendingResult.error || 'Failed to save pending transaction.');
        }
      } else {
        // Handle error in the wallet's transaction response
        setLoading(false);
        onSend(false, formData.address, 0, '', result.message || 'Transaction failed.');
      }
    } catch (error) {
      console.error('Transaction failed:', error);
      setLoading(false);
      onSend(false, formData.address, 0, '', 'Transaction failed due to a network error.');
    } finally {
      setLoading(false); // Ensure loading stops in all cases
    }
  };

  const receiverPanel = () => (
    <>
      <S.InputWrapper>
        <S.InputHeaderWrapper>
          <S.InputHeader>Address</S.InputHeader>
          {addressError && <S.ErrorText>Invalid Address</S.ErrorText>}
        </S.InputHeaderWrapper>
        <BaseInput name="address" value={formData.address} onChange={handleInputChange} placeholder="Send to" />
      </S.InputWrapper>
      <BaseButton onClick={handleAddressSubmit}>Continue</BaseButton>
    </>
  );

  const detailsPanel = () => (
    <S.FormSpacer>
      <S.InputWrapper>
        <S.TextRow>
          <S.InputHeader>{`Amount = ${amountWithFee ? amountWithFee : ''}`}</S.InputHeader>

          {inValidAmount && <S.ErrorText>Invalid Amount</S.ErrorText>}
        </S.TextRow>

        <div>
          <BaseInput onChange={handleInputChange} name="amount" value={formData.amount} placeholder="Amount" />
          <S.BalanceInfo>{`Balance: ${balanceData ? balanceData.latest_balance : 0}`}</S.BalanceInfo>
        </div>
      </S.InputWrapper>
      <S.TiersContainer>
        <S.InputHeader>Tiered Fees</S.InputHeader>
        <S.RBFWrapper>
          <BaseCheckbox
            checked={enableRBF}
            onChange={(e) => setEnableRBF(e.target.checked)} // Update the state when the checkbox is toggled
          />
          RBF Opt In
        </S.RBFWrapper>
        <TieredFees
          invalidAmount={inValidAmount} // Note: 'invalidAmount' property is now camelCase to match prop names
          handleFeeChange={handleFeeRateChange}
          transactionSize={txSize} // Pass the transaction size value
          originalFeeRate={0} // Pass 0 or appropriate value for new transactions
        />

      </S.TiersContainer>
      <BaseRow justify={'center'}>
        <S.SendFormButton
          disabled={loading || isLoading || inValidAmount || authLoading || addressError || !isWalletReady}
          onClick={handleSend}
          size="large"
          type="primary"
        >
          Send
        </S.SendFormButton>
      </BaseRow>
    </S.FormSpacer>
  );

  // Check if wallet is ready for transactions (healthy + synced = ready)
  const isWalletReady = isAuthenticated && walletHealth && walletHealth.status === 'healthy' && 
                       walletHealth.chain_synced;

  // Render wallet status indicator
  const renderWalletStatus = () => {
    if (!isAuthenticated) {
      return (
        <Alert
          message="Wallet Not Connected"
          description="Please authenticate with your wallet to access transaction features."
          type="warning"
          showIcon
          style={{ 
            marginBottom: '1rem',
            backgroundColor: 'var(--background-color-secondary)',
            border: '1px solid var(--border-color-base)',
            color: 'var(--text-main-color)'
          }}
        />
      );
    }

    if (healthLoading) {
      return (
        <Alert
          message="Checking Wallet Status..."
          type="info"
          showIcon
          style={{ 
            marginBottom: '1rem',
            backgroundColor: 'var(--background-color-secondary)',
            border: '1px solid var(--border-color-base)',
            color: 'var(--text-main-color)'
          }}
        />
      );
    }

    if (!walletHealth) {
      return (
        <Alert
          message="Wallet Status Unknown"
          description="Unable to connect to wallet service. Please check if the wallet is running."
          type="error"
          showIcon
          style={{ 
            marginBottom: '1rem',
            backgroundColor: 'var(--background-color-secondary)',
            border: '1px solid var(--border-color-base)',
            color: 'var(--text-main-color)'
          }}
        />
      );
    }

    if (walletHealth.status !== 'healthy') {
      return (
        <Alert
          message="Wallet Unhealthy"
          description="The wallet service is not functioning properly."
          type="error"
          showIcon
          style={{ 
            marginBottom: '1rem',
            backgroundColor: 'var(--background-color-secondary)',
            border: '1px solid var(--border-color-base)',
            color: 'var(--text-main-color)'
          }}
        />
      );
    }

    if (!walletHealth.chain_synced) {
      return (
        <Alert
          message="Blockchain Not Synced"
          description={`The wallet is still syncing with the blockchain. Connected to ${walletHealth.peer_count} peers. Please wait for sync to complete before sending transactions.`}
          type="warning"
          showIcon
          style={{ 
            marginBottom: '1rem',
            backgroundColor: 'var(--background-color-secondary)',
            border: '1px solid var(--border-color-base)',
            color: 'var(--text-main-color)'
          }}
        />
      );
    }

    // Wallet is healthy and synced
    return (
      <Alert
        message="Wallet Ready"
        description={`Wallet is online and synced. Connected to ${walletHealth.peer_count} peers.`}
        type="success"
        showIcon
        style={{ 
          marginBottom: '1rem',
          backgroundColor: 'var(--background-color-secondary)',
          border: '1px solid var(--border-color-base)',
          color: 'var(--text-main-color)'
        }}
      />
    );
  };

  return (
    <BaseSpin spinning={isLoading || loading || authLoading}>
      <S.SendBody justify={'center'}>
        <S.FormSpacer>
          <S.FormHeader>Send</S.FormHeader>
          {renderWalletStatus()}
          {isDetailsOpen ? (
            <>
              <S.Recipient>
                To:
                <br />
                <S.AddressText>{truncateString(formData.address, 65)}</S.AddressText>
              </S.Recipient>
              {detailsPanel()}
            </>
          ) : (
            receiverPanel()
          )}
        </S.FormSpacer>
      </S.SendBody>
    </BaseSpin>
  );
};

export default SendForm;
