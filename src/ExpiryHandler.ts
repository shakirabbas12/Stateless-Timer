import { TimerType } from "./Model/TimerType";
export interface ExpiryHandler {
     handle: (type:string, data:object) => void;
}