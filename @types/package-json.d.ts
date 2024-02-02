import type { PackageJson as BasePackageJson } from 'type-fest';

interface Exports {
  '.': {
    require?: string;
    import?: string;
    types?: string;
    default?: string;
  };
  [key: string]: unknown;
}

export interface PackageJson extends Omit<BasePackageJson, 'exports'> {
  exports?: Exports | string;
}
