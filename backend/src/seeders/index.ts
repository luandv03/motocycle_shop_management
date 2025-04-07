import { seedMotocycleModels } from "./MotocycleModelSeeder";
import { seedBrands } from "./BrandSeeder";
import { seedRoles } from "./RoleSeeder";
import { seedColors } from "./ColorSeeder";
import { seedSpecifications } from "./SpecificationSeeder";
import { seedAccessories } from "./AccessorieSeeder";
import { seedPointRules } from "./PointRuleSeeder";

export const runSeeders = async () => {
    console.log("Seeding data...");
    await seedBrands();
    console.log("Brands seeded successfully!");

    await seedMotocycleModels();
    console.log("Motocycle models seeded successfully!");

    await seedRoles();
    console.log("Roles seeded successfully!");

    await seedColors();
    console.log("Colors seeded successfully!");

    await seedSpecifications();
    console.log("Specifications seeded successfully!");

    await seedAccessories();
    console.log("Accessories seeded successfully!");

    await seedPointRules();
    console.log("Point rules seeded successfully!");

    console.log("All seeders completed successfully!");
};
