'use client';

import { useRef, useState } from 'react';

type NotApplicableFormModalProps = {
    id: string;
    successIndicator: SuccessIndicator | null;
    existingAccomplishment?: ActualAccomplishment | null;
    onSubmit: (data: { p_id?: number, remarks: string }) => Promise<void>;
    onCancel?: () => void;
    isLoading?: boolean;
};

export default function NotApplicableFormModal({
    id,
    successIndicator,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    existingAccomplishment,
    onSubmit,
    onCancel,
    isLoading = false,
}: NotApplicableFormModalProps) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [remarks, setRemarks] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await onSubmit({
                p_id: successIndicator?.mi_id,
                remarks: remarks
            });

            dialogRef.current?.close();
            setRemarks('');
        } catch (error) {
            console.error('Error submitting Not Applicable form:', error);
        }
    };

    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        }
        dialogRef.current?.close();
        setRemarks('');
    };

    const handleDialogCancel = (e: React.SyntheticEvent<HTMLDialogElement>) => {
        e.preventDefault();
    };

    const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
        if (e.target === dialogRef.current) {
            e.preventDefault();
            e.stopPropagation();
        }
    };

    return (
        <dialog
            id={id}
            ref={dialogRef}
            className="modal"
            onCancel={handleDialogCancel}
            onClick={handleBackdropClick}
        >
            <div className="modal-box max-w-lg">
                <h3 className="font-bold text-lg mb-4">Mark as Not Applicable</h3>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label className="label">
                                <span className="label-text font-medium">Remarks</span>
                            </label>
                            <textarea
                                className="textarea textarea-bordered w-full"
                                rows={3}
                                value={remarks}
                                onChange={(e) => setRemarks(e.target.value)}
                                disabled={isLoading}
                                placeholder="Enter remarks for marking this as not applicable..."
                                required
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
                            disabled={isLoading || !remarks.trim()}
                        >
                            {isLoading ? (
                                <>
                                    <span className="loading loading-spinner loading-sm"></span>
                                    Saving...
                                </>
                            ) : (
                                'Save'
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


