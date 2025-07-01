export interface IStatsViewProps {
  summary: any
  questionsAsked: number
  participationRate: string
  recommendations: number
}

export interface IStatsViewCardProps {
  title: string
  data: string
  explaination: string
  hints?: string
}

export type TabKeys = 'All' | 'Year' | 'Quarter' | 'Month'
