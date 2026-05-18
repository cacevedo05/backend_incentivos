export interface CreateReferenceDTO {
    reference: string,
    color: string,
    size: string,
    standard_time: number,
    description: string,
}

export interface UpdateReferenceDTO {
    standard_time: number,
    description: string
}