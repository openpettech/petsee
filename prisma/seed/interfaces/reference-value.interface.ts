export interface IReferenceValue {
  id: string;
  referenceCategoryId: string;
  speciesId: string;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  min?: number;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  max?: number;
  unit: string;
  [locale: string]: string;
}
