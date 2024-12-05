export interface IContainer {
    readonly title: string;
    readonly value?: {
        readonly from: Date;
        readonly to: Date;
    };
    readonly minDate?: Date;
    readonly maxDate?: Date;
}
