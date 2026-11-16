const locations = {
  jita: "Jita IV – Moon 4 (Caldari Navy Assembly Plant)",
  legion: "EIMJ-M - LEGION PENTHOUSE",
  ramRanch: "XZ-SKZ - Ram Ranch",
};

// Set bidirectional to false for a route with its own one-way tariff.
const routes = [
  { from: "jita", to: "legion", bidirectional: true, iskPerM3: 1100, collateralRate: 0.01 },
  { from: "jita", to: "ramRanch", bidirectional: true, iskPerM3: 1000, collateralRate: 0.01 },
];

const routesByOrigin = new Map();
for (const route of routes) {
  registerRoute(route);
  if (route.bidirectional) {
    registerRoute({ ...route, from: route.to, to: route.from });
  }
}

function registerRoute(route) {
  if (!routesByOrigin.has(route.from)) {
    routesByOrigin.set(route.from, new Map());
  }
  routesByOrigin.get(route.from).set(route.to, route);
}
