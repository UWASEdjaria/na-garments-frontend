'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  FiAlertCircle,
  FiCheckCircle,
  FiRefreshCw,
  FiSearch,
  FiShield,
  FiUsers,
  FiUserCheck,
  FiUserX,
} from 'react-icons/fi';
import { adminUserService } from '@/app/services/admin-user.service';
import type {
  AdminUser,
  AdminUserListResponse,
  AdminUserRole,
} from '@/app/types/admin-user';

const PAGE_SIZE = 10;

function formatRwf(amount: number): string {
  return new Intl.NumberFormat('en-RW', {
    style: 'currency',
    currency: 'RWF',
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  return new Intl.DateTimeFormat('en-RW', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

function SummaryCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: typeof FiUsers;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <Icon aria-hidden="true" className="h-5 w-5 text-[#123B5D]" />
      </div>
      <p className="mt-3 text-3xl font-bold text-[#123B5D]">
        {value.toLocaleString()}
      </p>
    </div>
  );
}

export default function AdminUsersPage() {
  const [result, setResult] = useState<AdminUserListResponse | null>(null);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [role, setRole] = useState<'ALL' | AdminUserRole>('ALL');
  const [verified, setVerified] = useState<'ALL' | 'true' | 'false'>('ALL');
  const [page, setPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await adminUserService.getUsers({
        search,
        role,
        verified,
        page,
        pageSize: PAGE_SIZE,
      });

      setResult(response);
    } catch {
      setError(
        'Could not load users. Check your admin login and backend connection, then try again.',
      );
    } finally {
      setLoading(false);
    }
  }, [search, role, verified, page, refreshKey]);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  function submitSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  }

  function changeRole(value: 'ALL' | AdminUserRole) {
    setRole(value);
    setPage(1);
  }

  function changeVerification(value: 'ALL' | 'true' | 'false') {
    setVerified(value);
    setPage(1);
  }

  const summary = result?.summary;
  const pagination = result?.pagination;
  const users: AdminUser[] = result?.data ?? [];

  return (
    <main className="min-w-0 space-y-6 p-4 sm:p-6 lg:p-8">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
        
          <h1 className="mt-2 text-2xl font-bold text-[#123B5D] sm:text-3xl">
            Users Management
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Manage customer accounts, administrators, and email verification.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setRefreshKey((value) => value + 1)}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-[#123B5D] hover:bg-gray-50 disabled:opacity-50"
        >
          <FiRefreshCw
            aria-hidden="true"
            className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`}
          />
          Refresh
        </button>
      </header>

      {summary && (
        <section
          aria-label="User statistics"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5"
        >
          <SummaryCard
            label="Total users"
            value={summary.totalUsers}
            icon={FiUsers}
          />
          <SummaryCard
            label="Customers"
            value={summary.customerCount}
            icon={FiUserCheck}
          />
          <SummaryCard
            label="Administrators"
            value={summary.adminCount}
            icon={FiShield}
          />
          <SummaryCard
            label="Verified emails"
            value={summary.verifiedCount}
            icon={FiCheckCircle}
          />
          <SummaryCard
            label="Unverified emails"
            value={summary.unverifiedCount}
            icon={FiUserX}
          />
        </section>
      )}

      <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
        <form
          onSubmit={submitSearch}
          className="flex flex-col gap-3 lg:flex-row"
        >
          <label className="relative min-w-0 flex-1">
            <span className="sr-only">Search users</span>
            <FiSearch
              aria-hidden="true"
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
            />
            <input
              type="search"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search name, email, or phone..."
              className="w-full rounded-lg border border-gray-200 py-3 pl-10 pr-3 text-sm outline-none focus:border-[#123B5D] focus:ring-2 focus:ring-[#123B5D]/10"
            />
          </label>

          <button
            type="submit"
            className="rounded-lg bg-[#123B5D] px-5 py-3 text-sm font-semibold text-white hover:bg-[#0d2e49]"
          >
            Search
          </button>

          <label className="min-w-0 lg:w-44">
            <span className="sr-only">Filter by role</span>
            <select
              value={role}
              onChange={(event) =>
                changeRole(event.target.value as 'ALL' | AdminUserRole)
              }
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-3 text-sm outline-none focus:border-[#123B5D]"
            >
              <option value="ALL">All roles</option>
              <option value="CUSTOMER">Customers</option>
              <option value="ADMIN">Administrators</option>
            </select>
          </label>

          <label className="min-w-0 lg:w-48">
            <span className="sr-only">Filter by email verification</span>
            <select
              value={verified}
              onChange={(event) =>
                changeVerification(
                  event.target.value as 'ALL' | 'true' | 'false',
                )
              }
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-3 text-sm outline-none focus:border-[#123B5D]"
            >
              <option value="ALL">All verification statuses</option>
              <option value="true">Verified</option>
              <option value="false">Unverified</option>
            </select>
          </label>
        </form>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 pt-4 text-sm text-gray-500">
          <p>
            {loading
              ? 'Loading users...'
              : `${pagination?.total ?? 0} user(s) found`}
          </p>
          <p>Newest registrations first</p>
        </div>

        {error && (
          <div
            role="alert"
            className="mt-4 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            <FiAlertCircle
              aria-hidden="true"
              className="mt-0.5 h-5 w-5 shrink-0"
            />
            <div>
              <p>{error}</p>
              <button
                type="button"
                onClick={() => setRefreshKey((value) => value + 1)}
                className="mt-2 font-semibold underline"
              >
                Try again
              </button>
            </div>
          </div>
        )}

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[1050px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                <th scope="col" className="px-4 py-4 font-semibold">User</th>
                <th scope="col" className="px-4 py-4 font-semibold">Phone</th>
                <th scope="col" className="px-4 py-4 font-semibold">Role</th>
                <th scope="col" className="px-4 py-4 font-semibold">Email status</th>
                <th scope="col" className="px-4 py-4 font-semibold">Registered</th>
                <th scope="col" className="px-4 py-4 font-semibold">Orders</th>
                <th scope="col" className="px-4 py-4 font-semibold">Custom orders</th>
                <th scope="col" className="px-4 py-4 font-semibold">Paid spend</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading && users.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-gray-500">
                    Loading user accounts...
                  </td>
                </tr>
              )}

              {!loading && !error && users.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-gray-500">
                    No users found. Try changing your search or filters.
                  </td>
                </tr>
              )}

              {users.map((user) => (
                <tr key={user.id} className="transition hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <p className="font-semibold text-[#123B5D]">
                      {user.name}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {user.email}
                    </p>
                  </td>

                  <td className="px-4 py-4 text-gray-600">
                    {user.phone || '—'}
                  </td>

                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        user.role === 'ADMIN'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {user.role === 'ADMIN' ? 'Admin' : 'Customer'}
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        user.isEmailVerified
                          ? 'bg-green-100 text-green-700'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {user.isEmailVerified ? 'Verified' : 'Unverified'}
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-4 py-4 text-gray-600">
                    {formatDate(user.createdAt)}
                  </td>

                  <td className="px-4 py-4 font-medium text-gray-700">
                    {user.orderCount}
                  </td>

                  <td className="px-4 py-4 font-medium text-gray-700">
                    {user.customOrderCount}
                  </td>

                  <td className="whitespace-nowrap px-4 py-4 font-semibold text-[#123B5D]">
                    {formatRwf(user.paidOrderSpend)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <footer className="mt-5 flex flex-col items-center justify-between gap-3 border-t border-gray-100 pt-4 sm:flex-row">
          <p className="text-sm text-gray-500">
            Page {pagination?.page ?? page} of {Math.max(1, pagination?.totalPages ?? 1)}
          </p>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={loading || page <= 1}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-[#123B5D] hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            <button
              type="button"
              onClick={() =>
                setPage((current) =>
                  Math.min(pagination?.totalPages ?? 1, current + 1),
                )
              }
              disabled={
                loading ||
                page >= (pagination?.totalPages ?? 1)
              }
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-[#123B5D] hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </footer>
      </section>
    </main>
  );
}
