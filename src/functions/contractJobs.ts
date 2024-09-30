// src/functions/contractJobs.ts
import Job from '../models/job.js';


export const getJobsByContractId = async (contractId: number): Promise<Job[]> => {
    const jobs = await Job.findAll({ where: { contractId } });
    if (!jobs || jobs.length === 0) {
        throw new Error('Nenhum Job encontrado para este Contract.');
    }
    return jobs;
};


export const addJobToContract = async (contractId: number, jobData: { name: string; description: string }): Promise<Job> => {
    const newJob = await Job.create({
        contractId,
        name: jobData.name,
        description: jobData.description,
    });
    return newJob;
};
