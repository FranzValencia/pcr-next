"use client";

import API from "@/lib/axios";
import { use, useEffect, useState } from "react";
import ClearConfirmationModal from "@/components/ConfirmationModal";
import CoreFunctionFormModal from "./components/CoreFunctionFormModal";
import NotApplicableFormModal from "./components/NotApplicableFormModal";
import { CiFolderOn } from "react-icons/ci";
import StrategicFormModal from "./components/StrategicFormModal";
import PcrSkeleton from "@/components/skeletons/PcrSkeleton";
import StrategicNotApplicableFormModal from "./components/StrategicNotApplicableFormModal";
import SupportFunctionFormModal from "./components/SupportFunctionFormModal";

type Params = {
  periodId: string; // Next.js always passes route params as strings
};

export default function RsmEditorPage({ params }: { params: Promise<Params> }) {
  const { periodId } = use(params);

  const [form] = useState({
    period: 'January - June 2025',
    type: 1
  });

  const [ratee] = useState({
    id: 9,
    name: 'FRANZ JOSHUA A. VALENCIA, JR.',
    position: 'ADMINISTRATIVE OFFICER IV',
    department: 'HUMAN RESOURCE MANAGEMENT AND DEVELOPMENT OFFICE'
  });

  const [strategicAccomplishmentToEdit, setStrategicAccomplishmentToEdit] = useState<StrategicAccomplishment | null>(null)
  const [coreFunctions, setCoreFunctions] = useState<CoreFunctionData[]>([]);
  const [supportFunctions, setSupportFunctions] = useState<SupportFunction[]>([]);
  const [totalWeight, setTotalWeight] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  async function getCoreFunctions() {
    const res = await API.get('/api/pcr/' + periodId + '/core')
    const rows = res.data

    let weight = 0;
    rows.forEach((row: CoreFunctionData) => {
      if (row.acctual_accomplishment?.percent) {
        weight += row.acctual_accomplishment?.percent
      }
    });

    setTotalWeight(weight)
    setCoreFunctions(rows)
  }

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        await Promise.all([getStrategicFunction(), getCoreFunctions(), getSupportFunctions()]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [periodId])

  const [accomplishmentToClear, setAccomplishmentToClear] = useState<ActualAccomplishment | null>(null);
  const [isClearing, setIsClearing] = useState(false);

  const [accomplishmentToEdit, setAccomplishmentToEdit] = useState<{
    accomplishment: ActualAccomplishment | null;
    successIndicator: SuccessIndicator | null;
  } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [strategicAccomplishmentToClear, setStrategicAccomplishmentToClear] = useState<StrategicAccomplishment | null>(null);
  const [isClearingStrategic, setIsClearingStrategic] = useState(false);

  const [supportFunctionToEdit, setSupportFunctionToEdit] = useState<{
    supportFunction: SupportFunction | null;
    existingData: SupportFunctionData | null;
  } | null>(null);
  const [isSavingSupportFunction, setIsSavingSupportFunction] = useState(false);

  function openClearModal(actualAcc: ActualAccomplishment | null) {
    setAccomplishmentToClear(actualAcc);
    setIsClearing(false);
    (document.getElementById('clear_confirmation_modal') as HTMLDialogElement)?.showModal();
  }

  function openAddModal(successIndicator: SuccessIndicator | null) {
    setAccomplishmentToEdit({
      accomplishment: null,
      successIndicator: successIndicator,
    });
    (document.getElementById('accomplishment_form_modal') as HTMLDialogElement)?.showModal();
  }

  function openEditModal(accomplishment: ActualAccomplishment | null, successIndicator: SuccessIndicator | null) {
    setAccomplishmentToEdit({
      accomplishment: accomplishment,
      successIndicator: successIndicator,
    });
    (document.getElementById('accomplishment_form_modal') as HTMLDialogElement)?.showModal();
  }


  function openNaModal(accomplishment: ActualAccomplishment | null, successIndicator: SuccessIndicator | null) {
    setAccomplishmentToEdit({
      accomplishment: accomplishment,
      successIndicator: successIndicator,
    });
    (document.getElementById('not_applicable_form_modal') as HTMLDialogElement)?.showModal();
  }

  async function getStrategicFunction() {
    const res = await API.get('/api/pcr/' + periodId + '/strategic/' + ratee.id)
    setStrategicAccomplishmentToEdit(res.data)
  }

  async function getSupportFunctions() {
    const res = await API.post('/api/pcr/support', {
      period_id: periodId,
      emp_id: ratee.id,
      type: form.type
    })
    console.log('getSupportFunctions:', res.data);

    setSupportFunctions(res.data)
  }

  async function openStrategicFormModal() {
    (document.getElementById('strategic_form_modal') as HTMLDialogElement)?.showModal();
  }


  function openNaStrategicFormModal() {
    (document.getElementById('strategic_not_applicable_form_modal') as HTMLDialogElement)?.showModal();
  }


  async function handleStrategicSubmit(data: {
    mfo: string;
    succ_in: string;
    acc: string;
    average: number;
    remark: string;
    noStrat: number;
  }) {
    setIsSaving(true);
    await API.post('/api/pcr/accomplishment/strategic', { ...data, period_id: Number(periodId), emp_id: ratee.id })
    await getStrategicFunction()
    setIsSaving(false);
  }



  function openClearStrategicModal(stratAcc: StrategicAccomplishment) {
    setStrategicAccomplishmentToClear(stratAcc);
    setIsClearingStrategic(false);
    (document.getElementById('clear_strategic_confirmation_modal') as HTMLDialogElement)?.showModal();
  }

  async function clearStrategic() {
    if (strategicAccomplishmentToClear) {
      setIsClearingStrategic(true);
      try {
        await API.delete('/api/pcr/accomplishment/strategic/' + strategicAccomplishmentToClear.strategicFunc_id)
        await getStrategicFunction();
        setStrategicAccomplishmentToClear(null);
        (document.getElementById('clear_strategic_confirmation_modal') as HTMLDialogElement)?.close();
      } catch (error) {
        console.error("Error clearing strategic accomplishment:", error);
      } finally {
        setIsClearingStrategic(false);
      }
    }
  }


  async function clearSi() {
    if (accomplishmentToClear) {
      setIsClearing(true);
      try {
        await API.delete('/api/pcr/accomplishment/' + accomplishmentToClear.cfd_id)
        await getCoreFunctions();
        setAccomplishmentToClear(null);
        (document.getElementById('clear_confirmation_modal') as HTMLDialogElement)?.close();
      } catch (error) {
        console.error("Error clearing accomplishment:", error);
      } finally {
        setIsClearing(false);
      }
    }
  }

  async function handleNotApplicableSubmit(data: { p_id?: number, remarks: string }) {
    setIsSaving(true);
    try {
      if (accomplishmentToEdit?.accomplishment) {
        // Update existing Not Applicable entry
        await API.put('/api/pcr/accomplishment/' + accomplishmentToEdit.accomplishment.cfd_id, {
          ...data,
          disable: true
        });
      } else {
        // Create new Not Applicable entry
        await API.post('/api/pcr/na', data);
      }
      await getCoreFunctions();
    } catch (error) {
      console.error('Error saving Not Applicable:', error);
      throw error; // Re-throw to keep modal open on error
    } finally {
      setIsSaving(false);
    }
  }


  async function handleAccomplishmentSubmit(data: {
    actualAcc: string;
    Q: string;
    E: string;
    T: string;
    A: string;
    remarks: string;
    percent: number;
  }) {
    if (!accomplishmentToEdit?.successIndicator) return;

    setIsSaving(true);
    try {
      const payload = {
        p_id: accomplishmentToEdit.successIndicator.mi_id,
        empId: ratee.id,
        actualAcc: data.actualAcc,
        Q: data.Q,
        E: data.E,
        T: data.T,
        A: data.A || null,
        remarks: data.remarks,
        percent: data.percent || 0,
      };

      if (accomplishmentToEdit.accomplishment) {
        // Update existing
        await API.put('/api/pcr/accomplishment/' + accomplishmentToEdit.accomplishment.cfd_id, payload);
      } else {
        // Create new
        await API.post('/api/pcr/accomplishment', payload);
      }

      await getCoreFunctions();
      setAccomplishmentToEdit(null);
    } catch (error) {
      console.error("Error saving accomplishment:", error);
      throw error; // Re-throw to keep modal open
    } finally {
      setIsSaving(false);
    }
  }


  function openSupportFunctionAddModal(supportFunction: SupportFunction) {
    setSupportFunctionToEdit({
      supportFunction: supportFunction,
      existingData: null,
    });
    (document.getElementById('support_function_form_modal') as HTMLDialogElement)?.showModal();
  }

  function openSupportFunctionEditModal(supportFunction: SupportFunction, existingData: SupportFunctionData) {
    setSupportFunctionToEdit({
      supportFunction: supportFunction,
      existingData: existingData,
    });
    (document.getElementById('support_function_form_modal') as HTMLDialogElement)?.showModal();
  }

  async function handleSupportFunctionSubmit(data: {
    accomplishment: string;
    Q: number | null;
    E: number | null;
    T: number | null;
    remark: string;
  }) {
    if (!supportFunctionToEdit?.supportFunction) return;

    setIsSavingSupportFunction(true);
    try {
      const payload = {
        parent_id: supportFunctionToEdit.supportFunction.id_suppFunc,
        emp_id: ratee.id,
        period_id: Number(periodId),
        accomplishment: data.accomplishment,
        Q: data.Q,
        E: data.E,
        T: data.T,
        remark: data.remark,
        percent: supportFunctionToEdit.supportFunction.percent,
      };

      if (supportFunctionToEdit.existingData) {
        // Update existing
        await API.put('/api/pcr/support/accomplishment/' + supportFunctionToEdit.existingData.sfd_id, payload);
      } else {
        // Create new
        await API.post('/api/pcr/support/accomplishment', payload);
      }

      await getSupportFunctions();
      setSupportFunctionToEdit(null);
    } catch (error) {
      console.error("Error saving support function accomplishment:", error);
      throw error; // Re-throw to keep modal open
    } finally {
      setIsSavingSupportFunction(false);
    }
  }


  if (isLoading) {
    return <PcrSkeleton />;
  }

  return (
    <div className="w-full">
      {/* form start */}
      <div className=" bg-white h-screen m-5 text-sm no-margin">
        <div className="text-center text-lg font-medium pt-5">
          {
            form.type == 1 ? 'INDIVIDUAL PERFORMANCE COMMITMENT AND REVIEW (IPCR)' :
              form.type == 2 ? 'SECTION PERFORMANCE COMMITMENT AND REVIEW (SPCR)' :
                form.type == 3 ? 'DEPARTMENT PERFORMANCE COMMITMENT AND REVIEW (DPCR)' :
                  form.type == 5 ? 'DIVISION PERFORMANCE COMMITMENT AND REVIEW (DIVISION PCR)' :
                    <>{'< SET PCR FORMTYPE >'}</>
          }
        </div>
        <div className="mt-5 m-5">
          I, {ratee && ratee.name ? <span className="font-medium">{ratee.name}</span> : '__________________________________________'} , {ratee.position ? ratee.position : '_____________________________________________'} of the {ratee.department ? <span className="font-medium">{ratee.department}</span> : '_____________________________________________'} commit to deliver and agree to be rated on the attainment of the following targets in accordance with the indicated measures for the period {form.period ? form.period : '______________________________________'}.
        </div>
        <div className="float-right text-center mt-2 mr-10">
          <u><b>{ratee.name}</b></u>
          <div>Ratee</div>
        </div>

        <div>
          <table className="table-auto mt-20 border-collapse border border-gray-200 w-full">
            <tbody>
              <tr className="bg-green-200">
                <td className="border border-gray-200 p-2">
                  <div className="text-xs">Reviewed by:</div>
                  <div className="mt-10 text-center">
                    <u>VERONICA GRACE P. MIRAFLOR</u>
                    <div className="text-xs">Immediate Supervisor</div>
                  </div>
                </td>
                <td className="border border-gray-200 p-2">
                  <div className="text-xs">Noted by:</div>
                  <div className="mt-10 text-center">
                    <u>VERONICA GRACE P. MIRAFLOR</u>
                    <div className="text-xs">Department Head</div>
                  </div>
                </td>
                <td className="border border-gray-200 p-2">
                  <div className="text-xs">Approved by:</div>
                  <div className="mt-10 text-center">
                    <u>JOHN T. RAYMOND, JR.</u>
                    <div className="text-xs">Head of Agency</div>
                  </div>
                </td>
                <td className="border border-gray-200 p-2 w-40">
                  <div className="text-xs">Date:</div>
                  <div className="mt-10 text-center">
                    <u>08/18/25</u>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div>
          <table className="table-auto border-collapse border border-gray-200 w-full my-2">
            <thead>
              <tr className="bg-blue-100 h-10">
                <th className="border border-gray-200" rowSpan={2}>MFO/PAP</th>
                <th className="border border-gray-200" rowSpan={2}>Success Indicator</th>
                <th className="border border-gray-200" rowSpan={2}>Actual Accomplishments</th>
                <th className="border border-gray-200" colSpan={4}>Rating Matrix</th>
                <th className="border border-gray-200 px-2" rowSpan={2}>Remarks</th>
                <th className="border border-gray-200 text-3xl px-2" rowSpan={2}><CiFolderOn /></th>
                <th className="border border-gray-200 no-print" rowSpan={2}>Options</th>
              </tr>
              <tr className="bg-blue-100 h-10">
                <th className="border border-gray-200">Q</th>
                <th className="border border-gray-200">E</th>
                <th className="border border-gray-200">T</th>
                <th className="border border-gray-200">A</th>
              </tr>
            </thead>
            <tbody>





              {/* strategic start*/}
              <tr className="h-10">
                <td colSpan={9} className="p-2 font-bold bg-amber-100">Strategic Function</td>
                <td className="p-2 font-bold bg-amber-100 no-print"></td>
              </tr>

              {
                strategicAccomplishmentToEdit ?
                  <tr>
                    {
                      strategicAccomplishmentToEdit.noStrat === 0 ?
                        <>
                          <td className="border border-gray-200 p-2">{strategicAccomplishmentToEdit.mfo}</td>
                          <td className="border border-gray-200 p-2">{strategicAccomplishmentToEdit.succ_in}</td>
                          <td className="border border-gray-200 p-2" colSpan={4}>{strategicAccomplishmentToEdit.acc}</td>
                          <td className="border border-gray-200 p-2">{strategicAccomplishmentToEdit.average}</td>
                          <td className="border border-gray-200 p-2">{strategicAccomplishmentToEdit.remark}</td>
                          <td className="border border-gray-200 p-2"></td>
                          <td className="border border-gray-200 p-2 text-center no-print" style={{ width: 150 }}>
                            <button className="btn btn-sm btn-success btn-outline mr-2" onClick={openStrategicFormModal}>Edit</button>
                            <button className="btn btn-sm btn-error btn-outline" onClick={() => openClearStrategicModal(strategicAccomplishmentToEdit)}>Clear</button>
                          </td>
                        </> :
                        <>
                          <td colSpan={9} className="border border-gray-200 p-2 text-center font-bold text-gray-600"> {strategicAccomplishmentToEdit.remark ? strategicAccomplishmentToEdit.remark : 'No Strategic Function'}</td>
                          <td className="border border-gray-200 p-2 text-center no-print" style={{ width: 150 }}>
                            <button className="btn btn-sm btn-success btn-outline mr-2" onClick={openNaStrategicFormModal}>Edit</button>
                            <button className="btn btn-sm btn-error btn-outline" onClick={() => openClearStrategicModal(strategicAccomplishmentToEdit)}>Clear</button>
                          </td>
                        </>

                    }
                  </tr>
                  :
                  <tr>
                    <td colSpan={2} className="border border-gray-200 p-2"></td>
                    <td colSpan={7} className="border border-gray-200 p-2 text-center">
                      <button className="btn btn-sm btn-primary" onClick={openStrategicFormModal}>Add Accomplishment</button>
                      <button className="btn btn-sm ml-2" onClick={openNaStrategicFormModal}>Not Applicable</button>
                    </td>
                    <td className="border border-gray-200 p-2 no-print">

                    </td>
                  </tr>
              }

              {/* strategic end*/}






              {/* core functions start */}
              <tr className="h-10">
                <td colSpan={9} className="p-2 font-bold bg-amber-100">Core Functions (<span className="text-blue-600">{totalWeight ? totalWeight : '____'}%</span>)</td>
                <td className="p-2 font-bold bg-amber-100 no-print"></td>
              </tr>
              {
                coreFunctions ? coreFunctions.map((coreFunc, key) => {
                  if (coreFunc.mfo && !coreFunc.mfo.has_si) {
                    // if row has no si (mfo title only)
                    return <tr key={key}>
                      <td colSpan={9} className="border border-gray-200 p-2" style={{ textIndent: 20 * coreFunc.mfo.indent }}>{coreFunc.mfo.cf_count} {coreFunc.mfo.cf_title}</td>
                      <td className="border border-gray-200 p-2 no-print"></td>
                    </tr>
                  } else
                    // else if row has SIs
                    return <tr key={key} style={{ color: coreFunc.acctual_accomplishment?.disable ? 'blue' : '', fontWeight: coreFunc.acctual_accomplishment?.disable ? 'bold' : '' }}>
                      {
                        coreFunc.mfo ? (
                          <td className="border border-gray-200 p-2" style={{ position: 'relative' }}>
                            {
                              coreFunc.acctual_accomplishment && coreFunc.acctual_accomplishment.percent ?
                                <div className="bg-amber-100 text-center w-10" style={{ position: 'absolute', left: '2px' }}>{coreFunc.acctual_accomplishment.percent}%</div>
                                : ''
                            }
                            <div style={{ textIndent: 20 * coreFunc.mfo.indent }}>{coreFunc.mfo.cf_count} {coreFunc.mfo.cf_title}</div>
                          </td>
                        ) : (
                          <td className="border border-gray-200 p-2" style={{ position: 'relative' }}>
                            {
                              coreFunc.acctual_accomplishment && coreFunc.acctual_accomplishment.percent ?
                                <div className="bg-amber-100 text-center w-10" style={{ position: 'absolute', left: '2px' }}>{coreFunc.acctual_accomplishment.percent}%</div>
                                : ''
                            }
                          </td>
                        )
                      }
                      <td className="border border-gray-200 p-2">
                        {
                          coreFunc.success_indicator?.mi_succIn
                        }
                      </td>
                      {coreFunc.acctual_accomplishment && !coreFunc.acctual_accomplishment.disable ? (
                        <>
                          <td className="border border-gray-200 p-2">{coreFunc.acctual_accomplishment.actualAcc}</td>
                          <td className="border border-gray-200 p-2">{coreFunc.acctual_accomplishment.Q}</td>
                          <td className="border border-gray-200 p-2">{coreFunc.acctual_accomplishment.E}</td>
                          <td className="border border-gray-200 p-2">{coreFunc.acctual_accomplishment.T}</td>
                          <td className="border border-gray-200 p-2">{coreFunc.acctual_accomplishment.A}</td>
                          <td className="border border-gray-200 p-2">{coreFunc.acctual_accomplishment.remarks}</td>
                          <td className="border border-gray-200 p-2">{coreFunc.acctual_accomplishment.disable}</td>
                          <td className="border border-gray-200 p-2 text-center no-print" style={{ width: 150 }}>
                            <button className="btn btn-sm btn-success btn-outline mr-2" onClick={() => openEditModal(coreFunc.acctual_accomplishment, coreFunc.success_indicator)}>Edit</button>
                            <button className="btn btn-sm btn-error btn-outline" onClick={() => openClearModal(coreFunc.acctual_accomplishment)}>Clear</button>
                          </td>
                        </>
                      ) : coreFunc.acctual_accomplishment && coreFunc.acctual_accomplishment.disable ? (
                        <>
                          <td colSpan={6} className="border border-gray-200 p-2 text-center">{coreFunc.acctual_accomplishment.remarks}</td>
                          <td className="border border-gray-200 p-2"></td>
                          <td className="border border-gray-200 p-2 text-center no-print" style={{ width: 150 }}>

                            {
                              // not applicable edit btn
                              coreFunc.acctual_accomplishment.disable ?
                                <button className="btn btn-sm btn-sccess btn-outline mr-2" onClick={() => openNaModal(coreFunc.acctual_accomplishment, coreFunc.success_indicator)}>Edit</button>
                                :
                                <button className="btn btn-sm btn-success btn-outline mr-2" onClick={() => openEditModal(coreFunc.acctual_accomplishment, coreFunc.success_indicator)}>Edit</button>
                            }


                            <button className="btn btn-sm btn-error btn-outline" onClick={() => openClearModal(coreFunc.acctual_accomplishment)}>Clear</button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td colSpan={7} className="border border-gray-200 p-2 text-center">
                            <button className="btn btn-sm btn-primary mr-2" onClick={() => openAddModal(coreFunc.success_indicator)}>Add Accomplishment</button>
                            <button className="btn btn-sm" onClick={() => openNaModal(coreFunc.acctual_accomplishment, coreFunc.success_indicator)}>-- Not Applicable</button>
                          </td>
                          <td className="border border-gray-200 p-2 text-center no-print"></td>
                        </>
                      )}
                    </tr>
                }

                ) : ''
              }
              {/* core functions end */}




              {/* support functions start */}
              <tr className="h-10">
                <td colSpan={9} className="p-2 font-bold bg-amber-100">Support Functions</td>
                <td className="p-2 font-bold bg-amber-100 no-print"></td>
              </tr>


              {
                supportFunctions ? supportFunctions.map((supportFunction, index) => (
                  <tr key={index}>
                    <td className="border border-gray-200 p-2">{`${supportFunction.mfo} =${supportFunction.percent}%`}</td>
                    <td className="border border-gray-200 p-2">{supportFunction.suc_in}</td>
                    {/* <td className="border border-gray-200 p-2 text-center">-- Acctual Here --</td> */}
                    {
                      supportFunction.spmssupportfunctiondata ?
                        <>
                          <td className="border border-gray-200 p-2">{supportFunction.spmssupportfunctiondata.accomplishment}</td>
                          <td className="border border-gray-200 p-2">{supportFunction.spmssupportfunctiondata.Q}</td>
                          <td className="border border-gray-200 p-2">{supportFunction.spmssupportfunctiondata.E}</td>
                          <td className="border border-gray-200 p-2">{supportFunction.spmssupportfunctiondata.T}</td>
                          <td className="border border-gray-200 p-2">{supportFunction.spmssupportfunctiondata.A}</td>
                          <td className="border border-gray-200 p-2">{supportFunction.spmssupportfunctiondata.remark}</td>
                          <td className="border border-gray-200 p-2"></td>

                        </>
                        :
                        <>
                          <td colSpan={7} className="border border-gray-200 p-2 text-center">
                            <button className="btn btn-sm btn-primary mr-2" onClick={() => openSupportFunctionAddModal(supportFunction)}>Add Accomplishment</button>
                            <button className="btn btn-sm">-- Not Applicable</button>
                          </td>
                        </>
                    }

                    <td className="border border-gray-200 p-2 text-center no-print" style={{ width: 150 }}>
                      {supportFunction.spmssupportfunctiondata ? (
                        <>
                          <button className="btn btn-sm btn-success btn-outline mr-2" onClick={() => openSupportFunctionEditModal(supportFunction, supportFunction.spmssupportfunctiondata!)}>Edit</button>
                          <button className="btn btn-sm btn-error btn-outline">Clear</button>
                        </>
                      ) : (
                        <>
                          <button className="btn btn-sm btn-success btn-outline mr-2" disabled>Edit</button>
                          <button className="btn btn-sm btn-error btn-outline" disabled>Clear</button>
                        </>
                      )}
                    </td>
                  </tr>
                )) : ''
              }


              {/* <tr>
                <td className="border border-gray-200 p-2">n/a</td>
                <td className="border border-gray-200 p-2">n/a</td>
                <td className="border border-gray-200 p-2">n/a</td>
                <td className="border border-gray-200 p-2"></td>
                <td className="border border-gray-200 p-2"></td>
                <td className="border border-gray-200 p-2"></td>
                <td className="border border-gray-200 p-2"></td>
                <td className="border border-gray-200 p-2">n/a</td>
                <td className="border border-gray-200 p-2"></td>
                <td className="border border-gray-200 p-2 no-print"></td>
              </tr> */}





              {/* support functions end */}
            </tbody>
          </table>
        </div>

        <div>
          <table className="no-break table-auto border-collapse border border-gray-200 w-full">
            <tbody>
              <tr className="bg-amber-100">
                <td className="border border-gray-200 p-2" style={{ fontSize: 9 }} colSpan={2}>SUMMARY OF RATING</td>
                <td className="border border-gray-200 p-2" style={{ fontSize: 9 }}>TOTAL</td>
                <td className="border border-gray-200 p-2" style={{ fontSize: 9 }}>FINAL NUMERICAL RATING</td>
                <td className="border border-gray-200 p-2" style={{ fontSize: 9 }}>FINAL ADJECTIVAL RATING</td>
              </tr>
              <tr>
                <td className="border border-gray-200 p-2">Strategic Objectives</td>
                <td className="border border-gray-200 p-2">Total Weight Allocation: N/A</td>
                <td className="border border-gray-200 p-2 font-bold">N/A</td>
                <td rowSpan={3} className="text-center font-bold border border-gray-200 p-2">3.89</td>
                <td rowSpan={3} className="text-center font-bold border border-gray-200 p-2">Very Satisfactory</td>
              </tr>
              <tr>
                <td className="border border-gray-200 p-2">Core Functions</td>
                <td className="border border-gray-200 p-2">Total Weight Allocation: 80%</td>
                <td className="border border-gray-200 p-2 font-bold">3.1</td>
              </tr>
              <tr>
                <td className="border border-gray-200 p-2">Support Functions</td>
                <td className="border border-gray-200 p-2">Total Weight Allocation: 20%</td>
                <td className="border border-gray-200 p-2 font-bold">0.79</td>
              </tr>
              <tr>
                <td colSpan={5}>
                  <div className="pl-2 pt-2 font-medium">Comments and Recommendation For Development Purpose :</div>

                  <div className="p-2 ml-5">
                    test
                  </div>

                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="py-2">
          <table className="no-break table-auto border-collapse border border-gray-200 w-full">
            <tbody>
              <tr className="bg-green-200">
                <td className="border border-gray-200 min-w-60" style={{ fontSize: 10 }}>
                  Discussed: Date:
                </td>
                <td className="border border-gray-200 p-2 min-w-50" style={{ fontSize: 10 }}>
                  Assessed by: Date:
                </td>
                <td>

                </td>
                <td className="border border-gray-200 p-2" style={{ fontSize: 10 }}>
                  Reviewed: Date:
                </td>
                <td className="border border-gray-200 p-2 min-w-50" style={{ fontSize: 10 }}>
                  Final Rating by:
                </td>
                <td className="border border-gray-200 p-2 min-w-30" style={{ fontSize: 10 }}>
                  Date:
                </td>
              </tr>
              <tr>
                <td className="border border-gray-200 text-center align-bottom font-medium">
                  {ratee.name}
                </td>
                <td className="border border-gray-200">
                  <div className="text-center" style={{ fontSize: 10 }}>I certified that I discussed my assessment of the performance with the employee:</div>

                  <div className="text-center mt-10 font-medium">VERONICA GRACE P. MIRAFLOR</div>
                </td>
                <td className="border border-gray-200">
                  <div className="text-center" style={{ fontSize: 10 }}>I certified that I discussed with the employee how they are rated:</div>

                  <div className="text-center mt-10 font-medium">VERONICA GRACE P. MIRAFLOR</div>
                </td>
                <td className="border border-gray-200 text-center align-bottom" style={{ fontSize: 10 }}>
                  (all PMT member will sign)
                </td>
                <td className="border border-gray-200">
                  <div className="text-center mt-10 font-medium"> JOHN T. RAYMOND, JR.</div>
                </td>
                <td className="border border-gray-200">

                </td>
              </tr>
              <tr>
                <td className="text-center border border-gray-200" style={{ fontSize: 10 }}>
                  Ratee
                </td>
                <td className="text-center border border-gray-200" style={{ fontSize: 10 }}>
                  Supervisor
                </td>
                <td className="text-center border border-gray-200" style={{ fontSize: 10 }}>
                  Department Head
                </td>
                <td></td>
                <td className="text-center border border-gray-200" style={{ fontSize: 10 }}>
                  Head of Agency
                </td>
                <td className="border border-gray-200"></td>
              </tr>
            </tbody>
          </table>
        </div>

        <ClearConfirmationModal
          id="clear_confirmation_modal"
          title="Clear Actual Accomplishment"
          message="Are you sure you want to clear this actual accomplishment? This action cannot be undone."
          confirmText="Clear"
          cancelText="Cancel"
          confirmAction={clearSi}
          variant="danger"
          closeOnConfirm={false}
          isLoading={isClearing}
        />

        <ClearConfirmationModal
          id="clear_strategic_confirmation_modal"
          title="Clear Strategic Accomplishment"
          message="Are you sure you want to clear this strategic accomplishment? This action cannot be undone."
          confirmText="Clear"
          cancelText="Cancel"
          confirmAction={clearStrategic}
          variant="danger"
          closeOnConfirm={false}
          isLoading={isClearingStrategic}
        />

        <StrategicFormModal
          id="strategic_form_modal"
          existingAccomplishment={strategicAccomplishmentToEdit || null}
          onSubmit={handleStrategicSubmit}
          isLoading={isSaving}
        />

        <StrategicNotApplicableFormModal
          id="strategic_not_applicable_form_modal"
          existingAccomplishment={strategicAccomplishmentToEdit || null}
          onSubmit={handleStrategicSubmit}
          isLoading={isSaving}
        />


        <CoreFunctionFormModal
          id="accomplishment_form_modal"
          successIndicator={accomplishmentToEdit?.successIndicator || null}
          existingAccomplishment={accomplishmentToEdit?.accomplishment || null}
          onSubmit={handleAccomplishmentSubmit}
          isLoading={isSaving}
        />

        <NotApplicableFormModal
          id="not_applicable_form_modal"
          successIndicator={accomplishmentToEdit?.successIndicator || null}
          existingAccomplishment={accomplishmentToEdit?.accomplishment || null}
          onSubmit={handleNotApplicableSubmit}
          isLoading={isSaving}
        />

        <SupportFunctionFormModal
          id="support_function_form_modal"
          supportFunction={supportFunctionToEdit?.supportFunction || null}
          existingData={supportFunctionToEdit?.existingData || null}
          onSubmit={handleSupportFunctionSubmit}
          isLoading={isSavingSupportFunction}
        />


      </div >
      {/* form end */}



    </div >
  );
}
