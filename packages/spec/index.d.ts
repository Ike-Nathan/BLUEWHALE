export interface VectorCase {
  module: string;
  description: string;
  input: any;
  expected: any;
  tags?: string[];
}

export interface Vectors {
  spec_version: string;
  cases: VectorCase[];
}

export const vectors: Vectors;
export const schema: any;
