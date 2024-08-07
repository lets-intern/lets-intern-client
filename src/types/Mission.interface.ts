import { TABLE_STATUS } from '../utils/convert';
import { StatusKey } from './interface';

interface IMissionTemplate {
  [key: string]: any;
  status?: (typeof TABLE_STATUS)[StatusKey];
  id?: number;
  title: string;
  description: string;
  guide: string;
  templateLink: string;
  createdDate?: string;
}

interface IMissionTemplateSimple {
  id: number;
  title: string;
}

interface IContent {
  id: number;
  title: string;
}

interface IMission {
  [key: string]: any;
  id?: number;
  status?: (typeof TABLE_STATUS)[StatusKey];
  type: 'GENERAL' | 'REFUND' | 'ADDITIONAL';
  missionTemplateId?: number;
  title: string;
  startDate: string;
  endDate?: string;
  refund: number;
  essentialContentsList: IContent[] | number[];
  additionalContentsList: IContent[] | number[];
  limitedContentsList: IContent[] | number[];
}
