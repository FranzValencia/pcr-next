'use client';

import { useRef, useState, useEffect } from 'react';

type SupportFunctionFormModalProps = {
    id: string;
    supportFunction: SupportFunction | null;
    existingData?: SupportFunctionData | null;
    onSubmit: (data: {
        accomplishment: string;
        Q: number | null;
        E: number | null;
        T: number | null;
        A: number | null;
        remark: string;
    }) => Promise<void>;
    onCancel?: () => void;
    isLoading?: boolean;
};

export default function SupportFunctionFormModal({
    id,
    supportFunction,
    existingData,
    onSubmit,
    onCancel,
    isLoading = false,
}: SupportFunctionFormModalProps) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [formData, setFormData] = useState({
        accomplishment: existingData?.accomplishment || '',
        Q: existingData?.Q || null,
        E: existingData?.E || null,
        T: existingData?.T || null,
        A: existingData?.A || null,
        remark: existingData?.remark || '',
    });

    useEffect(() => {
        if (existingData) {
            setFormData({
                accomplishment: existingData.accomplishment || '',
                Q: existingData.Q || null,
                E: existingData.E || null,
                T: existingData.T || null,
                A: existingData.A || null,
                remark: existingData.remark || '',
            });
        } else {
            setFormData({
                accomplishment: '',
                Q: null,
                E: null,
                T: null,
                A: null,
                remark: '',
            });
        }
    }, [existingData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await onSubmit(formData);
            dialogRef.current?.close();
            setFormData({
                accomplishment: '',
                Q: null,
                E: null,
                T: null,
                A: null,
                remark: '',
            });
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        }
        dialogRef.current?.close();

        if (!existingData) {
            setFormData({
                accomplishment: '',
                Q: null,
                E: null,
                T: null,
                A: null,
                remark: '',
            });
        }
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

    const getRatingOptions = () => {
        const ratings = [
            { value: '5', label: '5 - Outstanding' },
            { value: '4', label: '4 - Very Satisfactory' },
            { value: '3', label: '3 - Satisfactory' },
            { value: '2', label: '2 - Unsatisfactory' },
            { value: '1', label: '1 - Poor' },
        ];
        return ratings;
    };

    const isEditMode = !!existingData;

    return (
        <dialog id={id} ref={dialogRef} className="modal" onCancel={handleDialogCancel} onClick={handleBackdropClick}>
            <div className="modal-box max-w-3xl">
                <h3 className="font-bold text-lg mb-4">
                    {isEditMode ? 'Edit Support Function Accomplishment' : 'Add Support Function Accomplishment'}
                </h3>

                {supportFunction && (
                    <div className="mb-4 p-3 bg-gray-100 rounded">
                        <p className="text-sm font-medium mb-1">Support Function:</p>
                        <p className="text-sm">{supportFunction.mfo} ({supportFunction.percent}%)</p>
                        <p className="text-sm text-gray-600 mt-1">Success Indicator: {supportFunction.suc_in}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        {/* Accomplishment */}
                        <div>
                            <label className="label">
                                <span className="label-text font-medium">Accomplishment *</span>
                            </label>
                            <textarea
                                className="textarea textarea-bordered w-full"
                                rows={4}
                                value={formData.accomplishment}
                                onChange={(e) => setFormData({ ...formData, accomplishment: e.target.value })}
                                required
                                disabled={isLoading}
                                placeholder="Describe the accomplishment..."
                            />
                        </div>

                        {/* Rating Fields */}
                        <div className="grid grid-cols-2 gap-4">
                            {/* Quality Rating */}
                            {supportFunction?.Q && (
                                <div>
                                    <label className="label">
                                        <span className="label-text font-medium">Quality (Q)</span>
                                    </label>
                                    <select
                                        className="select select-bordered w-full"
                                        value={formData.Q ?? ''}
                                        onChange={(e) => setFormData({ ...formData, Q: parseInt(e.target.value) })}
                                        disabled={isLoading}
                                    >
                                        <option value="" disabled>Select Quality Rating</option>
                                        {supportFunction.Q.filter(option => option !== null && option !== '').map((option, i) => (
                                            <option key={i} value={i + 1}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* Efficiency Rating */}
                            {supportFunction?.E && (
                                <div>
                                    {/* {supportFunction.E} */}
                                    <label className="label">
                                        <span className="label-text font-medium">Efficiency (E)</span>
                                    </label>
                                    <select
                                        className="select select-bordered w-full"
                                        value={formData.E ?? ''}
                                        onChange={(e) => setFormData({ ...formData, E: parseInt(e.target.value) })}
                                        disabled={isLoading}
                                    >
                                        <option value="" disabled>Select Efficiency Rating</option>
                                        {supportFunction.E.filter(option => option !== null && option !== '').map((option, i) => (
                                            <option key={i} value={i + 1}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* Timeliness Rating */}
                            {supportFunction?.T && (
                                <div>
                                    <label className="label">
                                        <span className="label-text font-medium">Timeliness (T)</span>
                                    </label>
                                    <select
                                        className="select select-bordered w-full"
                                        value={formData.T ?? ''}
                                        onChange={(e) => setFormData({ ...formData, T: parseInt(e.target.value) })}
                                        disabled={isLoading}
                                    >
                                        <option value="" disabled>Select Timeliness Rating</option>
                                        {supportFunction.T.filter(option => option !== null && option !== '').map((option, i) => (
                                            <option key={i} value={i + 1}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                        </div>

                        {/* Remarks */}
                        <div>
                            <label className="label">
                                <span className="label-text font-medium">Remarks</span>
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
                            disabled={isLoading || !formData.accomplishment.trim()}
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
