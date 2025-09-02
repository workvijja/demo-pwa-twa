'use client';

import { useQuery } from '@tanstack/react-query';
import { notFound } from 'next/navigation';
import { getTransaction } from '@/services/transactionService';
import { Skeleton } from '@/components/ui/skeleton';
import {use} from "react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function TransactionPage({ params }: PageProps) {
  const {id} = use(params);
  const {
    data: transaction,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['transaction', id],
    queryFn: () => getTransaction(id),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="pt-4 space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !transaction) {
    notFound();
  }

  const formattedDate = new Date(transaction.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Transaction Details</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-gray-500 text-sm">Transaction ID</p>
              <p className="font-mono">{transaction.id}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              transaction.status === 'completed' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-gray-500 text-sm">Amount</p>
              <p className="text-2xl font-bold">
                ${transaction.amount.toFixed(2)}
                <span className="text-sm font-normal text-gray-500 ml-2">USD</span>
              </p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">Description</p>
              <p>{transaction.description}</p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">Date</p>
              <p>{formattedDate}</p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">Type</p>
              <p>{transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}</p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <a
              href="/transactions"
              className="text-blue-600 hover:underline"
            >
              &larr; Back to transactions
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
