export interface ServerToClientEventInterface {
	name: string;
	params?: Array<{
		key: string,
		value: any
	}>
}