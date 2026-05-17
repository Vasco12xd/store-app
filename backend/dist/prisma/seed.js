"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    await prisma.product.createMany({
        data: [
            {
                name: 'Sony WH-1000XM5',
                description: 'Auriculares inalámbricos con cancelación de ruido líder en la industria, hasta 30 horas de batería y micrófono para llamadas cristalinas.',
                price: 350000,
                stockQuantity: 10,
                imageUrl: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800',
            },
            {
                name: 'Apple AirPods Pro 2',
                description: 'Auriculares in-ear con cancelación activa de ruido, audio espacial personalizado y hasta 6 horas de escucha.',
                price: 280000,
                stockQuantity: 8,
                imageUrl: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800',
            },
            {
                name: 'Samsung Galaxy Watch 6',
                description: 'Smartwatch con monitoreo avanzado de salud, GPS integrado, resistencia al agua 5ATM y batería de larga duración.',
                price: 180000,
                stockQuantity: 15,
                imageUrl: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800',
            },
        ],
    });
    console.log('✅ Seed completado: productos cargados');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map