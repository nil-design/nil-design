type UnionToIntersection<Union> = (Union extends unknown ? (x: Union) => void : never) extends (
    x: infer Intersection,
) => void
    ? Intersection
    : never;

export default UnionToIntersection;
