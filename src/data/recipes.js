// Seed recipe catalogue. Content is illustrative and must be food-safety validated before launch.
// No health claims: recipes describe usage only.
export const OCCASIONS = [
  { id: 'breakfast', label: 'Breakfast', image: '/images/cat-breakfast.webp', blurb: 'Start the day with something simple.' },
  { id: 'snacks', label: 'Snacks', image: '/images/cat-snacks.webp', blurb: 'Quick bites between meals.' },
  { id: 'beverages', label: 'Beverages', image: '/images/cat-beverages.webp', blurb: 'Cool drinks and smoothies.' },
  { id: 'cooking', label: 'Cooking', image: '/images/cat-cooking.webp', blurb: 'Glazes and everyday cooking.' },
  { id: 'desserts', label: 'Desserts', image: '/images/cat-desserts.webp', blurb: 'A drizzle of something sweet.' },
  { id: 'onthego', label: 'On-the-go', image: '/images/cat-onthego.webp', blurb: 'Easy to pack, easy to eat.' },
];

export const INGREDIENT_FILTERS = ['Bread', 'Banana', 'Oats', 'Milk', 'Yogurt', 'Lemon', 'Apple', 'Flour', 'Berries'];

const r = (o) => ({ difficulty: 'Easy', serves: 1, ...o });

