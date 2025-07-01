export interface ProfileData {
    group: string;
    percentage?: number; // Single value case
    analyser?: number;
    collaborator?: number;
    guardian?: number;
    explorer?: number;
    achiever?: number;
    visionary?: number;
    specialist?: number;
}

export interface DiversityBarChartData {
    group: string;
    values: ProfileData[];
}
