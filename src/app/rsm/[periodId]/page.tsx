"use client";

import API from "@/lib/axios";
import { use, useEffect, useState } from "react";
import RsmRowComponent from "./components/RsmRowComponent";
import SavingModal from "@/components/SavingModal";
import MfoDropdownComponent from "./components/MfoDropdownComponent";
import { useRsmContext } from "../context/RsmContext";
import MfoEditComponent from "./components/MfoEditComponent";
import MfoMoverComponent from "./components/MfoMoverComponent";
import SiEditComponent from "./components/SiEditComponent";
import SiDeleteComponent from "./components/SiDeleteComponent";
import MfoDeleteComponent from "./components/MfoDeleteComponent";
import { useMfoEditModalContext } from "../context/MfoEditModalContext";
import { TbCirclePlus } from "react-icons/tb";
import RsmSkeleton from "@/components/skeletons/RsmSkeleton";

type Params = {
    periodId: string; // Next.js always passes route params as strings
};

type Header = {
    department: { department: string }
    period: string
    year: number
}

export default function RsmEditorPage({ params }: { params: Promise<Params> }) {
    const { periodId } = use(params);
    const [data, setData] = useState<Header>();
    const [employeesOption, setEmployeeOption] = useState<EmployeeOption[]>([])
    const [loading, setLoading] = useState(true);
    const [deleteSiId, setDeleteSiId] = useState<number | null>(null)

    const { rows, setRows } = useRsmContext();
    const { setSi, setRow, setPeriodId, setEditType } = useMfoEditModalContext();

    useEffect(() => {
        async function getRatingScaleMatrixInfo() {
            try {
                const response = await API.get("/api/rsm/title/" + periodId);
                setData(response.data);
            } catch (error) {
                console.log(error);
            }
        }

        async function getRsmRows() {
            setLoading(true)
            try {
                const response = await API.get("/api/rsm/" + periodId);
                setRows(response.data.rows);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }

        async function getEmployeesOption() {
            try {
                const response = await API.get("/api/getAllEmployees");
                setEmployeeOption(response.data)
            } catch (error) {
                console.log(error);
            }
        }

        getRatingScaleMatrixInfo()
        getRsmRows()
        getEmployeesOption()
    }, [periodId, setRows]);

    if (loading) {
        return (
            <RsmSkeleton />
        );
    }

    const editSuccessIndicator = (successIndicator: SuccessIndicator) => {
        setSi(successIndicator);
        (document.getElementById('siEditModal') as HTMLDialogElement)?.showModal()
    }

    async function reloadRows() {
        const response = await API.get("/api/rsm/" + periodId);
        setRows(response.data.rows);
    }

    async function promptDeleteSi(mi_id: number | null) {
        setDeleteSiId(mi_id);
        (document.getElementById("siDeleteModal") as HTMLDialogElement)?.showModal();
    }

    function handleAddNewMfo() {
        (document.getElementById('mfoEditModal') as HTMLDialogElement)?.showModal()
        setPeriodId(periodId)
        setEditType('new')
        setRow(undefined)
    }

    return (
        <div className="relative">
            <SavingModal />
            <div className="text-xl flex justify-center">{data?.department?.department}</div>
            <div className="text-lg flex justify-center">{data?.period} {data?.year}</div>
            <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 _h-screen">
                <table className="table table-pin-rows table-pin-cols">
                    <thead>
                        <tr className="text-center">
                            <th className="text-xs p-1 border-1 border-gray-300 bg-gray-50">MFO/PAP</th>
                            <th className="text-xs p-1 border-1 border-gray-300 bg-gray-50">SUCCESS INDICATOR</th>
                            <th className="text-xs p-1 border-1 border-gray-300 bg-gray-50">PERFORMANCE <br />MEASURES</th>
                            <th className="text-xs p-1 border-1 border-gray-300 bg-gray-50 text-center">QUALITY</th>
                            <th className="text-xs p-1 border-1 border-gray-300 bg-gray-50 text-center">EFFICIENCY</th>
                            <th className="text-xs p-1 border-1 border-gray-300 bg-gray-50 text-center">TIMELINESS</th>
                            <th className="text-xs p-1 border-1 border-gray-300 bg-gray-50">IN-CHARGE</th>
                            <th className="text-xs p-1 border-1 border-gray-300 bg-gray-50">OPTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows && rows.length > 0 ? (
                            rows.map((row: Row, index: number) => {
                                if (!row.has_si) {  // for mfos with no success indicator
                                    return (
                                        <tr key={index} className="hover:bg-gray-100">
                                            <td
                                                className="px-4 border-1 border-gray-300"
                                                colSpan={8}
                                                style={{ textIndent: row.indent ? row.indent * 10 : 0 }}
                                            >
                                                <MfoDropdownComponent row={row} /> {row.cf_count} {row.cf_title}
                                            </td>
                                        </tr>
                                    );
                                } else if (row.has_si && row.num_si === 1) { // for mfos with only one success indicator
                                    return (
                                        <tr key={index} className="hover:bg-gray-100">
                                            <RsmRowComponent row={row} index={0} onEditonSelect={editSuccessIndicator} onDelete={async (mi_id) => { promptDeleteSi(mi_id) }} />
                                        </tr>
                                    );
                                } else if (row.has_si && row.num_si > 1) { // for mfos with more than 1 success indicator
                                    return row.success_indicators.map((si: SuccessIndicator, sIndex: number) => {
                                        if (sIndex === 0) {
                                            return (
                                                <tr key={`${index}.${sIndex}`} className="hover:bg-gray-100">
                                                    <RsmRowComponent row={row} index={sIndex} onEditonSelect={editSuccessIndicator} onDelete={async (mi_id) => { promptDeleteSi(mi_id) }} />
                                                </tr>
                                            );
                                        } else {
                                            return (
                                                <tr key={`${index}.${sIndex}`} className="hover:bg-gray-100">
                                                    <RsmRowComponent row={row} index={sIndex} onEditonSelect={editSuccessIndicator} onDelete={async (mi_id) => { promptDeleteSi(mi_id) }} />
                                                </tr>
                                            );
                                        }
                                    });
                                }
                                return null;
                            })
                        ) : (
                            <tr>
                                <td colSpan={8} className="text-center py-4">
                                    No records found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* 
                Edit mfo modal below
            */}
            <MfoEditComponent onSaveSuccess={async () => { await reloadRows() }} />

            {/* 
                Move mfo modal below
            */}
            <MfoMoverComponent onSaveSuccess={async () => { await reloadRows() }} />

            {/* 
                Edit success indicator modal below
            */}

            <SiEditComponent employeesOption={employeesOption} onSaveSuccess={async () => { await reloadRows() }} />

            {/* 
                Delete success indicator modal below
            */}

            <SiDeleteComponent deleteSiId={deleteSiId} onDeleteSuccess={async () => await reloadRows()} />

            {/* 
                Delete MFO modal below
            */}

            <MfoDeleteComponent onDeleteSuccess={async () => await reloadRows()} />

            <button className="btn btn-primary fixed bottom-5 left-5" onClick={handleAddNewMfo}> <TbCirclePlus />Add MFO</button>

        </div >
    );
}
