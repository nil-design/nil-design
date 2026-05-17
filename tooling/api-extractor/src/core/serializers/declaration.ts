import { ReflectionKind } from 'typedoc';
import { serializeComponent } from '../../react/component';
import { isCallableReflection } from '../typedocGuards';
import { serializeComment, serializeSource } from './comment';
import { serializeBaseReflection } from './itemBase';
import { getCallSignatures, serializeCallSignature, serializeProperties, serializeTypeParameters } from './member';
import { unknownType } from './type';
import type { TypeSerializer } from './type';
import type {
    ApiClassItem,
    ApiConstantItem,
    ApiEnumItem,
    ApiFunctionItem,
    ApiInterfaceItem,
    ApiItem,
    ApiItemBase,
    ApiMethod,
    ApiProject,
    ApiProperty,
    ApiTypeAliasItem,
    ApiUnknownItem,
    ExtractProjectOptions,
} from '../../interfaces';
import type { ReactAnalyzer } from '../../react/classifiers';
import type { ExportDeclaration } from '../project';
import type { DeclarationReflection } from 'typedoc';

export interface ReflectionSerializerOptions {
    options: ExtractProjectOptions;
    cwd: string;
    project: ApiProject;
    entryPointByReflection: Map<number, string>;
    typeSerializer: TypeSerializer;
    reactAnalyzer: ReactAnalyzer;
}

export class ReflectionSerializer {
    private readonly baseCache = new WeakMap<DeclarationReflection, ApiItemBase>();

    constructor(private readonly serializerOptions: ReflectionSerializerOptions) {}

    serializeDeclaration({ reflection, exportReflection }: ExportDeclaration): ApiItem {
        const entryPoint =
            this.serializerOptions.entryPointByReflection.get(exportReflection.id) ??
            this.serializerOptions.entryPointByReflection.get(reflection.id) ??
            '';
        const exportBase = this.serializeBase(exportReflection, entryPoint);
        const targetBase = exportReflection === reflection ? exportBase : this.serializeBase(reflection, entryPoint);
        const base = {
            ...exportBase,
            comment: exportBase.comment ?? targetBase.comment,
        };
        const reactTypes = this.serializerOptions.reactAnalyzer.getComponentClassification(reflection, base);

        if (reactTypes) {
            return serializeComponent(
                reflection,
                base,
                reactTypes,
                this.serializerOptions.options,
                this.serializerOptions.typeSerializer,
                this.serializerOptions.reactAnalyzer,
            );
        }

        if (isCallableReflection(reflection)) return this.serializeCallable(reflection, base);

        switch (reflection.kind) {
            case ReflectionKind.Variable:
                return this.serializeConstant(reflection, base);
            case ReflectionKind.Enum:
                return this.serializeEnum(reflection, base);
            case ReflectionKind.Interface:
                return this.serializeInterface(reflection, base);
            case ReflectionKind.TypeAlias:
                return this.serializeTypeAlias(reflection, base);
            case ReflectionKind.Class:
                return this.serializeClass(reflection, base);
            default:
                return this.serializeUnknown(reflection, base);
        }
    }

    private serializeBase(reflection: DeclarationReflection, entryPoint: string): ApiItemBase {
        const cached = this.baseCache.get(reflection);

        if (cached?.entryPoint === entryPoint) return cached;

        const base = serializeBaseReflection(
            reflection,
            entryPoint,
            this.serializerOptions.cwd,
            this.serializerOptions.typeSerializer.context,
        );

        this.baseCache.set(reflection, base);

        return base;
    }

    private serializeMethod(reflection: DeclarationReflection): ApiMethod {
        const comment = serializeComment(reflection, this.serializerOptions.typeSerializer.context.comments);
        const property: ApiProperty = {
            name: reflection.name,
            optional: reflection.flags.isOptional,
            readonly: reflection.flags.isReadonly,
            type: reflection.type ? this.serializerOptions.typeSerializer.serialize(reflection.type) : unknownType(),
            comment,
            defaultValue: reflection.defaultValue,
            inheritedFrom: reflection.inheritedFrom?.name,
            source: serializeSource(reflection),
        };

        return {
            ...property,
            callSignatures: getCallSignatures(reflection, this.serializerOptions.typeSerializer),
        };
    }

