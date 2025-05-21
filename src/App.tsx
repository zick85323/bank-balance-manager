import React, { useState, useEffect } from 'react';
import ReactModal from 'react-modal';
import styled from 'styled-components';

// Styled components
const Container = styled.div`
  display: flex;
  min-height: 100vh;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #1a365d 0%, #15315a 100%);
`;

const BalanceCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
  width: 400px;
  text-align: center;
  margin-bottom: 2rem;
`;

const BankName = styled.h1`
  color: #1a365d;
  font-size: 1.5rem;
  margin-bottom: 1rem;
  font-weight: 600;
`;

const BalanceAmount = styled.div`
  font-size: 2.5rem;
  color: #2ecc71;
  font-weight: 700;
  margin: 1rem 0;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s;
  cursor: pointer;
  font-size: 1rem;
  
  ${({ variant }) => variant === 'primary' ? `
    background: #2ecc71;
    color: white;
    border: none;
    
    &:hover {
      background: #27ae60;
      transform: translateY(-1px);
    }
  ` : `
    background: white;
    color: #333;
    border: 1px solid #ddd;
    
    &:hover {
      background: #f5f5f5;
      transform: translateY(-1px);
    }
  `}
`;

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  width: 450px;
  max-width: 90vw;
`;

const Input = styled.input<{ disabled?: boolean }>`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin: 8px 0;
  font-size: 16px;
  transition: border-color 0.2s;
  
  &:focus {
    border-color: #2ecc71;
    outline: none;
  }
  
  ${({ disabled }) => disabled && `
    background: #f9f9f9;
    color: #666;
  `}
`;

// Main component
export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentBalance, setCurrentBalance] = useState<number>(() => {
    // Load balance from localStorage or use default
    const savedBalance = localStorage.getItem('bankBalance');
    return savedBalance ? parseInt(savedBalance) : 2500000;
  });
  const [newBalance, setNewBalance] = useState('');

  // Save balance to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('bankBalance', currentBalance.toString());
  }, [currentBalance]);

  const formatCurrency = (value: string | number) => {
    const digits = typeof value === 'string' ? value.replace(/\D/g, '') : value.toString();
    return digits ? `₦${parseInt(digits).toLocaleString('en-NG')}` : '';
  };

  const handleSubmit = () => {
    const numericValue = parseInt(newBalance.replace(/\D/g, ''));
    if (!isNaN(numericValue)) {
      setCurrentBalance(numericValue);
    }
    setIsOpen(false);
    setNewBalance('');
  };

  return (
    <Container>
      <BalanceCard>
        <BankName>First Bank of Nigeria</BankName>
        <div style={{ color: '#666', marginBottom: '0.5rem' }}>
          Current Account Balance
        </div>
        <BalanceAmount>
          {formatCurrency(currentBalance)}
        </BalanceAmount>
        <Button 
          variant="primary" 
          onClick={() => setIsOpen(true)}
          style={{ marginTop: '1rem' }}
        >
          Update Balance
        </Button>
      </BalanceCard>

      <ReactModal
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
        style={{
          overlay: {
            backgroundColor: 'rgba(0,0,0,0.4)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backdropFilter: 'blur(3px)'
          },
          content: {
            position: 'relative',
            inset: 'auto',
            border: 'none',
            borderRadius: '16px',
            padding: '0'
          }
        }}
      >
        <ModalContent>
          <h2 style={{ 
            margin: '0 0 1.5rem', 
            fontSize: '1.5rem',
            color: '#1a365d',
            fontWeight: '600'
          }}>
            Update Bank Balance
          </h2>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#666' }}>
              Current Balance
            </label>
            <Input
              value={formatCurrency(currentBalance)}
              disabled
            />
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#666' }}>
              New Balance (NGN)
            </label>
            <Input
              value={newBalance}
              onChange={(e) => setNewBalance(formatCurrency(e.target.value))}
              placeholder="₦0"
            />
          </div>

          <div style={{ 
            display: 'flex', 
            gap: '1rem', 
            justifyContent: 'flex-end',
            borderTop: '1px solid #eee',
            paddingTop: '1.5rem'
          }}>
            <Button onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={handleSubmit}
              disabled={!newBalance}
            >
              Update Balance
            </Button>
          </div>
        </ModalContent>
      </ReactModal>
    </Container>
  );
}
