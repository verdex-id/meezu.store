import { createSlug } from "@/utils/slugify";

export function prepareData(request) {
  const variantTypeNames = [];
  const variantSlugs = [];
  const variantTypeCreateManyArg = [];

  request.variants.forEach((variant) => {
    variantTypeNames.push(variant.variant_type_name);

    const slugifyVarName = createSlug(variant.variant_name);
    if (!variantSlugs.includes(slugifyVarName)) {
      variantSlugs.push(slugifyVarName);
    }

    variantTypeCreateManyArg.push({
      variant_type_name: variant.variant_type_name,
    });
  });

  return {
    variantTypeNames,
    variantSlugs,
    variantTypeCreateManyArg,
  };
}