export const RECIPES = [
  r({
    id: 'honey-banana-toast', title: 'Honey Banana Toast', image: '/images/recipe-banana-toast.webp',
    occasions: ['breakfast', 'onthego', 'snacks'], time: 2, honey: '1 tsp', popularity: 98,
    description: 'A quick, wholesome toast with the natural sweetness of Dabur Honey.',
    ingredients: [
      { name: 'Bread', qty: '2 slices', key: 'Bread' }, { name: 'Banana', qty: '1 (sliced)', key: 'Banana' },
      { name: 'Dabur Honey', qty: '1 tsp', honey: true }, { name: 'Nuts / seeds (optional)', qty: 'to taste' },
    ],
    steps: ['Toast the bread until golden.', 'Add sliced banana on top.', 'Drizzle Dabur Honey and serve.'],
  }),
  r({
    id: 'honey-oats-bowl', title: 'Honey Oats Bowl', image: '/images/recipe-oat-bowl.webp',
    occasions: ['breakfast'], time: 5, honey: '1 tbsp', popularity: 94,
    description: 'Creamy oats topped with banana and a swirl of honey.',
    ingredients: [
      { name: 'Rolled oats', qty: '1/2 cup', key: 'Oats' }, { name: 'Milk', qty: '1 cup', key: 'Milk' },
      { name: 'Banana', qty: '1/2 (sliced)', key: 'Banana' }, { name: 'Dabur Honey', qty: '1 tbsp', honey: true },
    ],
    steps: ['Simmer oats in milk for 3–4 minutes, stirring.', 'Pour into a bowl and add banana slices.', 'Swirl Dabur Honey over the top and enjoy warm.'],
  }),
  r({
    id: 'honey-banana-smoothie', title: 'Honey Banana Smoothie', image: '/images/recipe-banana-smoothie.webp',
    occasions: ['beverages', 'breakfast', 'onthego'], time: 3, honey: '2 tsp', popularity: 90,
    description: 'A thick, chilled smoothie sweetened with Dabur Honey.',
    ingredients: [
      { name: 'Banana', qty: '1 ripe', key: 'Banana' }, { name: 'Chilled milk', qty: '1 cup', key: 'Milk' },
      { name: 'Dabur Honey', qty: '2 tsp', honey: true }, { name: 'Ice cubes', qty: '3–4' },
    ],
    steps: ['Add banana, milk and ice to a blender.', 'Blend until smooth.', 'Pour into a glass and finish with a drizzle of Dabur Honey.'],
  }),
  r({
    id: 'honey-apple-toast', title: 'Honey Apple Toast', image: '/images/recipe-apple-toast.webp',
    occasions: ['snacks', 'breakfast', 'onthego'], time: 4, honey: '1 tsp', popularity: 84,
    description: 'Crisp apple slices on toasted bread with a honey drizzle.',
    ingredients: [
      { name: 'Bread', qty: '2 slices', key: 'Bread' }, { name: 'Apple', qty: '1/2 (thin slices)', key: 'Apple' },
      { name: 'Dabur Honey', qty: '1 tsp', honey: true }, { name: 'Cinnamon (optional)', qty: 'a pinch' },
    ],
    steps: ['Toast the bread until crisp.', 'Fan thin apple slices over the toast.', 'Drizzle Dabur Honey and dust with cinnamon if you like.'],
  }),
  r({
    id: 'honey-yogurt-bowl', title: 'Honey Yogurt Bowl', image: '/images/recipe-yogurt-bowl.webp',
    occasions: ['snacks', 'breakfast'], time: 3, honey: '1 tbsp', popularity: 88,
    description: 'Cool yogurt with berries, crunch and a golden swirl.',
    ingredients: [
      { name: 'Thick yogurt', qty: '1 cup', key: 'Yogurt' }, { name: 'Mixed berries', qty: '1/2 cup', key: 'Berries' },
      { name: 'Granola', qty: '2 tbsp' }, { name: 'Dabur Honey', qty: '1 tbsp', honey: true },
    ],
    steps: ['Spoon yogurt into a bowl.', 'Top with berries and granola.', 'Swirl Dabur Honey over the top.'],
  }),
  r({
    id: 'honey-pancakes', title: 'Honey Pancakes', image: '/images/recipe-pancakes.webp', difficulty: 'Medium', serves: 2,
    occasions: ['breakfast', 'desserts'], time: 10, honey: '2 tbsp', popularity: 86,
    description: 'Soft stacked pancakes finished with banana and honey.',
    ingredients: [
      { name: 'Flour', qty: '1 cup', key: 'Flour' }, { name: 'Milk', qty: '3/4 cup', key: 'Milk' },
      { name: 'Banana', qty: '1 (sliced)', key: 'Banana' }, { name: 'Baking powder', qty: '1 tsp' },
      { name: 'Dabur Honey', qty: '2 tbsp', honey: true },
    ],
    steps: ['Whisk flour, baking powder and milk into a smooth batter.', 'Cook small rounds on a lightly oiled pan until golden on both sides.', 'Stack, top with banana and drizzle Dabur Honey.'],
  }),
  r({
    id: 'honey-lemon-drink', title: 'Honey Lemon Drink', image: '/images/recipe-lemon-drink.webp',
    occasions: ['beverages'], time: 2, honey: '2 tsp', popularity: 92,
    description: 'A refreshing iced lemon drink with a swirl of honey.',
    ingredients: [
      { name: 'Lemon', qty: '1/2 (juiced)', key: 'Lemon' }, { name: 'Water', qty: '1 glass' },
      { name: 'Dabur Honey', qty: '2 tsp', honey: true }, { name: 'Ice and mint', qty: 'to taste' },
    ],
    steps: ['Stir Dabur Honey into a little warm water until dissolved.', 'Add lemon juice, cold water and ice.', 'Garnish with mint and serve.'],
  }),
  r({
    id: 'honey-roasted-veg', title: 'Honey Roasted Veggies', image: '/images/recipe-roasted-veg.webp', serves: 3,
    occasions: ['cooking'], time: 30, difficulty: 'Medium', honey: '1 tbsp', popularity: 70,
    description: 'Carrots, parsnip and sweet potato glazed with honey and herbs.',
    ingredients: [
      { name: 'Carrots, sweet potato, parsnip', qty: '400 g' }, { name: 'Olive oil', qty: '1 tbsp' },
      { name: 'Dabur Honey', qty: '1 tbsp', honey: true }, { name: 'Rosemary or thyme', qty: 'a few sprigs' },
    ],
    steps: ['Cut vegetables into wedges and toss with oil and herbs.', 'Roast at 200°C for 20–25 minutes.', 'Brush with Dabur Honey and roast 5 more minutes.'],
  }),
  r({
    id: 'honey-garlic-skewers', title: 'Honey Glazed Chicken Skewers', image: '/images/recipe-chicken-skewers.webp', serves: 3,
    occasions: ['cooking', 'snacks'], time: 25, difficulty: 'Medium', honey: '1 tbsp', popularity: 74,
    description: 'Grilled skewers brushed with a sticky honey glaze.',
    ingredients: [
      { name: 'Chicken, cubed', qty: '300 g' }, { name: 'Garlic, minced', qty: '2 cloves' },
      { name: 'Soy sauce', qty: '1 tbsp' }, { name: 'Dabur Honey', qty: '1 tbsp', honey: true },
    ],
    steps: ['Marinate chicken with garlic and soy sauce for 15 minutes.', 'Thread onto skewers and grill until cooked through.', 'Brush with Dabur Honey in the last two minutes.'],
  }),
  r({
    id: 'honey-glazed-tofu', title: 'Honey Glazed Tofu', image: '/images/recipe-glazed-tofu.webp', serves: 2,
    occasions: ['cooking'], time: 15, honey: '2 tsp', popularity: 66,
    description: 'Pan-seared tofu cubes with a quick honey glaze.',
    ingredients: [
      { name: 'Firm tofu, cubed', qty: '200 g' }, { name: 'Soy sauce', qty: '1 tbsp' },
      { name: 'Dabur Honey', qty: '2 tsp', honey: true }, { name: 'Coriander', qty: 'to garnish' },
    ],
    steps: ['Sear tofu in a hot pan until golden on all sides.', 'Mix soy sauce and Dabur Honey, pour over and toss to coat.', 'Garnish with coriander and serve hot.'],
  }),
  r({
    id: 'honey-panna-cotta', title: 'Honey Panna Cotta', image: '/images/recipe-panna-cotta.webp', serves: 4,
    occasions: ['desserts'], time: 20, difficulty: 'Medium', honey: '3 tbsp', popularity: 62,
    description: 'A silky chilled dessert finished with a honey drizzle.',
    ingredients: [
      { name: 'Cream', qty: '1 cup' }, { name: 'Milk', qty: '1 cup', key: 'Milk' },
      { name: 'Gelatin or agar', qty: 'as per pack' }, { name: 'Dabur Honey', qty: '3 tbsp', honey: true },
    ],
    steps: ['Warm cream, milk and half the honey; stir in set agent.', 'Pour into moulds and chill until set.', 'Unmould and drizzle with the remaining Dabur Honey.'],
  }),
  r({
    id: 'honey-cake-slice', title: 'Honey Layer Cake', image: '/images/recipe-honey-cake.webp', serves: 6,
    occasions: ['desserts'], time: 45, difficulty: 'Medium', honey: '4 tbsp', popularity: 58,
    description: 'Layered honey cake finished with a final golden drizzle.',
    ingredients: [
      { name: 'Flour', qty: '2 cups', key: 'Flour' }, { name: 'Dabur Honey', qty: '4 tbsp', honey: true },
      { name: 'Cream or curd', qty: '1 cup' }, { name: 'Nuts', qty: 'to garnish' },
    ],
    steps: ['Mix a honey dough, roll thin and bake the layers.', 'Sandwich layers with sweetened cream and rest overnight.', 'Slice, drizzle with Dabur Honey and top with nuts.'],
  }),
];

export const getRecipe = (idOrSlug) => RECIPES.find((x) => x.id === idOrSlug);
export const getOccasion = (id) => OCCASIONS.find((o) => o.id === id);
