// src/types/index.d.ts
export { };

declare global {
  type ActualAccomplishment = {
    cfd_id: number;
    type: string;
    p_id: number;
    empId: number;
    actualAcc: string;
    Q: string;
    E: string;
    T: string;
    remarks: string;
    supEdit: string | null;
    dhEdit: string | null;
    pmtEdit: string | null;
    critics: string | null;
    disable: string | null;
    percent: number;
    A: string | null;
  };

  type Personnel = {
    employee_id: number;
    full_name: string;
    actual_accomplishment?: ActualAccomplishment;
  };

  type SuccessIndicator = {
    mi_id: number;
    cf_ID?: number | null;
    mi_succIn: string;
    mi_quality?: string;
    mi_eff?: string;
    mi_time?: string;
    mi_incharge?: string;
    corrections?: string;
    has_quality?: boolean;
    quality?: string[] | null;
    has_efficiency?: boolean;
    efficiency?: string[] | null;
    has_timeliness?: boolean;
    timeliness?: string[] | null;
    perf_measures?: string[];
    personnel?: Personnel[];
  };

  type Row = {
    cf_ID: number,
    mfo_periodId?: number,
    parent_id?: number,
    cf_count: string,
    cf_title: string,
    has_si: boolean,
    indent: number,
    num_si: number,
    success_indicators: SuccessIndicator[]
  }

  type Mfo = {
    cf_ID: number,
    cf_count: string,
    cf_title: string,
    corrections: string,
    dep_id: number,
    indent: number,
    isDisabled: boolean,
    mfo_periodId: number,
    parent_id: string
  }

  type EmployeeOption = {
    employee_id: number;
    full_name: string;
  };


  type Employee = {
    id: number;
    full_name: string;
    department: string;
  };


  interface MfoFunction {
    id: number;
    semester: 1 | 2;
    year: string;
  }

  interface Department {
    id: number;
    parent_id: number;
    name: string;
    alias: string;
    parent?: Department;
    children?: Department;
  }

  interface CoreFunction {
    id: number;
    mfo_period_id: number;
    parent_id?: number | null;
    department_id: number;
    title: string;
    order: string;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string | null;
    parent?: CoreFunction;
    children?: CoreFunction[];
  }

  type MfoData = {
    cf_ID: number;
    mfo_periodId: number;
    parent_id: string;
    dep_id: number;
    cf_count: string;
    cf_title: string;
    corrections: string;
    indent: number;
    is_mfo: boolean;
    has_si: boolean;
    num_si: number;
    success_indicators: SuccessIndicator[];
  };

  type CoreFunctionData = {
    mfo: MfoData;
    success_indicator: SuccessIndicator | null;
    acctual_accomplishment: ActualAccomplishment | null;
  };

  type StrategicAccomplishment = {
    strategicFunc_id: number;
    period_id?: number;
    emp_id?: number;
    mfo: string;
    succ_in: string;
    acc: string;
    Q?: number;
    T?: number;
    average: number;
    remark: string;
    noStrat: number;

    // id: existingAccomplishment?.id || 0,
    // mfo: existingAccomplishment?.mfo || '',
    // succ_in: existingAccomplishment?.succ_in || '',
    // acc: existingAccomplishment?.acc || '',
    // average: existingAccomplishment?.average || 0,
    // remark: existingAccomplishment?.remark || '',
    // noStrat: existingAccomplishment?.noStrat || 0


  }

  type SupportFunction = {
    id_suppFunc: number;
    mfo: string;
    suc_in: string;
    Q?: string[];
    E?: string[];
    T?: string[];
    percent: number;
    type: number;
    spmssupportfunctiondata?: SupportFunctionData;
  }


  type SupportFunctionData = {
    sfd_id: number
    parent_id: number
    emp_id: number
    period_id: number
    accomplishment: string
    Q?: number
    E?: number
    T?: number
    remark?: string
    supEdit?: string
    dhEdit?: string
    pmtEdit?: string
    critics?: string
    percent?: number
    A?: number
  }

  type Period = {
    mfoperiod_id: number;
    month_mfo: string;
    year_mfo: number;
  }

  type PcrDepartment = {
    department_id: number;
    parent_department_id: number | null;
    department: string;
    alias: string;
  }

  type SysPosition = {
    position_id: number;
    position: string;
    functional: string;
    alias: string | null;
    level: string;
    category: string;
    salaryGrade: number;
  }

  type SysEmployee = {
    employees_id: number;
    lastName: string;
    firstName: string;
    middleName: string;
    extName: string;
    gender: string;
    status: string;
    employmentStatus: string;
    department_id: number;
    position_id: string;
    natureOfAssignment: string;
    dateActivated: string;
    dateInactivated: string | null;
    dateIPCR: string;
    empid: number;
    objid: string;
    dtrno: number;
    empno: number;
    temp_date_of_appointment: string | null;
    temp_due_for_renewal: string | null;
    temp_dates_renewed: string | null;
    full_name: string;
    full_name_fn: string;
    department: PcrDepartment;
    position: SysPosition;
    selected: EmployeeOption;
  }

  type Pcr = {
    performanceReviewStatus_id: number;
    period_id: number;
    employees_id: number;
    ImmediateSup: string | null;
    DivisionHead: string | null;
    DepartmentHead: string | null;
    HeadAgency: string | null;
    PMT: number | null;
    submitted: string | null;
    certify: string | null;
    approved: string | null;
    panelApproved: string | null;
    dateAccomplished: string | null;
    formType: string;
    department_id: number;
    is_cvmo: number | null;
    assembleAll: number;
    final_numerical_rating: number | null;
    total_average?: number;
    period: Period;
    employee: SysEmployee;
    ImmediateSupObj: EmployeeOption;
    DepartmentHeadObj: EmployeeOption;
    department: PcrDepartment;
  }

  type AverageRatings = {
    strategic_average: string;
    core_function_average: string;
    support_function_average: string;
    total: string;
  }



}