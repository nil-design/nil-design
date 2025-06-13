const replaceImports = (rawCode, pkgAliasMap) => {
    let result = rawCode;

    Object.entries(pkgAliasMap).forEach(([pkg, alias]) => {
        // import <alias>, { A, B } from "<pkg>";
        result = result.replace(
            new RegExp(`import\\s+([\\w$]+)\\s*,\\s*\\{([^}]+)\\}\\s+from\\s+['"]${pkg}['"];?`, 'g'),
            (_, defaultName, members) => `const ${defaultName} = ${alias};\nconst {${members}} = ${alias};`,
        );

        // import { A, B } from "<pkg>";
        result = result.replace(
            new RegExp(`import\\s*\\{([^}]+)\\}\\s*from\\s*['"]${pkg}['"];?`, 'g'),
            (_, members) => `const {${members}} = ${alias};`,
        );

        // import <alias> from "<pkg>";
        result = result.replace(
            new RegExp(`import\\s+([\\w$]+)\\s+from\\s+['"]${pkg}['"];?`, 'g'),
            (_, defaultName) => `const ${defaultName} = ${alias};`,
        );
    });

    return result;
};

export default replaceImports;
