import { FieldValue } from "firebase/firestore";

export interface TodoType{
  id?:string;
  content?:string;
  createdAt?:FieldValue;
  isComplete?:boolean;
  uid?:string;
}