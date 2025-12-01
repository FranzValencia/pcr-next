'use client';

import { useRef, useState, useEffect } from 'react';

type StrategicNotApplicableFormModalProps = {
  id: string;
  existingAccomplishment?: StrategicAccomplishment | null;
  onSubmit: (data: {
    mfo: string;
    succ_in: string;
    acc: string;
    average: number;
    remark: string;
    noStrat: number;
  }) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
};

export default function StrategicNotApplicableFormModal({
  id,
  existingAccomplishment,
  onSubmit,
  onCancel,
  isLoading = false,
}: StrategicNotApplicableFormModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [formData, setFormData] = useState({
    strategicFunc_id: existingAccomplishment?.strategicFunc_id || 0,
    mfo: existingAccomplishment?.mfo || '',
    succ_in: existingAccomplishment?.succ_in || '',
    acc: existingAccomplishment?.acc || '',
    average: existingAccomplishment?.average || 0,
    remark: existingAccomplishment?.remark || '',
    noStrat: existingAccomplishment?.noStrat || 1
  });

  useEffect(() => {
    if (existingAccomplishment) {
      setFormData({
        strategicFunc_id: existingAccomplishment?.strategicFunc_id || 0,
        mfo: existingAccomplishment?.mfo || '',
        succ_in: existingAccomplishment?.succ_in || '',
        acc: existingAccomplishment?.acc || '',
        average: existingAccomplishment?.average || 0,
        remark: existingAccomplishment?.remark || '',
        noStrat: existingAccomplishment?.noStrat || 1
      });
    } else {
      setFormData({
        strategicFunc_id: 0,
        mfo: '',
        succ_in: '',
        acc: '',
        average: 0,
        remark: '',
        noStrat: 1
      });
    }

  }, [existingAccomplishment]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit(formData);
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
    // setFormData({
    //   strategicFunc_id: 0,
    //   mfo: '',
    //   succ_in: '',
    //   acc: '',
    //   average: 0,
    //   remark: '',
    //   noStrat: 0
    // });
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

  const isEditMode = !!existingAccomplishment;

  return (
    <dialog id={id} ref={dialogRef} className="modal" onCancel={handleDialogCancel} onClick={handleBackdropClick}>
      <div className="modal-box max-w-3xl">
        <h3 className="font-bold text-lg mb-4">
          {isEditMode ? 'Edit Remarks' : 'Strategic Function Not Applicable'}
        </h3>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Actual Accomplishment */}

            {/* Remarks */}
            <div>
              <label className="label">
                <span className="label-text font-medium">Remarks (Optional)</span>
              </label>
              <textarea
                className="textarea textarea-bordered w-full"
                rows={2}
                value={formData.remark}
                onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
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
              disabled={isLoading}
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

