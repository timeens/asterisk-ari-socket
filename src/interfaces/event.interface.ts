import { ParamInterface } from './param.interface';


export interface EventInterface {
	name: string;
	requiredParams?: Array<ParamInterface>;
}