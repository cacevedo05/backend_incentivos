export interface WorkLog {
    id: string;
    employee_id: string;
    module: string;
    work_date: Date;
    minutes_worked: number;
    minutes_downtime: number
}