export interface IContainer {
    readonly value?: {
        readonly from: Date;
        readonly to: Date;
    };
    readonly minDate?: 'NOW' | Date;
    readonly maxDate?: 'NOW' | Date;
}
