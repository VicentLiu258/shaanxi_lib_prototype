
export type ReviewStatus = '全部' | '待审核' | '审核通过' | '不通过' | '已审核';

export interface ChemicalDetail {
  name: string;
  specs: string;
  stock: number;
  unit: string;
  brand: string;
  quantity: number;
  price: number;
  totalPrice: number;
}

export interface ReviewRecord {
  id: string;
  applicant: string;
  batchNo?: string; // For warehousing/purchase
  wasteType?: string; // For waste
  categoryCount: number;
  applyTime: string;
  status: ReviewStatus;
  auditTime?: string;
  auditOpinion?: string;
  details: ChemicalDetail[];
  amount?: number; // For purchase
  useTime?: string; // For receive
  receiveType?: string; // For receive
}

export interface SecurityCheckItem {
  id: string;
  category: string;
  projectName: string;
  nature: '问题' | '隐患';
  dangerLevel: '轻微' | '较大' | '重大';
  isQualified: boolean;
  deadline?: string;
  explanation: string;
  fileStatus: '未' | '已';
}

export interface SecurityCheckRecord {
  id: string;
  filler: string;
  fillTime: string;
  problemCount: number;
  rectifiedProblemCount: number;
  dangerCount: number;
  rectifiedDangerCount: number;
}

export interface HazardIssue {
  id: string;
  category: string;
  project: string;
  filler: string;
  nature: '问题' | '隐患';
  dangerLevel: '轻微' | '较大' | '重大';
  checkTime: string;
  deadline: string;
  rectifyDate?: string;
  rectifyStatus: '待整改' | '已整整改';
}

export interface ChemicalRoom {
  id: string;
  name: string;
  qrCode: string;
}

export interface SystemMessage {
  id: string;
  title: string;
  content: string;
  time: string;
  isRead: boolean;
}
