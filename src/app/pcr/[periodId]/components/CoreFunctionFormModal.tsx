'use client';

import { useRef, useState, useEffect } from 'react';

type AccomplishmentFormModalProps = {
  id: string;
  successIndicator: SuccessIndicator | null;
  existingAccomplishment?: ActualAccomplishment | null;
  onSubmit: (data: {
    actualAcc: string;
    Q: string;
    E: string;
    T: string;
    A: string;
    remarks: string;
    percent: number;
  }) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
};

export default function AccomplishmentFormModal({
  id,
  successIndicator,
  existingAccomplishment,
  onSubmit,
  onCancel,
  isLoading = false,
}: AccomplishmentFormModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [formData, setFormData] = useState({
    actualAcc: existingAccomplishment?.actualAcc || '',
    Q: existingAccomplishment?.Q || '',
    E: existingAccomplishment?.E || '',
    T: existingAccomplishment?.T || '',
    remarks: existingAccomplishment?.remarks || '',
    percent: existingAccomplishment?.percent || 0,
  });

  useEffect(() => {
    if (existingAccomplishment) {
      setFormData({
        actualAcc: existingAccomplishment.actualAcc || '',
        Q: existingAccomplishment.Q || '',
        E: existingAccomplishment.E || '',
        T: existingAccomplishment.T || '',
        remarks: existingAccomplishment.remarks || '',
        percent: existingAccomplishment.percent || 0,
      });
    } else {
      setFormData({
        actualAcc: '',
        Q: '',
        E: '',
        T: '',
        remarks: '',
        percent: 0,
      });
    }

  }, [existingAccomplishment]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit({ ...formData, A: '', percent: formData.percent || 0 });
      dialogRef.current?.close();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    dialogRef.current?.close();
    setFormData({
      actualAcc: '',
      Q: '',
      E: '',
      T: '',
      remarks: '',
      percent: 0,
    });
  };

  const handleDialogCancel = (e: React.SyntheticEvent<HTMLDialogElement>) => {
    e.preventDefault();
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    // Only prevent if clicking directly on the dialog element (backdrop), not on modal-box
    if (e.target === dialogRef.current) {
      e.preventDefault();
      e.stopPropagation();
    }


  };

  const getRatingOptions = (type: 'quality' | 'efficiency' | 'timeliness') => {
    if (!successIndicator) return [];

    let options: string[] = [];
    switch (type) {
      case 'quality':
        options = successIndicator.quality || [];
        break;
      case 'efficiency':
        options = successIndicator.efficiency || [];
        break;
      case 'timeliness':
        options = successIndicator.timeliness || [];
        break;
    }

    // Return options with their indices (1-indexed for display, but store as string index)
    return options.map((option, idx) => ({ value: String(5 - idx), label: option })).filter(opt => opt.label !== '');
  };

  const isEditMode = !!existingAccomplishment;

  return (
    <dialog id={id} ref={dialogRef} className="modal" onCancel={handleDialogCancel} onClick={handleBackdropClick}>


      <div className="modal-box max-w-3xl">
        <h3 className="font-bold text-lg mb-4">
          {isEditMode ? 'Edit Accomplishment' : 'Add Accomplishment'}
        </h3>

        {successIndicator && (
          <div className="mb-4 p-3 bg-gray-100 rounded">
            <p className="text-sm font-medium mb-1">Success Indicator:</p>
            <p className="text-sm">{successIndicator.mi_succIn}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Actual Accomplishment */}
            <div>
              <label className="label">
                <span className="label-text font-medium">Actual Accomplishment *</span>
              </label>
              <textarea
                className="textarea textarea-bordered w-full"
                rows={4}
                value={formData.actualAcc}
                onChange={(e) => setFormData({ ...formData, actualAcc: e.target.value })}
                required
                disabled={isLoading}
                placeholder="Describe the actual accomplishment..."
              />
            </div>

            {/* Rating Fields */}
            <div className="grid grid-cols-2 gap-4">
              {/* Quality Rating */}
              {successIndicator?.has_quality && (
                <div>
                  <label className="label">
                    <span className="label-text font-medium">Quality (Q)</span>
                  </label>
                  <select
                    className="select select-bordered w-full"
                    value={formData.Q}
                    onChange={(e) => setFormData({ ...formData, Q: e.target.value })}
                    disabled={isLoading}
                  >
                    <option value="" disabled>Select Quality Rating</option>
                    {getRatingOptions('quality').map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Efficiency Rating */}
              {successIndicator?.has_efficiency && (
                <div>
                  <label className="label">
                    <span className="label-text font-medium">Efficiency (E)</span>
                  </label>
                  <select
                    className="select select-bordered w-full"
                    value={formData.E}
                    onChange={(e) => setFormData({ ...formData, E: e.target.value })}
                    disabled={isLoading}
                  >
                    <option value="" disabled>Select Efficiency Rating</option>
                    {getRatingOptions('efficiency').map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Timeliness Rating */}
              {successIndicator?.has_timeliness && (
                <div>
                  <label className="label">
                    <span className="label-text font-medium">Timeliness (T)</span>
                  </label>
                  <select
                    className="select select-bordered w-full"
                    value={formData.T}
                    onChange={(e) => setFormData({ ...formData, T: e.target.value })}
                    disabled={isLoading}
                  >
                    <option value="" disabled>Select Timeliness Rating</option>
                    {getRatingOptions('timeliness').map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Percent */}
              <div>
                <label className="label">
                  <span className="label-text font-medium">Allocated Weight (%)</span>
                </label>
                <input
                  type="number"
                  className="input input-bordered w-full"
                  value={formData.percent}
                  onChange={(e) => setFormData({ ...formData, percent: parseFloat(e.target.value) || 0 })}
                  disabled={isLoading}
                  placeholder="0"
                  min="0"
                  max="100"
                  step="0.01"
                />
              </div>
            </div>

            {/* Remarks */}
            <div>
              <label className="label">
                <span className="label-text font-medium">Remarks</span>
              </label>
              <textarea
                className="textarea textarea-bordered w-full"
                rows={2}
                value={formData.remarks}
                onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                disabled={isLoading}
                placeholder="Optional remarks..."
              />
            </div>
          </div>

          <div className="modal-action mt-6">
            <button
              type="button"
              className="btn"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading || !formData.actualAcc.trim()}
            >
              {isLoading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  {isEditMode ? 'Updating...' : 'Saving...'}
                </>
              ) : (
                isEditMode ? 'Update' : 'Save'
              )}
            </button>
          </div>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button type="button">close</button>
      </form>
    </dialog>
  );
}

