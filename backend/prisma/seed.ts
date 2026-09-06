import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Clear existing data (idempotent — safe to re-run). Delete children first.
  await prisma.complaint.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.bartender.deleteMany();
  await prisma.chef.deleteMany();
  await prisma.waiter.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.restaurant.deleteMany();

  // Restaurants (from ERD sample records)
  const grill = await prisma.restaurant.create({
    data: {
      name: "The Grill House",
      address: "12 Adeola Odeku St, Victoria Island",
      contactNumber: "08012345678",
    },
  });
  const ocean = await prisma.restaurant.create({
    data: {
      name: "Ocean Breeze Restaurant",
      address: "45 Awolowo Road, Ikoyi",
      contactNumber: "08023456789",
    },
  });
  const spice = await prisma.restaurant.create({
    data: {
      name: "Spice Route",
      address: "7 Allen Avenue, Ikeja",
      contactNumber: "08034567890",
    },
  });

  // Customers
  const ada = await prisma.customer.create({
    data: { name: "Ada Johnson", phoneNumber: "08111222333", email: "ada.johnson@email.com" },
  });
  const tunde = await prisma.customer.create({
    data: { name: "Tunde Bakare", phoneNumber: "08122333444", email: "tunde.bakare@email.com" },
  });
  const grace = await prisma.customer.create({
    data: { name: "Grace Eze", phoneNumber: "08133444555", email: "grace.eze@email.com" },
  });

  // Menu items
  const chicken = await prisma.menuItem.create({
    data: { restaurantId: grill.id, name: "Grilled Chicken", type: "Food", price: 4500 },
  });
  const chapman = await prisma.menuItem.create({
    data: { restaurantId: grill.id, name: "Chapman", type: "Drink", price: 1500 },
  });
  const pasta = await prisma.menuItem.create({
    data: { restaurantId: ocean.id, name: "Cheese Pasta", type: "Food", price: 6000 },
  });
  await prisma.menuItem.create({
    data: { restaurantId: spice.id, name: "Jollof Rice", type: "Food", price: 3500 },
  });
  await prisma.menuItem.create({
    data: { restaurantId: spice.id, name: "Zobo", type: "Drink", price: 500 },
  });

  // Waiters
  const john = await prisma.waiter.create({
    data: { restaurantId: grill.id, name: "John Okafor" },
  });
  const mary = await prisma.waiter.create({
    data: { restaurantId: grill.id, name: "Mary Adigwe" },
  });
  const samuel = await prisma.waiter.create({
    data: { restaurantId: ocean.id, name: "Samuel Uche" },
  });

  // Chefs
  await prisma.chef.create({
    data: { restaurantId: grill.id, name: "Emeka Nwosu", specialty: "Grills & BBQ" },
  });
  await prisma.chef.create({
    data: { restaurantId: grill.id, name: "Ifeoma Chukwu", specialty: "Continental" },
  });
  await prisma.chef.create({
    data: { restaurantId: ocean.id, name: "Daniel Adeyemi", specialty: "Seafood" },
  });

  // Bartenders
  await prisma.bartender.create({
    data: { restaurantId: grill.id, name: "Chidi Umeh" },
  });
  await prisma.bartender.create({
    data: { restaurantId: grill.id, name: "Blessing Nnamdi" },
  });
  await prisma.bartender.create({
    data: { restaurantId: ocean.id, name: "Yusuf Bello" },
  });

  // An example order + payment + complaint (Order O001, customer Ada, waiter John)
  const order = await prisma.order.create({
    data: {
      customerId: ada.id,
      waiterId: john.id,
      status: "Completed",
      waitingTime: 15,
      items: {
        create: [
          { menuItemId: chicken.id, quantity: 2 },
          { menuItemId: chapman.id, quantity: 1 },
        ],
      },
    },
    include: { items: { include: { menuItem: true } } },
  });

  let amount = 0;
  for (const item of order.items) {
    amount += item.quantity * item.menuItem.price;
  }
  await prisma.payment.create({
    data: { orderId: order.id, amount, method: "Card", status: "Completed" },
  });
  await prisma.complaint.create({
    data: {
      orderId: order.id,
      description: "Food was cold on arrival",
      rating: 3,
    },
  });

  console.log("Seed complete ✅");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
