import Job from '../models/job.js';

// Função para adicionar um Job a um Contract
export const addJobToContract = async (contractId: number, jobData: { name: string; description: string }): Promise<Job> => {
    const newJob = await Job.create({
        contractId,
        name: jobData.name,
        description: jobData.description,
    });
    return newJob;
};
