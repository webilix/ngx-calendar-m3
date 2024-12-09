export interface IContainer {
    readonly value?: {
        readonly from: Date;
        readonly to: Date;
    };
    readonly minDate?: Date;
    readonly maxDate?: Date;
}
