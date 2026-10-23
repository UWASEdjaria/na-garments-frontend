'use client';

type ConfirmDeleteModalProps = {
itemName: string;
isDeleting: boolean;
onCancel: () => void;
onConfirm: () => void;
};

export default function ConfirmDeleteModal({
itemName,
isDeleting,
onCancel,
onConfirm,
}: ConfirmDeleteModalProps) {
return (

 <div className="mt-2 rounded-md border border-red-200 bg-red-50 p-3">
   <p className="text-sm font-medium text-gray-800">
    Delete <span className="font-bold">{itemName}</span>?
   </p>
  <div className="mt-2 flex gap-2">
    <button
      type="button"
      onClick={onCancel}
      disabled={isDeleting}
      className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
    >
      Cancel
    </button>

    <button
      type="button"
      onClick={onConfirm}
      disabled={isDeleting}
      className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isDeleting ? 'Deleting...' : 'Delete'}
    </button>
  </div>
</div>


);
}