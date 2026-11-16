import asyncio
import logging
from fastapi import APIRouter, Query, HTTPException
from typing import Optional, List, Dict, Any
from app.models.recipe import FeedResponse, Recipe, Ingredient, Nutrition, SearchRequest
from app.services.sleuth import sleuth_service
from app.services.store import recipe_store

logger = logging.getLogger(__name__)

router = APIRouter()

SEED_RECIPES: List[Recipe] = [
  # 1. HERO BIRYANI
  Recipe(
    id="royal-hyderabadi-dum-biryani",
    title="Grand Royal Hyderabadi Chicken Dum Biryani",
    description="Slow-cooked fragrant aged basmati rice layered with tender saffron-marinated chicken, golden caramelized onions (birista), fresh mint, and whole roasted spices sealed under an authentic dough dum.",
    image_url="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1200&q=80",
    prep_time_minutes=30,
    cook_time_minutes=45,
    total_time_minutes=75,
    servings=6,
    difficulty="Medium",
    cuisine="Mains & Biryani",
    tags=["Mains & Biryani", "Royal Feasts", "Trending"],
    is_clone_recipe=True,
    secret_hacks=[
      "Parboil basmati rice to exactly 70% with whole spices before layering",
      "Infuse warm milk with real Kashmiri saffron strands and pure desi ghee",
      "Seal the pot with dough to trap steam ('Dum') so chicken absorbs aromatic juices"
    ],
    ingredients=[
      Ingredient(name="Aged long-grain Basmati rice", amount="3", unit="cups"),
      Ingredient(name="Bone-in chicken thighs & drumsticks", amount="2", unit="lbs"),
      Ingredient(name="Thick Greek yogurt / curd", amount="1", unit="cup"),
      Ingredient(name="Fried sliced onions (Birista)", amount="2", unit="cups"),
      Ingredient(name="Pure Desi Ghee", amount="4", unit="tbsp"),
      Ingredient(name="Kashmiri saffron strands in warm milk", amount="1/4", unit="cup")
    ],
    instructions=[
      "Marinate chicken with yogurt, spices, mint, and half the fried onions for 2 hours.",
      "Parboil soaked basmati rice until 70% cooked. Drain immediately.",
      "Layer chicken, rice, saffron milk, ghee, and remaining onions.",
      "Seal tightly with dough and slow dum on a tawa for 35 mins."
    ],
    nutrition=Nutrition(calories="620 kcal", protein="44g", carbs="68g", fat="22g")
  ),

  # 2. STARTER: Bang Bang Shrimp
  Recipe(
    id="crispy-bang-bang-shrimp",
    title="Bonefish Grill Copycat Crispy Bang Bang Shrimp",
    description="Crunchy golden fried shrimp tossed in a creamy, sweet, and spicy sriracha chili-mayo sauce garnished with sliced scallions.",
    image_url="https://images.unsplash.com/photo-1559742811-822873691df8?auto=format&fit=crop&w=1200&q=80",
    prep_time_minutes=15,
    cook_time_minutes=10,
    total_time_minutes=25,
    servings=4,
    difficulty="Easy",
    cuisine="Starters & Appetizers",
    tags=["Starters", "Seafood", "20-Min Meals", "Secret Clones"],
    is_clone_recipe=True,
    secret_hacks=[
      "Coat shrimp in cornstarch rather than flour for an ultra-light glass-like crunch",
      "Sweet Thai chili sauce mixed with Japanese Kewpie mayo is the exact secret dressing"
    ],
    ingredients=[
      Ingredient(name="Large peeled shrimp", amount="1", unit="lb"),
      Ingredient(name="Cornstarch", amount="3/4", unit="cup"),
      Ingredient(name="Kewpie Mayonnaise", amount="1/2", unit="cup"),
      Ingredient(name="Sweet Thai chili sauce", amount="1/4", unit="cup")
    ],
    instructions=[
      "Whisk mayonnaise and sweet chili sauce together.",
      "Dredge shrimp in cornstarch and fry at 375°F for 2.5 minutes.",
      "Toss hot shrimp in sauce and serve immediately."
    ],
    nutrition=Nutrition(calories="380 kcal", protein="24g", carbs="22g", fat="22g")
  ),

  # 3. STARTER: Crispy Garlic Parmesan Wings
  Recipe(
    id="crispy-garlic-parm-wings",
    title="Crispy Tavern Garlic Parmesan Wings",
    description="Double-baked extra crispy chicken wings drenched in a buttery roasted garlic, cracked black pepper, and melted Pecorino sauce.",
    image_url="https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=1200&q=80",
    prep_time_minutes=15,
    cook_time_minutes=35,
    total_time_minutes=50,
    servings=4,
    difficulty="Easy",
    cuisine="Starters & Appetizers",
    tags=["Starters", "Wings", "Comfort Food"],
    is_clone_recipe=True,
    secret_hacks=["Toss raw wings in a pinch of aluminum-free baking powder for bubbly, glass-crisp skin without frying"],
    ingredients=[
      Ingredient(name="Chicken wings & drumettes", amount="2", unit="lbs"),
      Ingredient(name="Baking powder", amount="1", unit="tbsp"),
      Ingredient(name="Garlic butter", amount="4", unit="tbsp"),
      Ingredient(name="Freshly grated Parmesan", amount="1/2", unit="cup")
    ],
    instructions=["Bake wings on wire rack at 425°F for 40 mins, toss in warm garlic butter and parmesan."],
    nutrition=Nutrition(calories="460 kcal", protein="34g", carbs="3g", fat="32g")
  ),

  # 4. STARTER: Warm Spinach Artichoke Dip
  Recipe(
    id="spinach-artichoke-dip",
    title="Warm Skillet Spinach & Four-Cheese Artichoke Dip",
    description="Bubbling, creamy five-cheese dip loaded with tender spinach and marinated artichokes, served with hot toasted pita crisps.",
    image_url="https://images.unsplash.com/photo-1576097449798-7c7f90e1248a?auto=format&fit=crop&w=1200&q=80",
    prep_time_minutes=15,
    cook_time_minutes=20,
    total_time_minutes=35,
    servings=8,
    difficulty="Easy",
    cuisine="Starters & Appetizers",
    tags=["Starters", "Party Dips", "Comfort Food"],
    is_clone_recipe=True,
    secret_hacks=["Fold in marinated artichoke brine with cream cheese for tangy depth"],
    ingredients=[
      Ingredient(name="Chopped spinach", amount="10", unit="oz"),
      Ingredient(name="Marinated artichokes", amount="14", unit="oz"),
      Ingredient(name="Cream cheese & Gruyere", amount="10", unit="oz")
    ],
    instructions=["Mix ingredients, spread in cast-iron skillet, bake at 375°F until bubbly."],
    nutrition=Nutrition(calories="260 kcal", protein="9g", carbs="6g", fat="22g")
  ),

  # 5. MAINS: Butter Chicken
  Recipe(
    id="old-delhi-butter-chicken",
    title="Authentic Old Delhi Style Murgh Makhani (Butter Chicken)",
    description="Char-grilled tandoori chicken simmered in a velvety, buttery cashew and vine-ripened tomato gravy scented with kasuri methi.",
    image_url="https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=1200&q=80",
    prep_time_minutes=25,
    cook_time_minutes=30,
    total_time_minutes=55,
    servings=4,
    difficulty="Medium",
    cuisine="Mains & Biryani",
    tags=["Mains & Biryani", "Curries", "Trending"],
    is_clone_recipe=True,
    secret_hacks=["Crush toasted dried fenugreek leaves (kasuri methi) between palms right at the finish"],
    ingredients=[
      Ingredient(name="Boneless chicken thighs", amount="1.5", unit="lbs"),
      Ingredient(name="Tomato puree", amount="2", unit="cups"),
      Ingredient(name="Cashew paste", amount="1/4", unit="cup")
    ],
    instructions=["Grill chicken, simmer gravy with tomato and cashew, finish with butter, cream, and methi."],
    nutrition=Nutrition(calories="540 kcal", protein="38g", carbs="14g", fat="36g")
  ),

  # 6. MAINS: Kashmiri Mutton Rogan Josh
  Recipe(
    id="kashmiri-rogan-josh",
    title="Traditional Kashmiri Mutton Rogan Josh",
    description="Tender slow-braised lamb shanks in a crimson gravy flavored with dried Kashmiri cockscomb herb, fennel powder, and dry ginger.",
    image_url="https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=1200&q=80",
    prep_time_minutes=20,
    cook_time_minutes=90,
    total_time_minutes=110,
    servings=6,
    difficulty="Medium",
    cuisine="Mains & Biryani",
    tags=["Mains & Biryani", "Slow Cooked"],
    is_clone_recipe=False,
    secret_hacks=["Mustard oil brought to smoking point then cooled creates the authentic foundation"],
    ingredients=[
      Ingredient(name="Bone-in lamb shoulder", amount="2", unit="lbs"),
      Ingredient(name="Kashmiri red chili powder", amount="2", unit="tbsp")
    ],
    instructions=["Brown meat, whisk yogurt with spices, simmer gently for 90 mins until fork tender."],
    nutrition=Nutrition(calories="490 kcal", protein="42g", carbs="6g", fat="32g")
  ),

  # 7. MAINS: Char-Grilled Punjabi Tandoori Chicken
  Recipe(
    id="punjabi-tandoori-chicken",
    title="Smoky Char-Grilled Punjabi Tandoori Chicken",
    description="Crispy-skinned bone-in chicken marinated in hung curd, mustard oil, crushed coriander, and Kashmiri red chili, charred over smoky heat.",
    image_url="https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=1200&q=80",
    prep_time_minutes=20,
    cook_time_minutes=25,
    total_time_minutes=45,
    servings=4,
    difficulty="Medium",
    cuisine="Mains & Biryani",
    tags=["Mains & Biryani", "Tandoori", "Smoky"],
    is_clone_recipe=True,
    secret_hacks=["Perform a first marinade with lemon juice and salt for 15 minutes before adding spiced yogurt marinade"],
    ingredients=[
      Ingredient(name="Chicken leg quarters with incisions", amount="4", unit="pieces"),
      Ingredient(name="Hung thick curd", amount="1", unit="cup"),
      Ingredient(name="Kashmiri red chili paste", amount="2", unit="tbsp"),
      Ingredient(name="Mustard oil", amount="2", unit="tbsp")
    ],
    instructions=["Marinate chicken overnight, bake at 450°F or grill on skewers until charred and juicy."],
    nutrition=Nutrition(calories="410 kcal", protein="46g", carbs="4g", fat="22g")
  ),

  # 8. CHINESE: Szechuan Kung Pao Chicken
  Recipe(
    id="szechuan-kung-pao-chicken",
    title="Authentic Restaurant Szechuan Kung Pao Chicken",
    description="Juicy wok-tossed chicken thighs with roasted peanuts, blistered chili peppers, and tongue-tingling Szechuan peppercorns in a glossy sweet-savory sauce.",
    image_url="https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=1200&q=80",
    prep_time_minutes=20,
    cook_time_minutes=10,
    total_time_minutes=30,
    servings=4,
    difficulty="Medium",
    cuisine="Chinese & Asian Wok",
    tags=["Chinese & Asian", "Spicy", "Wok Specials"],
    is_clone_recipe=True,
    secret_hacks=["Velvet chicken with Shaoxing wine and cornstarch for tender restaurant texture"],
    ingredients=[
      Ingredient(name="Chicken thighs, diced", amount="1.2", unit="lbs"),
      Ingredient(name="Roasted peanuts", amount="1/2", unit="cup"),
      Ingredient(name="Dried red chilies", amount="12", unit="whole"),
      Ingredient(name="Sichuan peppercorns", amount="1", unit="tsp")
    ],
    instructions=["Velvet chicken, fry chilies and peppercorns in wok, stir-fry chicken, toss with sauce and peanuts."],
    nutrition=Nutrition(calories="450 kcal", protein="38g", carbs="16g", fat="26g")
  ),

  # 9. CHINESE: Dan Dan Noodles
  Recipe(
    id="crispy-chili-crunch-ramen",
    title="20-Minute Garlic Chili Crunch Dan Dan Noodles",
    description="Springy noodles tossed in rich toasted sesame paste, crispy spiced pork, and fiery homemade chili oil crunch.",
    image_url="https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=1200&q=80",
    prep_time_minutes=10,
    cook_time_minutes=10,
    total_time_minutes=20,
    servings=2,
    difficulty="Easy",
    cuisine="Chinese & Asian Wok",
    tags=["Chinese & Asian", "20-Min Meals"],
    is_clone_recipe=False,
    secret_hacks=["Emulsify tahini or Chinese sesame paste with hot dashi broth directly in the bowl"],
    ingredients=[
      Ingredient(name="Fresh ramen/egg noodles", amount="2", unit="portions"),
      Ingredient(name="Ground pork", amount="1/2", unit="lb"),
      Ingredient(name="Chinese sesame paste / tahini", amount="3", unit="tbsp")
    ],
    instructions=["Crisp pork in wok with garlic, mix sesame paste and broth in bowls, assemble."],
    nutrition=Nutrition(calories="580 kcal", protein="32g", carbs="56g", fat="24g")
  ),

  # 10. CHINESE: Crispy Honey Sesame Beef
  Recipe(
    id="crispy-honey-sesame-beef",
    title="Crispy Sweet Soy & Ginger Wok Beef",
    description="Thin strips of flank steak crisped to perfection and coated in a sticky garlic honey soy glaze with toasted sesame.",
    image_url="https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=1200&q=80",
    prep_time_minutes=15,
    cook_time_minutes=10,
    total_time_minutes=25,
    servings=4,
    difficulty="Easy",
    cuisine="Chinese & Asian Wok",
    tags=["Chinese & Asian", "Wok Specials"],
    is_clone_recipe=True,
    secret_hacks=["Toss beef strips in cornstarch and flash-fry twice for ultimate crispiness that holds sauce"],
    ingredients=[
      Ingredient(name="Flank steak, sliced thin against grain", amount="1", unit="lb"),
      Ingredient(name="Cornstarch", amount="1/2", unit="cup"),
      Ingredient(name="Soy sauce & honey", amount="1/3", unit="cup")
    ],
    instructions=["Dredge steak in cornstarch, fry until crispy, toss in honey ginger sauce."],
    nutrition=Nutrition(calories="480 kcal", protein="32g", carbs="28g", fat="24g")
  ),

  # 11. CONTINENTAL: Sizzling Steak Bites
  Recipe(
    id="garlic-butter-steak-bites",
    title="Cast-Iron Sizzling Garlic Butter Steak Bites",
    description="Tender cubes of prime ribeye steak seared with a caramelized garlic herb crust, basted in bubbling foaming butter.",
    image_url="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80",
    prep_time_minutes=10,
    cook_time_minutes=10,
    total_time_minutes=20,
    servings=4,
    difficulty="Easy",
    cuisine="Continental & Sizzlers",
    tags=["Continental", "Sizzlers", "20-Min Meals"],
    is_clone_recipe=False,
    secret_hacks=["Pat beef cubes completely dry and sear in small batches on a smoking hot skillet"],
    ingredients=[
      Ingredient(name="Ribeye steak cubes", amount="1.5", unit="lbs"),
      Ingredient(name="Unsalted butter", amount="4", unit="tbsp"),
      Ingredient(name="Garlic cloves", amount="5", unit="cloves")
    ],
    instructions=["Sear steak on hot cast iron, drop butter and herbs, baste for 1 min."],
    nutrition=Nutrition(calories="420 kcal", protein="36g", carbs="2g", fat="30g")
  ),

  # 12. CONTINENTAL: Creamy Tuscan Chicken
  Recipe(
    id="creamy-tuscan-garlic-chicken",
    title="One-Pan Creamy Tuscan Garlic Herb Chicken",
    description="Golden pan-seared chicken cutlets nestled in a sun-dried tomato, baby spinach, and garlic-parmesan cream reduction.",
    image_url="https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=1200&q=80",
    prep_time_minutes=15,
    cook_time_minutes=20,
    total_time_minutes=35,
    servings=4,
    difficulty="Easy",
    cuisine="Continental & Sizzlers",
    tags=["Continental", "Comfort Food"],
    is_clone_recipe=True,
    secret_hacks=["Cook garlic in the oil left over from sun-dried tomatoes for intense sweetness"],
    ingredients=[
      Ingredient(name="Chicken breasts", amount="2", unit="large"),
      Ingredient(name="Heavy cream", amount="1", unit="cup"),
      Ingredient(name="Sun-dried tomatoes", amount="1/2", unit="cup"),
      Ingredient(name="Baby spinach", amount="3", unit="cups")
    ],
    instructions=["Sear chicken cutlets, saute garlic and tomatoes, add cream and parmesan, wilt spinach."],
    nutrition=Nutrition(calories="510 kcal", protein="42g", carbs="8g", fat="35g")
  ),

  # 13. CONTINENTAL: Truffle Mushroom Tagliatelle
  Recipe(
    id="truffle-mushroom-tagliatelle",
    title="Truffle Cream Wild Mushroom Tagliatelle",
    description="Silky ribbon pasta tossed with caramelized cremini and shiitake mushrooms, white truffle oil, and shaved aged Parmesan.",
    image_url="https://images.unsplash.com/photo-1546549032-9571cd6b27df?auto=format&fit=crop&w=1200&q=80",
    prep_time_minutes=15,
    cook_time_minutes=15,
    total_time_minutes=30,
    servings=4,
    difficulty="Easy",
    cuisine="Continental & Sizzlers",
    tags=["Continental", "Italian", "Pastas"],
    is_clone_recipe=False,
    secret_hacks=["Emulsify starchy pasta cooking water into the mushroom pan before adding truffle oil off the heat"],
    ingredients=[
      Ingredient(name="Tagliatelle pasta", amount="1", unit="lb"),
      Ingredient(name="Mixed wild mushrooms", amount="12", unit="oz"),
      Ingredient(name="White truffle oil", amount="1.5", unit="tbsp")
    ],
    instructions=["Saute mushrooms until caramelized, toss cooked pasta with pasta water and butter, drizzle truffle oil."],
    nutrition=Nutrition(calories="460 kcal", protein="14g", carbs="64g", fat="18g")
  ),

  # 14. FAST FOOD CLONES: KFC Fried Chicken
  Recipe(
    id="kfc-leaked-secret-chicken",
    title="Leaked KFC 11 Herbs & Spices Fried Chicken",
    description="The reverse-engineered secret seasoning blend with the high white pepper ratio that gives iconic pressure-fried flavor.",
    image_url="https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=1200&q=80",
    prep_time_minutes=25,
    cook_time_minutes=20,
    total_time_minutes=45,
    servings=6,
    difficulty="Medium",
    cuisine="Secret Fast-Food Clones",
    tags=["Secret Clones", "Crispy", "Fast Food"],
    is_clone_recipe=True,
    secret_hacks=["3 tablespoons of ground white pepper is the true leaked flavor core"],
    ingredients=[
      Ingredient(name="Chicken thighs & drums", amount="3", unit="lbs"),
      Ingredient(name="All-purpose flour", amount="2", unit="cups"),
      Ingredient(name="Ground white pepper", amount="3", unit="tbsp")
    ],
    instructions=["Soak in buttermilk, double dredge in spiced flour, fry at 350°F."],
    nutrition=Nutrition(calories="490 kcal", protein="38g", carbs="24g", fat="26g")
  ),

  # 15. FAST FOOD CLONES: In-N-Out Animal Style Burger
  Recipe(
    id="in-n-out-animal-style-burger",
    title="Double-Double 'Animal Style' Secret Clone",
    description="Mustard-seared smashed chuck patties, slow caramelized jammy onions, melted American cheddar, and tangy Thousand Island spread on a toasted sponge bun.",
    image_url="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=80",
    prep_time_minutes=20,
    cook_time_minutes=15,
    total_time_minutes=35,
    servings=2,
    difficulty="Easy",
    cuisine="Secret Fast-Food Clones",
    tags=["Secret Clones", "Burgers", "Trending"],
    is_clone_recipe=True,
    secret_hacks=["Squirt yellow mustard on raw patties right before flipping onto the smoking hot griddle"],
    ingredients=[
      Ingredient(name="Ground chuck (80/20)", amount="1/2", unit="lb"),
      Ingredient(name="Yellow mustard", amount="2", unit="tbsp"),
      Ingredient(name="American cheese", amount="4", unit="slices")
    ],
    instructions=["Smash thin, sear with mustard, melt cheese, assemble with grilled onions."],
    nutrition=Nutrition(calories="670 kcal", protein="42g", carbs="39g", fat="38g")
  ),

  # 16. FAST FOOD CLONES: Chipotle Barbacoa
  Recipe(
    id="smoky-chipotle-barbacoa",
    title="Chipotle Style Slow Braised Beef Barbacoa",
    description="Melt-in-your-mouth shredded beef chuck simmered in a smoky chipotle adobo, Mexican oregano, and clove broth.",
    image_url="https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=1200&q=80",
    prep_time_minutes=20,
    cook_time_minutes=240,
    total_time_minutes=260,
    servings=8,
    difficulty="Easy",
    cuisine="Secret Fast-Food Clones",
    tags=["Secret Clones", "High Protein", "Meal Prep"],
    is_clone_recipe=True,
    secret_hacks=["Toast cumin and blend chipotles with apple cider vinegar and whole cloves"],
    ingredients=[
      Ingredient(name="Beef chuck roast", amount="3.5", unit="lbs"),
      Ingredient(name="Chipotles in adobo", amount="4", unit="peppers"),
      Ingredient(name="Apple cider vinegar", amount="1/3", unit="cup")
    ],
    instructions=["Sear beef roast, blend adobo sauce, slow cook on low for 6 hours until it pulls apart with forks."],
    nutrition=Nutrition(calories="340 kcal", protein="42g", carbs="4g", fat="16g")
  ),

  # 17. SIDES & FRIES: Hand-Cut Cajun Fries
  Recipe(
    id="cajun-seasoned-fries",
    title="Five Guys Copycat Cajun Seasoned Hand-Cut Fries",
    description="Thick hand-cut Idaho Russet potato fries double-fried in pure peanut oil and shaken vigorously in a smoky, spicy Cajun seasoning blend.",
    image_url="https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=1200&q=80",
    prep_time_minutes=30,
    cook_time_minutes=15,
    total_time_minutes=45,
    servings=4,
    difficulty="Medium",
    cuisine="Secret Fast-Food Clones",
    tags=["Fries", "Crispy", "Sides", "Fast Food"],
    is_clone_recipe=True,
    secret_hacks=["Soak cut fries in cold ice water for 30 minutes to wash off surface starch before first blanch fry at 325°F"],
    ingredients=[
      Ingredient(name="Russet potatoes, cut into 1/2-inch batons", amount="4", unit="large"),
      Ingredient(name="Peanut oil for frying", amount="4", unit="cups"),
      Ingredient(name="Cajun spice blend", amount="2", unit="tbsp")
    ],
    instructions=[
      "Soak potato batons in ice water for 30 minutes, dry thoroughly.",
      "Blanch fry in 325°F oil for 4 minutes until pale and limp. Drain.",
      "Flash-fry at 375°F for 3 minutes until deep golden and crispy. Toss with Cajun seasoning."
    ],
    nutrition=Nutrition(calories="380 kcal", protein="4g", carbs="48g", fat="19g")
  )
,
  Recipe(
    id="cowboy-soup-casserole",
    title="Cowboy Soup Comfort Casserole",
    description="Hearty ground beef simmered with pinto beans, sweet corn, diced fire-roasted tomatoes, green chiles, and warm Texas chili spices.",
    image_url="/images/allrecipes/8720981-cowboy-soup-VAT-Beauty-3x2-44df429a2fd54b4989fbc1bafb81a944.jpg",
    prep_time_minutes=15,
    cook_time_minutes=30,
    total_time_minutes=45,
    servings=8,
    difficulty="Easy",
    cuisine="Trending Now",
    tags=["Trending", "Soups", "Comfort Food"],
    is_clone_recipe=False,
    secret_hacks=["Add 1 tablespoon of Worcestershire sauce and a splash of pickle juice for savory complexity"],
    ingredients=[Ingredient(name="Ground chuck beef", amount="1.5", unit="lbs"), Ingredient(name="Canned pinto & black beans", amount="2", unit="cans"), Ingredient(name="Fire-roasted diced tomatoes", amount="2", unit="cans"), Ingredient(name="Frozen sweet corn", amount="1.5", unit="cups")],
    instructions=["Brown beef with onions, add canned vegetables and spices, simmer 30 mins."],
    nutrition=Nutrition(calories="390 kcal", protein="28g", carbs="36g", fat="14g")
  ),
  Recipe(
    id="one-pan-dirty-spaghetti",
    title="One-Pan Dirty Spaghetti",
    description="Savory skillet spaghetti cooked with Cajun spiced ground pork, holy trinity vegetables, and melted cheddar right in a single pot.",
    image_url="/images/allrecipes/11930383-one-pan-dirty-spaghetti-recipe-VAT-Beauty-3x2-7c3715e811814c8499050859f50e4e71.jpg",
    prep_time_minutes=15,
    cook_time_minutes=25,
    total_time_minutes=40,
    servings=6,
    difficulty="Easy",
    cuisine="Trending Now",
    tags=["Trending", "One-Pan", "Pasta"],
    is_clone_recipe=False,
    secret_hacks=["Simmer dry noodles directly in spiced chicken broth so they absorb all juices"],
    ingredients=[Ingredient(name="Spaghetti noodles", amount="1", unit="lb"), Ingredient(name="Ground pork sausage", amount="1", unit="lb"), Ingredient(name="Bell peppers & onions", amount="2", unit="cups")],
    instructions=["Brown meat, add vegetables and broth, submerge noodles and simmer 15 mins."],
    nutrition=Nutrition(calories="510 kcal", protein="26g", carbs="54g", fat="22g")
  ),
  Recipe(
    id="million-dollar-soup",
    title="Million Dollar Soup Comfort Food",
    description="Decadently creamy chicken soup with crisp bacon, cream cheese, sharp white cheddar, and tender ditalini pasta.",
    image_url="/images/allrecipes/11823470-AR-Million-Dollar-Soup-DDMFS-Peyton-Beckwith-Beauty-4x3-9dd9bb186a0a4fd9ad904b6bb13010c3.jpg",
    prep_time_minutes=20,
    cook_time_minutes=30,
    total_time_minutes=50,
    servings=6,
    difficulty="Easy",
    cuisine="Trending Now",
    tags=["Trending", "Soups", "Cozy"],
    is_clone_recipe=True,
    secret_hacks=["Melt block cream cheese into warm chicken broth slowly over low heat to prevent curdling"],
    ingredients=[Ingredient(name="Shredded chicken", amount="2", unit="cups"), Ingredient(name="Crispy bacon crumbles", amount="8", unit="strips"), Ingredient(name="Cream cheese", amount="8", unit="oz"), Ingredient(name="Sharp white cheddar", amount="2", unit="cups")],
    instructions=["Simmer chicken and aromatics, whisk in cream cheese and cheddar, garnish with bacon."],
    nutrition=Nutrition(calories="470 kcal", protein="32g", carbs="18g", fat="30g")
  ),
  Recipe(
    id="crunchwrap-casserole",
    title="Taco Bell Copycat Crunchwrap Casserole",
    description="Layers of seasoned lean ground beef, creamy nacho cheese sauce, crunchy tostadas, sour cream, shredded lettuce, and diced tomatoes baked until melted perfection.",
    image_url="/images/allrecipes/ar-best-recipies-24-7563621-crunchwrap-casserole-0908-3x2-7f8bddb16a9c44f39a4884c98fd1c215.jpg",
    prep_time_minutes=20,
    cook_time_minutes=25,
    total_time_minutes=45,
    servings=8,
    difficulty="Easy",
    cuisine="Budget Cooking Recipes",
    tags=["Nicole's Perfect Bite", "Casseroles", "Mexican-Inspired"],
    is_clone_recipe=True,
    secret_hacks=["Toast the corn tostada discs in the oven for 5 minutes before layering so they stay ultra-crisp inside the casserole"],
    ingredients=[Ingredient(name="Ground beef (80/20)", amount="1.5", unit="lbs"), Ingredient(name="Taco seasoning packet", amount="1", unit="packet"), Ingredient(name="Warm nacho cheese sauce", amount="15", unit="oz"), Ingredient(name="Crispy corn tostadas", amount="8", unit="discs")],
    instructions=["Brown beef with seasoning, layer tortillas and nacho cheese, top with tostadas and bake 25 mins."],
    nutrition=Nutrition(calories="520 kcal", protein="32g", carbs="38g", fat="28g")
  ),
  Recipe(
    id="swamp-potatoes-sausage",
    title="Smoky Cajun Swamp Potatoes and Sausage",
    description="Tender cubed potatoes simmered in a rich Cajun-spiced garlic butter sauce with smoky andouille sausage, sweet peppers, and sweet corn medallions.",
    image_url="/images/allrecipes/11763852-Swamp-Potatoes-and-Sausage-Peyton-Beckwith-4x3-2f22e1bca59c457abc798120d1ab620d.jpg",
    prep_time_minutes=15,
    cook_time_minutes=30,
    total_time_minutes=45,
    servings=6,
    difficulty="Easy",
    cuisine="Budget Cooking Recipes",
    tags=["Nicole's Perfect Bite", "One-Pan", "Southern Comfort"],
    is_clone_recipe=False,
    secret_hacks=["Par-microwave potatoes for 4 minutes so they develop a golden sear in the skillet without burning the garlic butter"],
    ingredients=[Ingredient(name="Smoked Andouille sausage", amount="1", unit="lb"), Ingredient(name="Yukon gold potatoes", amount="2", unit="lbs")],
    instructions=["Brown sausage, sear potatoes with Cajun butter, simmer together for 10 minutes."],
    nutrition=Nutrition(calories="440 kcal", protein="22g", carbs="36g", fat="24g")
  ),
  Recipe(
    id="mississippi-chicken-spaghetti",
    title="Stick of Butter Mississippi Chicken Spaghetti",
    description="Tender shredded chicken and spaghetti baked in an ultra-luxurious sauce made with a whole stick of butter, cream of chicken, ranch seasoning, tangy pepperoncini, and melted Monterey Jack.",
    image_url="/images/allrecipes/11785800-Mississippi-Chicken-Spaghetti-Beauty-4x3-a7bc1ed3c7ad4f9d94b464aa909fee8d.jpg",
    prep_time_minutes=20,
    cook_time_minutes=30,
    total_time_minutes=50,
    servings=8,
    difficulty="Easy",
    cuisine="Budget Cooking Recipes",
    tags=["Nicole's Perfect Bite", "Pasta", "Weeknight Dinner"],
    is_clone_recipe=False,
    secret_hacks=["Add 3 tablespoons of tangy pepperoncini brine directly to the cream sauce to cut through the rich butteriness"],
    ingredients=[Ingredient(name="Spaghetti pasta", amount="1", unit="lb"), Ingredient(name="Shredded chicken", amount="3", unit="cups"), Ingredient(name="Unsalted butter", amount="1", unit="stick")],
    instructions=["Melt butter with cream soup and ranch, toss chicken and pasta, top with cheese and bake 30 mins."],
    nutrition=Nutrition(calories="560 kcal", protein="36g", carbs="48g", fat="26g")
  ),
  Recipe(
    id="hawaiian-roll-donuts",
    title="15-Minute Apple Cider Hawaiian Roll Donuts",
    description="Sweet Hawaiian sweet rolls fried to golden perfection, dipped in spiced reduced apple cider butter, and rolled generously in cinnamon sugar.",
    image_url="/images/allrecipes/11786958-Apple-Cider-Hawaiian-Roll-Donuts-DDMFS-Beauty-4x3-eb340c9789354d3e923e53df2b4759de.jpg",
    prep_time_minutes=10,
    cook_time_minutes=10,
    total_time_minutes=20,
    servings=12,
    difficulty="Easy",
    cuisine="Budget Cooking Recipes",
    tags=["Nicole's Perfect Bite", "Dessert", "15-Min Treat"],
    is_clone_recipe=True,
    secret_hacks=["Reduce 1 cup of apple cider on high heat down to 3 tablespoons for intense orchard apple essence"],
    ingredients=[Ingredient(name="King's Hawaiian sweet rolls", amount="1", unit="pack"), Ingredient(name="Reduced apple cider", amount="3", unit="tbsp")],
    instructions=["Fry rolls for 1 min per side at 350\u00b0F, dip in cider butter, roll in cinnamon sugar."],
    nutrition=Nutrition(calories="230 kcal", protein="3g", carbs="34g", fat="9g")
  ),
  Recipe(
    id="50-dollar-grocery-budget-dinners",
    title="3 Easy Dinner Recipes To Make With $50 Worth of Groceries",
    description="Allrecipes chef Nicole McLaughlin shares how to stretch a single $50 grocery haul into three cozy skillet and pasta dinners without sacrificing flavor.",
    image_url="/images/allrecipes/ar-1-bag-3-dinners-ar-peyton-beckwith-4x3-4d72f7a3633f4955a0812e6e23785088.jpg",
    prep_time_minutes=25,
    cook_time_minutes=35,
    total_time_minutes=60,
    servings=6,
    difficulty="Easy",
    cuisine="Budget Cooking Recipes",
    tags=["Nicole's Perfect Bite", "Budget Cooking", "Family Meals"],
    is_clone_recipe=False,
    secret_hacks=["Cook pasta directly in simmering cheesy skillet sauce to absorb all seasoned starches"],
    ingredients=[Ingredient(name="Skillet noodles", amount="1", unit="lb"), Ingredient(name="Rotisserie chicken", amount="1.5", unit="lbs")],
    instructions=["Simmer chicken, noodles, broth in skillet, top with cheese and broil 2 mins."],
    nutrition=Nutrition(calories="510 kcal", protein="38g", carbs="42g", fat="22g")
  ),
  Recipe(
    id="pumpkin-dump-cake",
    title="Classic Spiced Pumpkin Dump Cake",
    description="An effortless autumnal crowd-pleaser: rich spiced pumpkin custard topped with crunchy yellow cake mix, melted butter, and toasted pecans.",
    image_url="/images/allrecipes/26060-pumpkin-dump-cake-PICS-Beauty-3x2-f88bf3dc93b14c55b03846c0a1cb8ead.jpg",
    prep_time_minutes=10,
    cook_time_minutes=50,
    total_time_minutes=60,
    servings=12,
    difficulty="Easy",
    cuisine="Desserts & Bakery",
    tags=["Desserts & Bakery", "Thanksgiving", "Cakes"],
    is_clone_recipe=False,
    secret_hacks=["Drizzle cold thinly sliced butter evenly over every square inch of dry cake mix to ensure zero dry flour spots"],
    ingredients=[Ingredient(name="Pure pumpkin puree", amount="15", unit="oz"), Ingredient(name="Yellow cake mix", amount="1", unit="box"), Ingredient(name="Butter & pecans", amount="1", unit="cup")],
    instructions=["Pour pumpkin custard in dish, top with dry cake mix and butter slices, bake 55 mins at 350\u00b0F."],
    nutrition=Nutrition(calories="360 kcal", protein="4g", carbs="48g", fat="18g")
  ),
  Recipe(
    id="easy-chocolate-cream-pie",
    title="Silky No-Bake Chocolate Cream Pie",
    description="Velvety dark chocolate pudding poured into a buttery flaky crust, crowned with billowing homemade vanilla whipped cream and dark chocolate curls.",
    image_url="/images/allrecipes/12154-chocolate-cream-pie-i-DDMFS-4x3-14890-498a3bb4688e4ea69d6cf668b4101402.jpg",
    prep_time_minutes=20,
    cook_time_minutes=0,
    total_time_minutes=20,
    servings=8,
    difficulty="Easy",
    cuisine="Desserts & Bakery",
    tags=["Desserts & Bakery", "Pies", "Chocolate"],
    is_clone_recipe=True,
    secret_hacks=["Fold in 2 ounces of melted 70% dark bittersweet chocolate into the pudding base for deep gourmet flavor"],
    ingredients=[Ingredient(name="Baked 9-inch pie crust", amount="1", unit="crust"), Ingredient(name="Chocolate chips & whole milk", amount="3.5", unit="cups")],
    instructions=["Cook chocolate pudding, pour into crust, chill 4 hours, top with whipped cream."],
    nutrition=Nutrition(calories="410 kcal", protein="6g", carbs="44g", fat="24g")
  ),
  Recipe(
    id="peanut-butter-pie",
    title="Fluffy Reese's Peanut Butter Cream Pie",
    description="An irresistible cloud-like peanut butter mousse filling loaded inside an Oreo cookie crust, topped with fresh whipped cream and chopped peanut butter cups.",
    image_url="/images/allrecipes/9174-peanut-butter-pie-pics_0166_3x2-bec7ecfe6dfc48feae78469abb9db5af.jpeg",
    prep_time_minutes=15,
    cook_time_minutes=0,
    total_time_minutes=15,
    servings=10,
    difficulty="Easy",
    cuisine="Desserts & Bakery",
    tags=["Desserts & Bakery", "Pies", "No-Bake"],
    is_clone_recipe=True,
    secret_hacks=["Beat cream cheese and peanut butter until completely fluffy before folding whipped topping"],
    ingredients=[Ingredient(name="Creamy peanut butter", amount="1", unit="cup"), Ingredient(name="Cream cheese", amount="8", unit="oz"), Ingredient(name="Chocolate cookie crust", amount="1", unit="crust")],
    instructions=["Beat peanut butter and cream cheese, fold whipped cream, spoon in crust, chill 2 hours."],
    nutrition=Nutrition(calories="480 kcal", protein="10g", carbs="38g", fat="32g")
  ),
  Recipe(
    id="gingersnap-pumpkin-trifle",
    title="Layered Spiced Gingersnap Pumpkin Trifle",
    description="Showstopping layers of crunchy spiced gingersnap cookies, silky cinnamon pumpkin mousse, and sweet vanilla mascarpone cream.",
    image_url="/images/allrecipes/240146_gingersnap-pumpkin-trifle-4x3-f4025525b4ce4384afb13c488255622e.jpg",
    prep_time_minutes=25,
    cook_time_minutes=0,
    total_time_minutes=25,
    servings=12,
    difficulty="Easy",
    cuisine="Desserts & Bakery",
    tags=["Desserts & Bakery", "Showstoppers", "Holiday"],
    is_clone_recipe=False,
    secret_hacks=["Let trifle sit chilled for at least 6 hours so cookies soften into cake-like texture"],
    ingredients=[Ingredient(name="Gingersnap cookies", amount="1", unit="package"), Ingredient(name="Pumpkin mousse & pudding", amount="4", unit="cups")],
    instructions=["Layer gingersnaps, pumpkin pudding, and whipped cream in trifle dish. Chill 6 hours."],
    nutrition=Nutrition(calories="320 kcal", protein="4g", carbs="46g", fat="14g")
  ),
  Recipe(
    id="old-fashioned-apple-crisp",
    title="Warm Golden Old-Fashioned Apple Crisp",
    description="Tender caramelized Honeycrisp apple slices tossed in cinnamon and brown sugar, blanketed by a crispy, buttery golden rolled oat streusel.",
    image_url="/images/allrecipes/12409-apple-crisp-II-MFS-033-beauty1-4x3-e7f6d6c193484e0daa43e571723ff16e.jpg",
    prep_time_minutes=20,
    cook_time_minutes=40,
    total_time_minutes=60,
    servings=8,
    difficulty="Easy",
    cuisine="Desserts & Bakery",
    tags=["Desserts & Bakery", "Apple Crisp", "Fall Comfort"],
    is_clone_recipe=False,
    secret_hacks=["Toss apples with lemon juice and cornstarch so bubbling juices form a thick caramel sauce"],
    ingredients=[Ingredient(name="Honeycrisp apples, sliced", amount="6", unit="cups"), Ingredient(name="Rolled oats & flour", amount="2", unit="cups")],
    instructions=["Layer spiced apples in dish, top with oat butter crumble, bake at 375\u00b0F for 40 mins."],
    nutrition=Nutrition(calories="340 kcal", protein="3g", carbs="56g", fat="12g")
  ),
  Recipe(
    id="simple-pumpkin-pie",
    title="Traditional Blue-Ribbon Simple Pumpkin Pie",
    description="The time-honored traditional spiced custard pie with a silken texture, warm nutmeg and ginger notes, and a flaky all-butter pastry crust.",
    image_url="/images/allrecipes/229932-Simple-Pumpkin-Pie-VAT-Beauty-3x2-bc0cda7f87ab41cdade2de88b49e7e66.jpg",
    prep_time_minutes=15,
    cook_time_minutes=55,
    total_time_minutes=70,
    servings=8,
    difficulty="Easy",
    cuisine="Desserts & Bakery",
    tags=["Desserts & Bakery", "Thanksgiving", "Pies"],
    is_clone_recipe=False,
    secret_hacks=["Bake 15 mins at 425\u00b0F then reduce to 350\u00b0F to guarantee a crisp bottom crust"],
    ingredients=[Ingredient(name="Pumpkin puree & condensed milk", amount="29", unit="oz"), Ingredient(name="Pie crust", amount="1", unit="crust")],
    instructions=["Whisk filling, pour into pie shell, bake 15 mins at 425\u00b0F then 40 mins at 350\u00b0F."],
    nutrition=Nutrition(calories="310 kcal", protein="6g", carbs="42g", fat="13g")
  ),
  Recipe(
    id="best-mashed-potatoes",
    title="Chef's Velvet Garlic & Butter Mashed Potatoes",
    description="Fluffy Yukon Gold potatoes passed through a ricer, whipped with steaming heavy cream, melted butter, roasted garlic, and a hint of white pepper.",
    image_url="/images/allrecipes/24771-basic-mashed-potatoes-PICS-Beauty-3x2-8ffd8f88eab24eb380fc809bbb53e404.jpg",
    prep_time_minutes=15,
    cook_time_minutes=25,
    total_time_minutes=40,
    servings=8,
    difficulty="Easy",
    cuisine="Popular Sides & Casseroles",
    tags=["Holiday Sides", "Comfort Food", "Gluten-Free"],
    is_clone_recipe=False,
    secret_hacks=["Dry out boiled potatoes in warm empty pot for 2 mins before mashing"],
    ingredients=[Ingredient(name="Yukon gold potatoes", amount="5", unit="lbs"), Ingredient(name="Butter & cream", amount="2", unit="cups")],
    instructions=["Boil potatoes, pass through ricer, whip with hot cream, butter, and roasted garlic."],
    nutrition=Nutrition(calories="320 kcal", protein="4g", carbs="38g", fat="18g")
  ),
  Recipe(
    id="yummy-sweet-potato-casserole",
    title="Pecan Streusel Brown Sugar Sweet Potato Casserole",
    description="Smooth spiced sweet potato souffle baked with a crisp, crunchy brown sugar and roasted pecan butter crumble on top.",
    image_url="/images/allrecipes/21261-yummy-sweet-potato-casserole-PreethiVenkatramAllrecipes-4x3-d4a57286ea07483fb0cc386f5def07a5.jpg",
    prep_time_minutes=20,
    cook_time_minutes=35,
    total_time_minutes=55,
    servings=10,
    difficulty="Easy",
    cuisine="Popular Sides & Casseroles",
    tags=["Holiday Sides", "Thanksgiving", "Sweet Potatoes"],
    is_clone_recipe=False,
    secret_hacks=["Roast sweet potatoes whole in their skins to concentrate sugars"],
    ingredients=[Ingredient(name="Sweet potatoes, mashed", amount="4", unit="cups"), Ingredient(name="Pecans & brown sugar", amount="2.5", unit="cups")],
    instructions=["Whip sweet potato base, spread in dish, top with pecan crumble, bake at 350\u00b0F for 35 mins."],
    nutrition=Nutrition(calories="380 kcal", protein="4g", carbs="52g", fat="18g")
  ),
  Recipe(
    id="best-homemade-stuffing",
    title="Traditional Golden Herb & Sausage Stuffing",
    description="Crispy-edged toasted sourdough and brioche bread cubes tossed with sage, fresh thyme, caramelized onions, celery, and savory herb broth.",
    image_url="/images/allrecipes/23412-old-fashioned-stuffing-VAT-010-4x3-c1cf03bc7d20494d81d8e536380bcdfe.jpg",
    prep_time_minutes=25,
    cook_time_minutes=45,
    total_time_minutes=70,
    servings=10,
    difficulty="Medium",
    cuisine="Popular Sides & Casseroles",
    tags=["Holiday Sides", "Thanksgiving", "Bread Dressing"],
    is_clone_recipe=False,
    secret_hacks=["Dry bread cubes in oven at 250\u00b0F until completely crisp so they absorb rich broth"],
    ingredients=[Ingredient(name="Sourdough & brioche cubes", amount="12", unit="cups"), Ingredient(name="Poultry broth & butter", amount="4", unit="cups")],
    instructions=["Saute celery, onions, and herbs, toss with dry bread and broth, bake at 375\u00b0F for 45 mins."],
    nutrition=Nutrition(calories="290 kcal", protein="6g", carbs="38g", fat="12g")
  ),
  Recipe(
    id="green-bean-casserole",
    title="Crispy French Onion Creamy Green Bean Casserole",
    description="Crisp-tender green beans folded in a rich creamy mushroom garlic sauce, topped with an extra thick mound of crunchy fried onions.",
    image_url="/images/allrecipes/ALR-13660-green-bean-casserole-i-VAT-4x3-c6fafe7e10c1430e9965a40e814b8840.jpg",
    prep_time_minutes=15,
    cook_time_minutes=30,
    total_time_minutes=45,
    servings=8,
    difficulty="Easy",
    cuisine="Popular Sides & Casseroles",
    tags=["Holiday Sides", "Green Beans", "Casseroles"],
    is_clone_recipe=True,
    secret_hacks=["Blanch green beans in salted water first so they stay snappy and vibrant"],
    ingredients=[Ingredient(name="Green beans", amount="2", unit="lbs"), Ingredient(name="French fried onions", amount="2", unit="cups")],
    instructions=["Mix green beans with soup, bake 25 mins, top with crispy onions and bake 5 mins."],
    nutrition=Nutrition(calories="210 kcal", protein="4g", carbs="22g", fat="12g")
  ),
  Recipe(
    id="homemade-cranberry-sauce",
    title="Zesty Blood Orange & Spiced Cranberry Sauce",
    description="Fresh tart cranberries burst in a simmering bath of fresh orange juice, ruby zest, cinnamon stick, and pure cane sugar.",
    image_url="/images/allrecipes/9111-cranberry-sauce-DDMFS-4x3-09d16e1a548145cea22d7d43f04c44d8.jpg",
    prep_time_minutes=10,
    cook_time_minutes=15,
    total_time_minutes=25,
    servings=10,
    difficulty="Easy",
    cuisine="Popular Sides & Casseroles",
    tags=["Holiday Sides", "Sauces", "Quick"],
    is_clone_recipe=False,
    secret_hacks=["Add a pinch of sea salt and splash of bourbon at the end"],
    ingredients=[Ingredient(name="Fresh cranberries", amount="12", unit="oz"), Ingredient(name="Orange juice & zest", amount="1/2", unit="cup")],
    instructions=["Boil juice and sugar, add cranberries and simmer 10 mins until popped. Chill."],
    nutrition=Nutrition(calories="110 kcal", protein="0g", carbs="28g", fat="0g")
  ),
  Recipe(
    id="ultra-cheesy-mac-and-cheese",
    title="Southern Three-Cheese Baked Macaroni & Cheese",
    description="Elbow pasta drenched in a rich roux-based cheddar, Gruyere, and Colby Jack cheese sauce, baked with a golden bubbling cheese crust.",
    image_url="/images/allrecipes/11679-homemade-mac-and-cheese-VAT-022-4x3-4b84cfe8a2234cfda3d936a5333fe292.jpg",
    prep_time_minutes=20,
    cook_time_minutes=30,
    total_time_minutes=50,
    servings=8,
    difficulty="Easy",
    cuisine="Popular Sides & Casseroles",
    tags=["Holiday Sides", "Comfort Food", "Pasta"],
    is_clone_recipe=True,
    secret_hacks=["Grate cheese by hand: pre-bagged cheese has anti-caking starch that creates graininess"],
    ingredients=[Ingredient(name="Elbow macaroni", amount="1", unit="lb"), Ingredient(name="Sharp cheddar & Gruyere", amount="4.5", unit="cups")],
    instructions=["Make cheese sauce with roux and milk, fold in macaroni, bake at 375\u00b0F for 25 mins."],
    nutrition=Nutrition(calories="580 kcal", protein="24g", carbs="52g", fat="32g")
  )
]

