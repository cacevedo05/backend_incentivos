import { pool } from '../../shared/db/postgres';
import { EmployeeModel } from "./employees.model";

export class EmployeesRepository {
    async create (data: any): Promise<EmployeeModel> {
        const result = await pool.query(
            `INSERT INTO employees (document_type,document,name,address,phone,email,module)
            VALUES ($1,$2,$3,$4,$5,$6,$7)
            RETURNING *`,
            [data.documentType, data.document, data.name, data.address, data.phone, data.email, data.module]        
        );
        return result.rows[0]
    }
    async findAll(): Promise<EmployeeModel[]>{
        const result = await pool.query(
            `SELECT * FROM employees`
        )
        return result.rows;
    }
    async findById(id: number): Promise<EmployeeModel>{
        const result = await pool.query(
            `SELECT * FROM employees WHERE id = $1 AND active = true`,
            [id]
        )
        return result.rows[0] || null;
    }
    async update (id: number, data: any):Promise<EmployeeModel>{
        const result = await pool.query(
            `UPDATE employees
            SET document_type = $1, name = $2, address = $3, phone = $4, email = $5, module = $6
            WHERE id = $7
            RETURNING *`,
            [data.documentType, data.name, data.address, data.phone, data.email, data.module, id]
        )
        return result.rows[0]
    } 
    async delete (id: number): Promise<void>{
        const result = await pool.query(
            `UPDATE employees
            SET active = false
            WHERE id = $1`,
            [id]
        );
    }
    async findByDocument(document: string): Promise<EmployeeModel>{
        const result = await pool.query(
            `SELECT * FROM employees WHERE document = $1`,
            [document]
        )
        return result.rows[0] || null;
    }
    async activate (id: number): Promise<void>{
        await pool.query(
            `UPDATE employees
            SET active = true
            WHERE id = $1`,
            [id]
        )
    }
    async findByIdRaw (id: number): Promise<EmployeeModel>{
        const result = await pool.query(
            `SELECT * FROM employees WHERE id = $1`,
            [id]
        )
        return result.rows[0] || null 
    }
}