import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Form } from 'antd';
import { useLogin } from '@app/hooks/useLogin';
import { setUser } from '@app/store/slices/userSlice';
import { persistToken } from '@app/services/localStorage.service';
import { notificationController } from '@app/controllers/notificationController';
import { NostrExtensionCheck } from '@app/components/auth/NostrExtensionCheck';
import * as S from './LoginForm.styles';
import * as Auth from '@app/components/layouts/AuthLayout/AuthLayout.styles';
import { NostrProvider } from '@app/types/nostr';

interface LoginFormData {
  npub: string;
  password: string;
}

export const initValues: LoginFormData = {
  npub: '', // This will be dynamically set
  password: '',
};

export const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { login, verifyChallenge, isLoading } = useLogin();
  const dispatch = useDispatch();

  const [form] = Form.useForm();
  const [hasNostrExtension, setHasNostrExtension] = useState(!!window.nostr); // Initialize with current state
  const [isCheckingExtension, setIsCheckingExtension] = useState(!window.nostr); // Only check if not already available

  useEffect(() => {
    const fetchPublicKey = async () => {
      try {
        if (window.nostr) {
          const pubkey = await window.nostr.getPublicKey();
          form.setFieldsValue({ npub: pubkey });
          setHasNostrExtension(true);
          setIsCheckingExtension(false);
        }
      } catch (error) {
        console.error('Failed to get public key:', error);
      }
    };
  
    // If extension is already available, fetch immediately
    if (window.nostr) {
      fetchPublicKey();
      return;
    }
  
    // Only start polling if no extension is detected initially
    const intervalId = setInterval(() => {
      if (window.nostr) {
        fetchPublicKey();
        clearInterval(intervalId);
      }
    }, 1000);
  
    // Stop checking after 5 seconds to avoid infinite polling
    const timeoutId = setTimeout(() => {
      setIsCheckingExtension(false);
      clearInterval(intervalId);
    }, 5000);
  
    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, [form]);
  

  const [event, setEvent] = useState<any>(null);

  const handleSubmit = async (values: LoginFormData) => {
    try {
      if (!window.nostr) {
        notificationController.error({ message: 'Nostr extension is not available' });
        return;
      }
      
      const { success, event } = await login(values);
      if (success && event) {
        setEvent(event);
        const signedEvent = await window.nostr.signEvent(event);
        console.log('Signed event:', signedEvent);
  
        const response = await verifyChallenge({
          challenge: event.content,
          signature: signedEvent.sig,
          messageHash: event.id,
          event: signedEvent,
        });
  
        if (response.success) {
          if (response.token && response.user) {
            persistToken(response.token);
            dispatch(setUser(response.user));
            notificationController.success({
              message: 'Login successful',
              description: 'You have successfully logged in!',
            });
            navigate('/');
          } else {
            throw new Error('Login failed: Missing token or user data');
          }
        }
      }
    } catch (error: any) {
      notificationController.error({ message: error.message });
    }
  };
  

  // Show extension check only if we've finished checking and no extension was found
  if (!isCheckingExtension && !hasNostrExtension) {
    return (
      <Auth.FormWrapper>
        <NostrExtensionCheck onExtensionReady={() => {
          setHasNostrExtension(true);
          setIsCheckingExtension(false);
        }} />
      </Auth.FormWrapper>
    );
  }

  // Show login form (either extension is available or we're still checking in background)
  return (
    <Auth.FormWrapper>
      <Form form={form} layout="vertical" onFinish={handleSubmit} initialValues={initValues}>
        <Auth.FormTitle>{t('common.login')}</Auth.FormTitle>
        <S.LoginDescription>{t('login.loginInfo')}</S.LoginDescription>
        <S.HiddenInput>
          <Form.Item name="npub" label="Npub" rules={[{ required: true, message: 'Npub is required' }]}>
            <Auth.FormInput placeholder="Enter your Npub key" />
          </Form.Item>
        </S.HiddenInput>
        <Form.Item
          label={t('common.password')}
          name="password"
          rules={[{ required: true, message: t('common.requiredField') }]}
        >
          <Auth.FormInputPassword placeholder={t('common.password')} />
        </Form.Item>
        <Form.Item noStyle>
          <Auth.SubmitButton type="primary" htmlType="submit" loading={isLoading}>
            {t('common.login')}
          </Auth.SubmitButton>
        </Form.Item>
        <Auth.FooterWrapper>
          <Auth.Text style={{ marginBottom: '1rem' }}>
            {t('login.noAccount')}
          </Auth.Text>
          <Link to="/auth/sign-up" style={{ display: 'block', textDecoration: 'none' }}>
            <Auth.SecondaryButton type="default" block>
              {t('common.createAccount')}
            </Auth.SecondaryButton>
          </Link>
        </Auth.FooterWrapper>
      </Form>
    </Auth.FormWrapper>
  );
};