@router.get("/feed", response_model=FeedResponse)
async def get_feed(
  category: Optional[str] = Query(None),
  tag: Optional[str] = Query(None),
  page: int = Query(1, ge=1),
  page_size: int = Query(20, ge=1, le=100)
):
  filtered = recipe_store.get_all()
  if category and category != "All":
    filtered = [
      r for r in filtered
      if (r.cuisine and category.lower() in r.cuisine.lower()) or
         any(category.lower() in t.lower() for t in r.tags)
    ]
  if tag:
    filtered = [r for r in filtered if any(tag.lower() in t.lower() for t in r.tags)]

  total = len(filtered)
  start = (page - 1) * page_size
  end = start + page_size
  items = filtered[start:end]

  return FeedResponse(
    items=items,
    total=total,
    page=page,
    has_more=end < total
  )

@router.post("/feed/sync-trending")
async def sync_trending_recipes():
  prompts = [
    "creamy tuscan garlic shrimp",
    "crispy smashed fingerling potatoes",
    "birria quesatacos with consomme",
  ]
  synced = []
  for q in prompts:
    existing = recipe_store.get_by_id(q.replace(" ", "-"))
    if not existing:
      try:
        recipe = await asyncio.to_thread(sleuth_service.sleuth_recipe, q)
        if recipe:
          recipe_store.add_or_update(recipe)
          synced.append(recipe.title)
          break
      except Exception:
        continue
  return {
    "status": "success",
    "synced": synced,
    "total_recipes": len(recipe_store.get_all()),
  }

