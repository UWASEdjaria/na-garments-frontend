import { FiEye } from 'react-icons/fi';

import { AdminCustomOrder } from '@/app/types/admin-custom-order';

interface CustomOrderTableProps {
  orders: AdminCustomOrder[];
  onView: (orderId: string) => void;
}

export default function CustomOrderTable({
  orders,
  onView,
}: CustomOrderTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-[#123B5D] text-white">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold">
                Customer
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold">
                Garment
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold">
                Quantity
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold">
                Order Status
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold">
                Quote Status
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold">
                Payment
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold">
                Date
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-[#EEF3F6]">
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium text-[#111111]">
                      {order.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {order.email}
                    </p>
                  </div>
                </td>

                <td className="px-6 py-4 text-sm text-gray-700">
                  {order.garmentType}
                </td>

                <td className="px-6 py-4 text-sm text-gray-700">
                  {order.quantity}
                </td>

                <td className="px-6 py-4">
                  <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-700">
                    {order.status.replaceAll('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      order.quoteStatus === 'ACCEPTED'
                        ? 'bg-green-100 text-green-700'
                        : order.quoteStatus === 'DECLINED'
                          ? 'bg-red-100 text-red-700'
                          : order.quoteStatus === 'PROPOSED'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {order.quoteStatus.replaceAll('_', ' ')}
                  </span>
                </td>

                <td className="px-6 py-4 text-sm text-gray-700">
                  {order.paymentStatus}
                </td>

                <td className="px-6 py-4 text-sm text-gray-700">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>

                <td className="px-6 py-4">
                  <button
                    type="button"
                    onClick={() => onView(order.id)}
                    className="inline-flex items-center gap-2 rounded-lg bg-[#F28C28] px-3 py-2 text-sm font-medium text-white transition hover:opacity-90"
                  >
                    <FiEye />
                    View
                  </button>
                </td>
              </tr>
            ))}

            {orders.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  No custom orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}