import { notFound } from 'next/navigation';

export default function VerifyPage({
  params,
}: {
  params: { token: string };
}) {
  // In a real app, you would validate the token here
  const isValidToken = true; // Replace with actual token validation

  if (!isValidToken) {
    notFound();
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Email Verified</h1>
        <p className="text-gray-600">
          Thank you for verifying your email address. Your account is now active.
        </p>
        <div className="mt-6">
          <a
            href="/"
            className="text-blue-600 hover:underline"
          >
            Go to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