    private serializeDeclarationDetails(reflection: DeclarationReflection) {
        return {
            typeParameters: serializeTypeParameters(reflection.typeParameters, this.serializerOptions.typeSerializer),
            extends: (reflection.extendedTypes ?? []).map(type =>
                this.serializerOptions.typeSerializer.serialize(type),
            ),
            properties: serializeProperties(reflection, this.serializerOptions.typeSerializer),
            callSignatures: (reflection.signatures ?? []).map(signature =>
                serializeCallSignature(signature, this.serializerOptions.typeSerializer),
            ),
            indexSignatures: (reflection.indexSignatures ?? []).map(signature =>
                serializeCallSignature(signature, this.serializerOptions.typeSerializer),
            ),
        };
    }

    private serializeCallable(reflection: DeclarationReflection, base: ApiItemBase): ApiItem {
        const functionItem: ApiFunctionItem = {
            ...base,
            kind: 'function',
            callSignatures: getCallSignatures(reflection, this.serializerOptions.typeSerializer),
        };

        if (this.serializerOptions.reactAnalyzer.shouldClassifyAsHook(functionItem, this.serializerOptions.project)) {
            return {
                ...functionItem,
                kind: 'hook',
            };
        }

        return functionItem;
    }

    private serializeConstant(reflection: DeclarationReflection, base: ApiItemBase): ApiConstantItem {
        return {
            ...base,
            kind: 'constant',
            type: reflection.type ? this.serializerOptions.typeSerializer.serialize(reflection.type) : unknownType(),
            value: reflection.defaultValue,
        };
    }

    private serializeEnum(reflection: DeclarationReflection, base: ApiItemBase): ApiEnumItem {
        return {
            ...base,
            kind: 'enum',
            members: (reflection.children ?? [])
                .filter(child => child.kind === ReflectionKind.EnumMember)
                .map(child => ({
                    name: child.name,
                    value: child.defaultValue,
                    comment: serializeComment(child, this.serializerOptions.typeSerializer.context.comments),
                    source: serializeSource(child),
                })),
        };
    }

    private serializeInterface(reflection: DeclarationReflection, base: ApiItemBase): ApiInterfaceItem {
        return {
            ...base,
            kind: 'interface',
            ...this.serializeDeclarationDetails(reflection),
        };
    }

    private serializeTypeAlias(reflection: DeclarationReflection, base: ApiItemBase): ApiTypeAliasItem {
        return {
            ...base,
            kind: 'typeAlias',
            typeParameters: serializeTypeParameters(reflection.typeParameters, this.serializerOptions.typeSerializer),
            type: reflection.type ? this.serializerOptions.typeSerializer.serialize(reflection.type) : unknownType(),
        };
    }

    private serializeClass(reflection: DeclarationReflection, base: ApiItemBase): ApiClassItem {
        return {
            ...base,
            kind: 'class',
            typeParameters: serializeTypeParameters(reflection.typeParameters, this.serializerOptions.typeSerializer),
            extends: (reflection.extendedTypes ?? []).map(type =>
                this.serializerOptions.typeSerializer.serialize(type),
            ),
            implements: (reflection.implementedTypes ?? []).map(type =>
                this.serializerOptions.typeSerializer.serialize(type),
            ),
            properties: serializeProperties(reflection, this.serializerOptions.typeSerializer),
            methods: (reflection.children ?? [])
                .filter(child => child.kind === ReflectionKind.Method)
                .map(child => this.serializeMethod(child)),
            constructors: (reflection.children ?? [])
                .filter(child => child.kind === ReflectionKind.Constructor)
                .flatMap(child => getCallSignatures(child, this.serializerOptions.typeSerializer)),
        };
    }

    private serializeUnknown(reflection: DeclarationReflection, base: ApiItemBase): ApiUnknownItem {
        return {
            ...base,
            kind: 'unknown',
            type: reflection.type ? this.serializerOptions.typeSerializer.serialize(reflection.type) : undefined,
        };
    }
}
