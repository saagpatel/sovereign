// Keep the package metadata change scoped to the exact Next ESLint plugin
// release whose root resolver is patched below. A changed upstream contract
// must be reviewed before the lock graph is regenerated.
export const hooks = {
  readPackage(pkg) {
    if (pkg.name !== '@next/eslint-plugin-next') return pkg;
    if (pkg.version !== '16.3.3') {
      throw new Error(`Refresh the Sovereign Next resolver patch for ${pkg.name}@${pkg.version}`);
    }
    const dependencies = { ...pkg.dependencies };
    if (dependencies['fast-glob'] !== '3.3.1') {
      throw new Error('Expected @next/eslint-plugin-next@16.3.3 to depend on fast-glob@3.3.1');
    }
    delete dependencies['fast-glob'];
    dependencies.glob = '13.0.6';
    pkg.dependencies = dependencies;
    return pkg;
  },
};
