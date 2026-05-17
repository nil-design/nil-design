export type ApiSchemaVersion = '1.0';

export type ApiItemKind =
    | 'component'
    | 'hook'
    | 'function'
    | 'constant'
    | 'enum'
    | 'interface'
    | 'typeAlias'
    | 'class'
    | 'unknown';

export type ApiDiagnosticSeverity = 'info' | 'warning' | 'error';

export interface ApiProject {
    schemaVersion: ApiSchemaVersion;
    packageName?: string;
    entryPoints: ApiEntryPoint[];
    items: ApiItem[];
    diagnostics: ApiDiagnostic[];
}

export interface ApiEntryPoint {
    path: string;
    name?: string;
}

export interface ApiDiagnostic {
    code: string;
    message: string;
    severity: ApiDiagnosticSeverity;
    itemId?: string;
    source?: ApiSource;
}

export interface ApiSource {
    fileName: string;
    line?: number;
    character?: number;
    url?: string;
}

export interface ApiComment {
    summary: string;
    blockTags: ApiTag[];
    modifierTags: string[];
}

export interface ApiTag {
    tag: string;
    name?: string;
    text: string;
}

export interface ApiItemFlags {
    private?: boolean;
    protected?: boolean;
    public?: boolean;
    static?: boolean;
    external?: boolean;
    optional?: boolean;
    rest?: boolean;
    abstract?: boolean;
    const?: boolean;
    readonly?: boolean;
    inherited?: boolean;
    deprecated?: boolean;
}

export interface ApiItemBase {
    id: string;
    kind: ApiItemKind;
    name: string;
    exportName: string;
    entryPoint: string;
    source?: ApiSource;
    comment?: ApiComment;
    flags: ApiItemFlags;
}

export interface ApiComponentItem extends ApiItemBase {
    kind: 'component';
    react: {
        pattern: 'function' | 'fc' | 'forwardRef' | 'memo' | 'lazy' | 'exotic' | 'unknown';
    };
    propsObject?: ApiObjectType;
    propsType?: ApiType;
    refType?: ApiType;
    compounds: ApiComponentItem[];
    callSignatures: ApiCallSignature[];
}

export interface ApiHookItem extends ApiItemBase {
    kind: 'hook';
    callSignatures: ApiCallSignature[];
}

export interface ApiFunctionItem extends ApiItemBase {
    kind: 'function';
    callSignatures: ApiCallSignature[];
}

export interface ApiConstantItem extends ApiItemBase {
    kind: 'constant';
    type: ApiType;
    value?: string;
}

export interface ApiEnumItem extends ApiItemBase {
    kind: 'enum';
    members: ApiEnumMember[];
}

export interface ApiEnumMember {
    name: string;
    value?: string | number;
    comment?: ApiComment;
    source?: ApiSource;
}

export interface ApiInterfaceItem extends ApiItemBase {
    kind: 'interface';
    typeParameters: ApiTypeParameter[];
    extends: ApiType[];
    properties: ApiProperty[];
    callSignatures: ApiCallSignature[];
    indexSignatures: ApiCallSignature[];
}

export interface ApiTypeAliasItem extends ApiItemBase {
    kind: 'typeAlias';
    typeParameters: ApiTypeParameter[];
    type: ApiType;
}

export interface ApiClassItem extends ApiItemBase {
    kind: 'class';
    typeParameters: ApiTypeParameter[];
    extends: ApiType[];
    implements: ApiType[];
    properties: ApiProperty[];
    methods: ApiMethod[];
    constructors: ApiCallSignature[];
}

export interface ApiUnknownItem extends ApiItemBase {
    kind: 'unknown';
    type?: ApiType;
}

export type ApiItem =
    | ApiComponentItem
    | ApiHookItem
    | ApiFunctionItem
    | ApiConstantItem
    | ApiEnumItem
    | ApiInterfaceItem
    | ApiTypeAliasItem
    | ApiClassItem
    | ApiUnknownItem;

export interface ApiCallSignature {
    name?: string;
    parameters: ApiParameter[];
    returnType: ApiType;
    typeParameters: ApiTypeParameter[];
    comment?: ApiComment;
    source?: ApiSource;
}

export interface ApiParameter {
    name: string;
    optional: boolean;
    rest: boolean;
    type: ApiType;
    defaultValue?: string;
    comment?: ApiComment;
    source?: ApiSource;
}

export interface ApiProperty {
    name: string;
    optional: boolean;
    readonly: boolean;
    type: ApiType;
    comment?: ApiComment;
    defaultValue?: string;
    inheritedFrom?: string;
    source?: ApiSource;
}

export interface ApiMethod extends ApiProperty {
    callSignatures: ApiCallSignature[];
}

export interface ApiTypeParameter {
    name: string;
    constraint?: ApiType;
    default?: ApiType;
}

export type ApiType =
    | ApiIntrinsicType
    | ApiLiteralType
    | ApiReferenceType
    | ApiUnionType
    | ApiIntersectionType
    | ApiArrayType
    | ApiTupleType
    | ApiFunctionType
    | ApiObjectType
    | ApiUnknownType;

export interface ApiTypeBase {
    kind: string;
    text: string;
}

export interface ApiIntrinsicType extends ApiTypeBase {
    kind: 'intrinsic';
    name: string;
}

export interface ApiLiteralType extends ApiTypeBase {
    kind: 'literal';
    value: string | number | boolean | null;
}

export interface ApiReferenceType extends ApiTypeBase {
    kind: 'reference';
    name: string;
    packageName?: string;
    typeArguments: ApiType[];
}

export interface ApiUnionType extends ApiTypeBase {
    kind: 'union';
    types: ApiType[];
}

export interface ApiIntersectionType extends ApiTypeBase {
    kind: 'intersection';
    types: ApiType[];
}

export interface ApiArrayType extends ApiTypeBase {
    kind: 'array';
    elementType: ApiType;
}

export interface ApiTupleType extends ApiTypeBase {
    kind: 'tuple';
    elements: ApiType[];
}

export interface ApiFunctionType extends ApiTypeBase {
    kind: 'function';
    callSignatures: ApiCallSignature[];
}

export interface ApiObjectType extends ApiTypeBase {
    kind: 'object';
    properties: ApiProperty[];
    extends: ApiType[];
    callSignatures: ApiCallSignature[];
    indexSignatures: ApiCallSignature[];
}

export interface ApiUnknownType extends ApiTypeBase {
    kind: 'unknown';
}
