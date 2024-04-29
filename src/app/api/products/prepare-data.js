import { createSlug } from "@/utils/slugify";

export function prepareData(request) {
  const variantTypeNames = [];
  const variantSlugs = [];
  const iterationsVariants = [];
  const variantTypeCreateManyArg = [];
  const productIterationsCreateManyArg = [];

  request.product_iterations.forEach((itr) => {
    const iterationVariant = [];

    itr.variants.forEach((variant) => {
      variantTypeNames.push(variant.variant_type_name);

      const slugifyVarName = createSlug(variant.variant_name);
      if (!variantSlugs.includes(slugifyVarName)) {
        variantSlugs.push(slugifyVarName);
      }

      iterationVariant.push(slugifyVarName);

      variantTypeCreateManyArg.push({
        variant_type_name: variant.variant_type_name,
      });
    });

    iterationsVariants.push(iterationVariant);
    productIterationsCreateManyArg.push({
      product_variant_weight: parseInt(itr.product_variant_weight),
      product_variant_price: parseInt(itr.product_variant_price),
      product_variant_stock: parseInt(itr.product_variant_stock),
    });
  });

  return {
    productCategorySlug: createSlug(request.product_category_name),

    variantTypeNames,
    variantSlugs,
    iterationsVariants,
    variantTypeCreateManyArg,
    productIterationsCreateManyArg,
  };
}