@router.get("/editorial")
async def get_editorial_lineup(
  days_per_cycle: int = Query(3, ge=1, le=14),
  cycle_offset: int = Query(0)
):
  return recipe_store.get_periodic_editorial(
    days_per_cycle=days_per_cycle,
    cycle_offset=cycle_offset,
  )

@router.get("/recipes/{recipe_id}", response_model=Recipe)
async def get_recipe(recipe_id: str):
  recipe = recipe_store.get_by_id(recipe_id)
  if recipe:
    return recipe
  raise HTTPException(status_code=404, detail="Recipe not found")

@router.post("/search", response_model=FeedResponse)
async def search_recipes(req: SearchRequest):
  q = req.query.strip().lower()
  filtered = [
    r for r in recipe_store.get_all()
    if q in r.title.lower() or
       q in r.description.lower() or
       any(q in t.lower() for t in r.tags) or
       any(q in i.name.lower() for i in r.ingredients)
  ]

  # Dynamic Web Scraping + NVIDIA Nemotron Synthesis if no local recipe matches
  if not filtered and q:
    try:
      logger.info(f"Initiating live culinary sleuth for '{req.query}' with NVIDIA Nemotron...")
      sleuthed = await asyncio.to_thread(sleuth_service.sleuth_recipe, req.query.strip())
      if sleuthed:
        recipe_store.add_or_update(sleuthed)
        filtered = [sleuthed]
    except Exception as e:
      logger.error(f"Failed to sleuth recipe for '{req.query}': {e}")

  total = len(filtered)
  start = (req.page - 1) * req.page_size
  end = start + req.page_size
  items = filtered[start:end]

  return FeedResponse(
    items=items,
    total=total,
    page=req.page,
    has_more=end < total
  )

@router.post("/sleuth", response_model=Recipe)
async def sleuth_recipe_endpoint(req: SearchRequest):
  q = req.query.strip()
  if not q:
    raise HTTPException(status_code=400, detail="Search query cannot be empty")

  # Return existing cached recipe if already synthesized
  for r in recipe_store.get_all():
    if q.lower() in r.title.lower() or q.lower() in r.id.lower():
      return r

  try:
    logger.info(f"Dedicated sleuth requested for '{q}' via NVIDIA Nemotron...")
    sleuthed = await asyncio.to_thread(sleuth_service.sleuth_recipe, q)
    if sleuthed:
      recipe_store.add_or_update(sleuthed)
      return sleuthed
    raise HTTPException(status_code=404, detail=f"No recipe found online for '{q}'")
  except HTTPException:
    raise
  except Exception as e:
    logger.error(f"Sleuth error: {e}")
    raise HTTPException(status_code=500, detail=str(e))
