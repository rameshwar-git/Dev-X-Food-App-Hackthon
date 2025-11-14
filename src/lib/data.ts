import type { MenuCategory, MenuItem } from './types';
import { PlaceHolderImages } from './placeholder-images';

const getImage = (id: string) => {
  const placeholder = PlaceHolderImages.find(p => p.id === id);
  if (!placeholder) {
    return {
      src: 'https://picsum.photos/seed/placeholder/600/400',
      alt: 'Placeholder image',
      width: 600,
      height: 400,
      hint: 'placeholder'
    };
  }
  const url = new URL(placeholder.imageUrl);
  const pathParts = url.pathname.split('/');
  let width = 600;
  let height = 400;
  if (pathParts.length >= 3) {
      const widthStr = pathParts[pathParts.length - 2];
      const heightStr = pathParts[pathParts.length - 1];
      if(!isNaN(parseInt(widthStr))) width = parseInt(widthStr);
      if(!isNaN(parseInt(heightStr))) height = parseInt(heightStr);
  }


  return {
    src: placeholder.imageUrl,
    alt: placeholder.description,
    width,
    height,
    hint: placeholder.imageHint
  };
};

const allMenuItems: MenuItem[] = [
  // Appetizers
  { id: '101', name: 'Spring Rolls', description: 'Crispy vegetable spring rolls.', price: 559, category: 'Appetizers', image: getImage('spring-rolls') },
  { id: '102', name: 'Loaded Nachos', description: 'Nachos with cheese, jalapeños, and sour cream.', price: 799, category: 'Appetizers', image: getImage('nachos') },
  { id: '103', name: 'Onion Rings', description: 'Beer-battered crispy onion rings.', price: 639, category: 'Appetizers', image: getImage('onion-rings') },
  { id: '104', name: 'Mozzarella Sticks', description: 'Fried mozzarella sticks with marinara sauce.', price: 719, category: 'Appetizers', image: getImage('mozzarella-sticks') },
  { id: '105', name: 'Garlic Bread', description: 'Toasted bread with garlic, butter, and herbs.', price: 479, category: 'Appetizers', image: getImage('garlic-bread') },
  { id: '106', name: 'Fried Calamari', description: 'Lightly breaded and fried calamari.', price: 959, category: 'Appetizers', image:getImage('calamari') },
  { id: '107', name: 'Shrimp Cocktail', description: 'Chilled shrimp with a tangy cocktail sauce.', price: 1039, category: 'Appetizers', image: getImage('shrimp-cocktail') },
  { id: '108', name: 'Bruschetta', description: 'Toasted bread with tomatoes, garlic, and basil.', price: 719, category: 'Appetizers', image: getImage('bruchetta') },
  { id: '109', name: 'Chicken Wings', description: 'Spicy buffalo chicken wings.', price: 879, category: 'Appetizers', image: getImage('chicken-wings') },
  { id: '110', name: 'Dumplings', description: 'Steamed or fried pork dumplings.', price: 799, category: 'Appetizers', image: getImage('dumplings') },

  // Soups & Salads
  { id: '201', name: 'Garden Salad', description: 'Fresh greens, cherry tomatoes, cucumbers, and a light vinaigrette.', price: 719, category: 'Soups & Salads', image: getImage('salad') },
  { id: '202', name: 'Caesar Salad', description: 'Romaine lettuce, croutons, Parmesan cheese, and Caesar dressing.', price: 799, category: 'Soups & Salads', image: getImage('caesar-salad') },
  { id: '203', name: 'Greek Salad', description: 'Tomatoes, cucumbers, onions, feta cheese, and olives.', price: 879, category: 'Soups & Salads', image: getImage('greek-salad') },
  { id: '204', name: 'Cobb Salad', description: 'Greens with chicken, bacon, egg, avocado, and blue cheese.', price: 1119, category: 'Soups & Salads', image: getImage('cobb-salad') },
  { id: '205', name: 'Tomato Soup', description: 'Creamy tomato soup served with a crouton.', price: 559, category: 'Soups & Salads', image: getImage('soup') },
  { id: '206', name: 'Chicken Noodle Soup', description: 'Classic chicken noodle soup.', price: 639, category: 'Soups & Salads', image: getImage('chicken-noodle-soup') },
  { id: '207', name: 'French Onion Soup', description: 'Rich onion soup with a cheesy toast.', price: 719, category: 'Soups & Salads', image: getImage('french-onion-soup') },
  { id: '208', name: 'Miso Soup', description: 'Traditional Japanese soup with tofu and seaweed.', price: 399, category: 'Soups & Salads', image: getImage('miso-soup') },

  // Burgers & Sandwiches
  { id: '301', name: 'Gourmet Burger', description: '1/3 lb beef patty, brioche bun, lettuce, tomato, and our special sauce.', price: 1039, category: 'Burgers & Sandwiches', image: getImage('burger') },
  { id: '302', name: 'Club Sandwich', description: 'Triple-decker with turkey, bacon, lettuce, and tomato.', price: 959, category: 'Burgers & Sandwiches', image: getImage('club-sandwich') },
  { id: '303', name: 'BLT Sandwich', description: 'Classic bacon, lettuce, and tomato sandwich.', price: 799, category: 'Burgers & Sandwiches', image: getImage('blt-sandwich') },
  { id: '304', name: 'Philly Cheesesteak', description: 'Sliced beef, onions, and cheese on a hoagie roll.', price: 1119, category: 'Burgers & Sandwiches', image: getImage('philly-cheesesteak') },
  { id: '305', name: 'Reuben Sandwich', description: 'Corned beef, Swiss cheese, and sauerkraut on rye.', price: 1039, category: 'Burgers & Sandwiches', image: getImage('reuben-sandwich') },

  // Main Courses
  { id: '401', name: 'Grilled Steak', description: '8oz sirloin steak served with mashed potatoes and vegetables.', price: 1999, category: 'Main Courses', image: getImage('steak') },
  { id: '402', name: 'Grilled Salmon', description: 'Salmon fillet with a lemon-dill sauce, served with rice and asparagus.', price: 1759, category: 'Main Courses', image: getImage('salmon') },
  { id: '403', name: 'Pasta Carbonara', description: 'Spaghetti with pancetta, egg, and Parmesan cheese.', price: 1359, category: 'Main Courses', image: getImage('pasta-carbonara') },
  { id: '404', name: 'Chicken Parmesan', description: 'Breaded chicken with marinara and mozzarella, over spaghetti.', price: 1519, category: 'Main Courses', image: getImage('chicken-parm') },
  { id: '405', name: 'Fettuccine Alfredo', description: 'Fettuccine in a creamy Alfredo sauce.', price: 1279, category: 'Main Courses', image: getImage('fettuccine-alfredo') },
  { id: '406', name: 'Penne alla Vodka', description: 'Penne in a creamy tomato and vodka sauce.', price: 1439, category: 'Main Courses', image: getImage('penne-vodka') },
  { id: '407', name: 'Fish and Chips', description: 'Beer-battered cod with a side of fries.', price: 1359, category: 'Main Courses', image: getImage('fish-and-chips') },
  { id: '408', name: 'BBQ Ribs', description: 'A full rack of fall-off-the-bone BBQ ribs.', price: 1919, category: 'Main Courses', image: getImage('bbq-ribs') },
  { id: '409', name: 'Fried Chicken', description: 'Crispy Southern-style fried chicken.', price: 1439, category: 'Main Courses', image: getImage('fried-chicken') },
  { id: '410', name: 'Lasagna', description: 'Layers of pasta, meat sauce, and cheese.', price: 1519, category: 'Main Courses', image: getImage('lasagna') },

  // Pizza
  { id: '501', name: 'Pepperoni Pizza', description: 'Classic pizza with pepperoni and mozzarella.', price: 1199, category: 'Pizza', image: getImage('pizza-pepperoni') },
  { id: '502', name: 'Margherita Pizza', description: 'Pizza with tomatoes, mozzarella, and fresh basil.', price: 1119, category: 'Pizza', image: getImage('pizza-margherita') },
  { id: '503', name: 'Veggie Pizza', description: 'Pizza topped with a variety of fresh vegetables.', price: 1279, category: 'Pizza', image: getImage('pizza-veggie') },
  { id: '504', name: 'BBQ Chicken Pizza', description: 'Pizza with BBQ sauce, chicken, and red onions.', price: 1359, category: 'Pizza', image: getImage('pizza-bbq-chicken') },

  // Mexican
  { id: '601', name: 'Beef Tacos', description: 'Three soft tacos with seasoned beef and toppings.', price: 959, category: 'Mexican', image: getImage('tacos') },
  { id: '602', name: 'Chicken Fajitas', description: 'Sizzling platter of chicken, onions, and peppers.', price: 1439, category: 'Mexican', image: getImage('fajitas') },
  { id: '603', name: 'Beef Burrito', description: 'Large burrito filled with beef, beans, rice, and cheese.', price: 1039, category: 'Mexican', image: getImage('burrito') },
  { id: '604', name: 'Chicken Quesadilla', description: 'Grilled tortilla with chicken and melted cheese.', price: 879, category: 'Mexican', image: getImage('quesadilla') },

  // Asian
  { id: '701', name: 'Ramen', description: 'A rich and savory bowl of Japanese noodle soup.', price: 1199, category: 'Asian', image: getImage('ramen') },
  { id: '702', name: 'Sushi Rolls', description: 'An assortment of fresh sushi rolls.', price: 1519, category: 'Asian', image: getImage('sushi-roll') },
  { id: '703', name: 'Chicken Curry', description: 'Creamy and spicy chicken curry with rice.', price: 1279, category: 'Asian', image: getImage('curry') },
  { id: '704', name: 'Fried Rice', description: 'Wok-fried rice with vegetables and your choice of protein.', price: 1119, category: 'Asian', image: getImage('fried-rice') },
  { id: '705', name: 'Pad Thai', description: 'Stir-fried rice noodles with shrimp, peanuts, and lime.', price: 1359, category: 'Asian', image: getImage('pad-thai') },
  { id: '706', name: 'Beef Pho', description: 'Vietnamese noodle soup with beef.', price: 1199, category: 'Asian', image: getImage('pho') },
  { id: '707', name: 'Tuna Sashimi', description: 'Slices of fresh, raw tuna.', price: 1599, category: 'Asian', image: getImage('sashimi') },
  { id: '708', name: 'Shrimp Tempura', description: 'Lightly battered and fried shrimp.', price: 1279, category: 'Asian', image: getImage('tempura') },
  { id: '709', name: 'Edamame', description: 'Steamed and salted soybeans.', price: 479, category: 'Asian', image: getImage('edamame') },

  // Sides
  { id: '801', name: 'Crispy Fries', description: 'Golden, crispy, and perfectly salted.', price: 399, category: 'Sides', image: getImage('fries') },
  { id: '802', name: 'Mac and Cheese', description: 'Creamy, cheesy, baked macaroni.', price: 559, category: 'Sides', image: getImage('mac-and-cheese') },
  { id: '803', name: 'Chili', description: 'A small bowl of our hearty beef chili.', price: 479, category: 'Sides', image: getImage('chili') },

  // Desserts
  { id: '901', name: 'Vanilla Ice Cream', description: 'Two scoops of creamy vanilla ice cream.', price: 479, category: 'Desserts', image: getImage('ice-cream') },
  { id: '902', name: 'New York Cheesecake', description: 'A rich and dense slice of cheesecake.', price: 639, category: 'Desserts', image: getImage('cheesecake') },
  { id: '903', name: 'Chocolate Cake', description: 'A decadent slice of layered chocolate cake.', price: 639, category: 'Desserts', image: getImage('chocolate-cake') },
  { id: '904', name: 'Apple Pie', description: 'A warm slice of classic apple pie.', price: 559, category: 'Desserts', image: getImage('apple-pie') },
  { id: '905', name: 'Chocolate Brownie', description: 'A warm brownie with a fudgy center.', price: 559, category: 'Desserts', image: getImage('brownie') },
  { id: '906', name: 'Crème Brûlée', description: 'Rich custard base with a caramelized sugar topping.', price: 719, category: 'Desserts', image: getImage('creme-brulee') },
  { id: '907', name: 'Tiramisu', description: 'Coffee-flavored Italian dessert.', price: 719, category: 'Desserts', image: getImage('tiramisu') },
  { id: '908', name: 'Gelato', description: 'A scoop of authentic Italian gelato.', price: 479, category: 'Desserts', image: getImage('gelato') },
  { id: '909', name: 'Sorbet', description: 'A scoop of refreshing raspberry sorbet.', price: 479, category: 'Desserts', image: getImage('sorbet') },

  // Drinks
  { id: '1001', name: 'Fizzy Soda', description: 'Choose from a selection of popular fizzy drinks.', price: 200, category: 'Drinks', image: getImage('soda') },
  { id: '1002', name: 'Coffee', description: 'Freshly brewed hot coffee.', price: 239, category: 'Drinks', image: getImage('coffee') },
  { id: '1003', name: 'Tea', description: 'A selection of hot teas.', price: 239, category: 'Drinks', image: getImage('tea') },
  { id: '1004', name: 'Fruit Smoothie', description: 'A blend of fresh fruits.', price: 559, category: 'Drinks', image: getImage('smoothie') },
  { id: '1005', name: 'Chocolate Milkshake', description: 'A thick and creamy chocolate milkshake.', price: 479, category: 'Drinks', image: getImage('milkshake') },
  { id: '1006', name: 'Beer', description: 'A selection of local and imported beers.', price: 559, category: 'Drinks', image: getImage('beer') },
  { id: "1007", name: "Red Wine", description: "A glass of house red wine.", price: 719, category: "Drinks", image: getImage("wine") },
  { id: "1008", name: "Cocktail", description: "Ask about our featured cocktail.", price: 959, category: "Drinks", image: getImage("cocktail") },
  { id: "1009", name: "Orange Juice", description: "Freshly squeezed orange juice.", price: 399, category: "Drinks", image: getImage("juice") },
  { id: "1010", name: "Bottled Water", description: "Still or sparkling water.", price: 160, category: "Drinks", image: getImage("water") },
  { id: "1011", name: "Espresso", description: "A single shot of espresso.", price: 280, category: "Drinks", image: getImage("espresso") },
  { id: "1012", name: "Cappuccino", description: "Espresso with steamed milk foam.", price: 360, category: "Drinks", image: getImage("cappuccino") },
  { id: "1013", name: "Latte", description: "Espresso with steamed milk.", price: 360, category: "Drinks", image: getImage("latte") },
  { id: "1014", name: "Iced Coffee", description: "Chilled coffee over ice.", price: 319, category: "Drinks", image: getImage("iced-coffee") },
  { id: "1015", name: "Iced Tea", description: "Chilled black tea.", price: 280, category: "Drinks", image: getImage("iced-tea") },
  { id: "1016", name: "Lemonade", description: "Freshly made lemonade.", price: 319, category: "Drinks", image: getImage("lemonade") },
  { id: "1017", name: "Margarita", description: "Tequila, lime, and triple sec.", price: 879, category: "Drinks", image: getImage("margarita") },
  { id: "1018", name: "Mojito", description: "Rum, mint, lime, and soda.", price: 879, category: "Drinks", image: getImage("mojito") },
  { id: "1019", name: "Old Fashioned", description: "Whiskey, bitters, and sugar.", price: 1039, category: "Drinks", image: getImage("old-fashioned") },
  { id: "1020", name: "Manhattan", description: "Whiskey, sweet vermouth, and bitters.", price: 1039, category: "Drinks", image: getImage("manhattan") },
  { id: "1021", name: "Bloody Mary", description: "Vodka, tomato juice, and spices.", price: 959, category: "Drinks", image: getImage("bloody-mary") },

  // Quick Bites
  { id: '1101', name: 'Hot Dog', description: 'A classic beef hot dog in a bun.', price: 479, category: 'Quick Bites', image: getImage('hot-dog') },
  { id: '1102', name: 'Corn Dog', description: 'A hot dog coated in cornmeal batter and fried.', price: 559, category: 'Quick Bites', image: getImage('corn-dog') },
  { id: '1103', name: 'Soft Pretzel', description: 'A large, warm soft pretzel with salt.', price: 399, category: 'Quick Bites', image: getImage('pretzel') },
  { id: '1104', name: 'Popcorn', description: 'A classic movie-style popcorn.', price: 319, category: 'Quick Bites', image: getImage('popcorn') },
  { id: '1105', name: 'Cotton Candy', description: 'A fluffy cloud of spun sugar.', price: 399, category: 'Quick Bites', image: getImage('cotton-candy') }
];

export const menuItems: MenuItem[] = allMenuItems;

export const menuCategories: MenuCategory[] = allMenuItems.reduce((acc, item) => {
  let category = acc.find(c => c.name === item.category);
  if (!category) {
    category = { id: (acc.length + 1).toString(), name: item.category, items: [] };
    acc.push(category);
  }
  category.items.push(item);
  return acc;
}, [] as MenuCategory[]);
