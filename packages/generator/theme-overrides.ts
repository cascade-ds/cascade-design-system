const DECLARATION = /^\s*(--[\w-]+):\s*(.*);\s*$/;

function readDeclaration(line: string) {
  const [, name, value] = DECLARATION.exec(line) ?? [];
  return name === undefined || value === undefined ? undefined : { name, value };
}

function readDeclarations(css: string) {
  const declarations = new Map<string, string>();

  for (const line of css.split('\n')) {
    const declaration = readDeclaration(line);
    if (declaration) {
      declarations.set(declaration.name, declaration.value);
    }
  }

  return declarations;
}

/**
 * Keeps only the declarations a theme must redeclare. A nested `data-theme`
 * section re-resolves `var()` chains, so a token needs redeclaring only when
 * its value differs from the base theme's or it aliases a token that does;
 * everything else inherits the same computed value.
 */
export function keepThemeOverrides(baseCss: string, themeCss: string) {
  const base = readDeclarations(baseCss);
  const theme = readDeclarations(themeCss);
  const overridden = new Map<string, boolean>();

  function isOverridden(name: string, visiting = new Set<string>()): boolean {
    const known = overridden.get(name);
    if (known !== undefined) {
      return known;
    }
    if (visiting.has(name)) {
      return false;
    }
    visiting.add(name);

    const value = theme.get(name);
    const result =
      value !== base.get(name) ||
      [...(value ?? '').matchAll(/var\((--[\w-]+)\)/g)].some(([, alias]) =>
        alias === undefined ? false : isOverridden(alias, visiting),
      );

    overridden.set(name, result);
    return result;
  }

  return themeCss
    .split('\n')
    .filter((line) => {
      const declaration = readDeclaration(line);
      return !declaration || isOverridden(declaration.name);
    })
    .join('\n');
}
