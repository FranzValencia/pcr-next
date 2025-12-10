import { useEffect, useState } from "react";

type SetupSignatoriesModalProps = {
    id: string;
    isOpen: boolean;
    employees: EmployeeOption[];
    onSubmit: (data: { formType: string; immediateSup: number; departmentHead: number; headAgency: string }) => Promise<void>;
    isLoading: boolean;
}

export default function SetupSignatoriesModal({ id, isOpen, employees, onSubmit, isLoading }: SetupSignatoriesModalProps) {
    const [formType, setFormType] = useState<string>('');
    const [immediateSup, setImmediateSup] = useState<string>('');
    const [departmentHead, setDepartmentHead] = useState<string>('');
    const [headAgency, setHeadAgency] = useState<string>('JOHN T. RAYMOND, JR.');

    useEffect(() => {
        if (isOpen) {
            const modal = document.getElementById(id) as HTMLDialogElement;
            if (modal) {
                modal.showModal();
            }
        }
    }, [isOpen, id]);

    // Prevent closing on escape
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            e.preventDefault();
        }
    };

    const handleSubmit = async () => {
        if (!formType || !immediateSup || !departmentHead) return;
        await onSubmit({
            formType,
            immediateSup: Number(immediateSup),
            departmentHead: Number(departmentHead),
            headAgency
        });
    };

    return (
        <dialog id={id} className="modal" onKeyDown={handleKeyDown}>
            <div className="modal-box w-11/12 max-w-2xl">
                {/* No close button, as this is mandatory */}

                <h3 className="font-bold text-lg mb-4">Setup PCR Configuration</h3>
                <div className="alert alert-info mb-4">
                    <span>Please configure the PCR settings to proceed. Access requires these details.</span>
                </div>

                <div className="form-control w-full mb-4">
                    <label className="label">
                        <span className="label-text">Form Type</span>
                    </label>
                    <select
                        className="select select-bordered w-full"
                        value={formType}
                        onChange={(e) => setFormType(e.target.value)}
                        disabled={isLoading}
                    >
                        <option value="" disabled>Select Form Type</option>
                        <option value="1">IPCR (Individual)</option>
                        <option value="2">SPCR (Section)</option>
                        <option value="3">DPCR (Department)</option>
                        <option value="5">Division PCR</option>
                    </select>
                </div>

                <div className="form-control w-full mb-4">
                    <label className="label">
                        <span className="label-text">Immediate Supervisor</span>
                    </label>
                    <select
                        className="select select-bordered w-full"
                        value={immediateSup}
                        onChange={(e) => setImmediateSup(e.target.value)}
                        disabled={isLoading}
                    >
                        <option value="" disabled>Select Supervisor</option>
                        {employees.map(emp => (
                            <option key={emp.employee_id} value={emp.employee_id}>{emp.full_name}</option>
                        ))}
                    </select>
                </div>

                <div className="form-control w-full mb-4">
                    <label className="label">
                        <span className="label-text">Department Head</span>
                    </label>
                    <select
                        className="select select-bordered w-full"
                        value={departmentHead}
                        onChange={(e) => setDepartmentHead(e.target.value)}
                        disabled={isLoading}
                    >
                        <option value="" disabled>Select Department Head</option>
                        {employees.map(emp => (
                            <option key={emp.employee_id} value={emp.employee_id}>{emp.full_name}</option>
                        ))}
                    </select>
                </div>

                <div className="form-control w-full mb-4">
                    <label className="label">
                        <span className="label-text">Head of Agency</span>
                    </label>
                    <input
                        type="text"
                        placeholder="Head of Agency"
                        className="input input-bordered w-full"
                        value={headAgency}
                        onChange={(e) => setHeadAgency(e.target.value)}
                        disabled={isLoading}
                    />
                </div>

                <div className="modal-action">
                    <button
                        className={`btn btn-primary ${isLoading ? 'loading' : ''}`}
                        onClick={handleSubmit}
                        disabled={!formType || !immediateSup || !departmentHead || !headAgency || isLoading}
                    >
                        {isLoading ? 'Saving...' : 'Save & Proceed'}
                    </button>
                </div>
            </div>
        </dialog>
    );
}
