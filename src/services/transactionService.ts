// Mock data - in a real app, this would be API calls

export type Transaction = {
  id: string;
  amount: number;
  description: string;
  date: string;
  status: string;
  type: string;
}

const mockTransactions: Transaction[] = [
  {
    id: '1',
    amount: 99.99,
    description: 'Premium Subscription',
    date: '2023-11-15T10:30:00Z',
    status: 'completed',
    type: 'payment'
  },
  {
    id: '2',
    amount: 49.99,
    description: 'Monthly Plan',
    date: '2023-11-10T14:45:00Z',
    status: 'refunded',
    type: 'refund'
  }
]

export const getTransaction = async (id: string) => {
  // Simulate API delay
  console.log(id)
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockTransactions[0] || null;
};

export const getTransactions = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockTransactions;
};
