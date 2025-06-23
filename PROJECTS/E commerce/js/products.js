/**
 * Sample product data for Shubham Enterprise E-commerce Platform
 * This file contains mock product data for demonstration purposes
 */

const products = [
    {
        id: 'p001',
        name: 'Premium Cotton Fabric',
        description: 'High-quality premium cotton fabric with smooth texture and excellent durability. Perfect for garments, home decor, and crafting projects.',
        longDescription: `<p>Our Premium Cotton Fabric is crafted from the finest cotton fibers, offering exceptional quality and versatility for all your textile needs. This fabric features:</p>
        <ul>
            <li>100% pure cotton composition</li>
            <li>Smooth, even texture with minimal imperfections</li>
            <li>Excellent color retention even after multiple washes</li>
            <li>Breathable and comfortable for garment applications</li>
            <li>Durable construction for long-lasting use</li>
        </ul>
        <p>Available in various weights and widths to suit different applications, from lightweight apparel to medium-weight home decor. This fabric accepts dyes and prints beautifully, making it ideal for a wide range of creative projects.</p>
        <p>Our Premium Cotton Fabric is ethically sourced and manufactured according to industry standards, ensuring you receive a product that's not only high-quality but also responsibly produced.</p>`,
        sku: 'COT-PRM-001',
        category: 'Fabrics',
        subcategory: 'Cotton',
        image: 'images/products/cotton-fabric-1.jpg',
        images: [
            'images/products/cotton-fabric-1.jpg',
            'images/products/cotton-fabric-2.jpg',
            'images/products/cotton-fabric-3.jpg',
            'images/products/cotton-fabric-4.jpg'
        ],
        priceTiers: [
            { moq: 50, price: 120, label: '50-99 meters' },
            { moq: 100, price: 110, label: '100-499 meters' },
            { moq: 500, price: 100, label: '500+ meters' }
        ],
        basePrice: 130,
        unit: 'meter',
        stock: 2000,
        tags: ['cotton', 'fabric', 'premium', 'textile'],
        specifications: {
            'Material': '100% Cotton',
            'Width': '58 inches',
            'Weight': '180 GSM',
            'Weave': 'Plain',
            'Shrinkage': 'Pre-shrunk',
            'Care': 'Machine washable, tumble dry low'
        },
        featured: true,
        bestSeller: true,
        new: false,
        rating: 4.8,
        reviewCount: 124
    },
    {
        id: 'p002',
        name: 'Polyester Blend Fabric',
        description: 'Versatile polyester blend fabric that combines durability with easy care. Ideal for everyday garments and commercial applications.',
        longDescription: `<p>Our Polyester Blend Fabric offers the perfect combination of durability, easy care, and affordability. This versatile fabric is designed for a wide range of applications where performance matters.</p>
        <ul>
            <li>65% polyester, 35% cotton blend</li>
            <li>Wrinkle-resistant and easy to maintain</li>
            <li>Superior color fastness and dimensional stability</li>
            <li>Quick-drying properties</li>
            <li>Resistant to stretching and shrinking</li>
        </ul>
        <p>This fabric is particularly well-suited for commercial and institutional applications, including uniforms, workwear, and high-traffic home textiles. The polyester content provides strength and durability, while the cotton component adds comfort and breathability.</p>
        <p>Available in a wide range of colors and patterns, our Polyester Blend Fabric is a cost-effective solution for projects requiring both performance and economy.</p>`,
        sku: 'POLY-BLD-002',
        category: 'Fabrics',
        subcategory: 'Polyester',
        image: 'images/products/polyester-fabric-1.jpg',
        images: [
            'images/products/polyester-fabric-1.jpg',
            'images/products/polyester-fabric-2.jpg',
            'images/products/polyester-fabric-3.jpg'
        ],
        priceTiers: [
            { moq: 50, price: 85, label: '50-99 meters' },
            { moq: 100, price: 80, label: '100-499 meters' },
            { moq: 500, price: 75, label: '500+ meters' }
        ],
        basePrice: 90,
        unit: 'meter',
        stock: 3500,
        tags: ['polyester', 'blend', 'fabric', 'textile'],
        specifications: {
            'Material': '65% Polyester, 35% Cotton',
            'Width': '60 inches',
            'Weight': '150 GSM',
            'Weave': 'Twill',
            'Shrinkage': 'Less than 1%',
            'Care': 'Machine washable, tumble dry medium'
        },
        featured: false,
        bestSeller: true,
        new: false,
        rating: 4.5,
        reviewCount: 89
    },
    {
        id: 'p003',
        name: 'Silk Brocade Fabric',
        description: 'Luxurious silk brocade fabric with intricate patterns. Perfect for special occasion garments, home decor, and luxury crafts.',
        longDescription: `<p>Our Silk Brocade Fabric represents the pinnacle of luxury textiles, featuring exquisite patterns woven with meticulous attention to detail. This premium fabric embodies elegance and sophistication.</p>
        <ul>
            <li>85% silk, 15% metallic thread composition</li>
            <li>Intricate jacquard weave with raised patterns</li>
            <li>Rich, lustrous appearance with subtle sheen</li>
            <li>Medium-heavy weight with excellent drape</li>
            <li>Traditional designs with contemporary color palettes</li>
        </ul>
        <p>Each piece of our Silk Brocade Fabric showcases the artistry of traditional weaving techniques combined with modern production methods. The intricate patterns feature floral, geometric, and paisley motifs that catch and reflect light beautifully.</p>
        <p>Ideal for special occasion garments, luxury home decor, and high-end accessories, this fabric adds an unmistakable touch of opulence to any project. Due to the handcrafted nature of this fabric, slight variations in pattern and color add to its unique character.</p>`,
        sku: 'SLK-BRC-003',
        category: 'Fabrics',
        subcategory: 'Silk',
        image: 'images/products/silk-brocade-1.jpg',
        images: [
            'images/products/silk-brocade-1.jpg',
            'images/products/silk-brocade-2.jpg',
            'images/products/silk-brocade-3.jpg',
            'images/products/silk-brocade-4.jpg',
            'images/products/silk-brocade-5.jpg'
        ],
        priceTiers: [
            { moq: 25, price: 850, label: '25-49 meters' },
            { moq: 50, price: 800, label: '50-99 meters' },
            { moq: 100, price: 750, label: '100+ meters' }
        ],
        basePrice: 900,
        unit: 'meter',
        stock: 500,
        tags: ['silk', 'brocade', 'luxury', 'fabric', 'textile'],
        specifications: {
            'Material': '85% Silk, 15% Metallic Thread',
            'Width': '44 inches',
            'Weight': '250 GSM',
            'Weave': 'Jacquard Brocade',
            'Origin': 'Handcrafted in India',
            'Care': 'Dry clean only'
        },
        featured: true,
        bestSeller: false,
        new: true,
        rating: 4.9,
        reviewCount: 42
    },
    {
        id: 'p004',
        name: 'Denim Fabric',
        description: 'Durable denim fabric in various weights and washes. Perfect for jeans, jackets, bags, and other heavy-duty applications.',
        longDescription: `<p>Our premium Denim Fabric offers exceptional durability and classic style for a wide range of applications. This versatile textile has been crafted to meet the demands of both commercial production and creative projects.</p>
        <ul>
            <li>100% cotton denim construction</li>
            <li>Available in multiple weights from 8oz to 14oz</li>
            <li>Classic indigo blue with consistent dyeing</li>
            <li>Tight weave for excellent durability</li>
            <li>Softens with wear while maintaining strength</li>
        </ul>
        <p>Our denim fabric is ideal for creating jeans, jackets, overalls, bags, upholstery, and other items requiring durability and classic denim aesthetics. The fabric features the traditional diagonal ribbing pattern (twill) that characterizes authentic denim.</p>
        <p>We offer this fabric in various finishes including raw (unwashed), rinse washed, stone washed, and acid washed to suit different project requirements. Each finish provides a distinct look while maintaining the essential qualities that make denim a perennial favorite.</p>`,
        sku: 'DNM-STD-004',
        category: 'Fabrics',
        subcategory: 'Denim',
        image: 'images/products/denim-fabric-1.jpg',
        images: [
            'images/products/denim-fabric-1.jpg',
            'images/products/denim-fabric-2.jpg',
            'images/products/denim-fabric-3.jpg'
        ],
        priceTiers: [
            { moq: 50, price: 180, label: '50-99 meters' },
            { moq: 100, price: 170, label: '100-499 meters' },
            { moq: 500, price: 160, label: '500+ meters' }
        ],
        basePrice: 190,
        unit: 'meter',
        stock: 1500,
        tags: ['denim', 'jeans', 'fabric', 'heavy-duty', 'textile'],
        specifications: {
            'Material': '100% Cotton',
            'Width': '58 inches',
            'Weight': '12 oz',
            'Weave': 'Twill (3×1)',
            'Shrinkage': '3-5%',
            'Care': 'Machine wash cold, tumble dry low'
        },
        featured: false,
        bestSeller: true,
        new: false,
        rating: 4.7,
        reviewCount: 78
    },
    {
        id: 'p005',
        name: 'Linen Blend Fabric',
        description: 'Natural linen blend fabric with a textured finish. Breathable and lightweight, perfect for summer garments and home textiles.',
        longDescription: `<p>Our Linen Blend Fabric combines the natural beauty and breathability of linen with the practicality of a carefully selected blend. This fabric offers the perfect balance of luxury and everyday usability.</p>
        <ul>
            <li>55% linen, 45% cotton composition</li>
            <li>Natural textured appearance characteristic of linen</li>
            <li>Enhanced durability from the cotton content</li>
            <li>Excellent breathability and moisture-wicking properties</li>
            <li>Softens with each wash while maintaining structure</li>
        </ul>
        <p>This fabric is ideal for warm-weather garments, offering the cooling properties of linen with reduced wrinkling thanks to the cotton content. It's also excellent for home textiles like curtains, tablecloths, and lightweight upholstery where a natural, textured appearance is desired.</p>
        <p>Available in a range of earthy, natural tones that highlight the fabric's organic character. The fabric accepts dyes well, resulting in colors with depth and subtle variation that enhance its natural beauty.</p>`,
        sku: 'LIN-BLD-005',
        category: 'Fabrics',
        subcategory: 'Linen',
        image: 'images/products/linen-fabric-1.jpg',
        images: [
            'images/products/linen-fabric-1.jpg',
            'images/products/linen-fabric-2.jpg',
            'images/products/linen-fabric-3.jpg'
        ],
        priceTiers: [
            { moq: 50, price: 220, label: '50-99 meters' },
            { moq: 100, price: 210, label: '100-499 meters' },
            { moq: 500, price: 200, label: '500+ meters' }
        ],
        basePrice: 230,
        unit: 'meter',
        stock: 1200,
        tags: ['linen', 'blend', 'natural', 'fabric', 'textile'],
        specifications: {
            'Material': '55% Linen, 45% Cotton',
            'Width': '54 inches',
            'Weight': '200 GSM',
            'Weave': 'Plain',
            'Shrinkage': '2-3%',
            'Care': 'Machine wash gentle, line dry or tumble dry low'
        },
        featured: true,
        bestSeller: false,
        new: true,
        rating: 4.6,
        reviewCount: 53
    },
    {
        id: 'p006',
        name: 'Velvet Upholstery Fabric',
        description: 'Luxurious velvet fabric for upholstery and home decor. Features a plush pile and rich color depth for elegant interiors.',
        longDescription: `<p>Our Velvet Upholstery Fabric offers unparalleled luxury and visual impact for premium interior applications. This sumptuous fabric combines traditional elegance with modern performance features.</p>
        <ul>
            <li>100% polyester construction for durability and easy maintenance</li>
            <li>Dense, short pile with characteristic velvet sheen</li>
            <li>Rich, deep color saturation with subtle light play</li>
            <li>Stain-resistant treatment for practical everyday use</li>
            <li>Fire-retardant properties meeting commercial standards</li>
        </ul>
        <p>This premium velvet is ideal for upholstery projects including sofas, chairs, headboards, and ottomans. It's also excellent for drapery, cushions, and other soft furnishings where a touch of luxury is desired.</p>
        <p>Our velvet fabric is available in a curated palette of jewel tones, neutrals, and fashion-forward colors to complement any interior design scheme. The fabric's pile creates a subtle directional appearance that adds depth and interest to finished pieces.</p>`,
        sku: 'VLT-UPH-006',
        category: 'Fabrics',
        subcategory: 'Upholstery',
        image: 'images/products/velvet-fabric-1.jpg',
        images: [
            'images/products/velvet-fabric-1.jpg',
            'images/products/velvet-fabric-2.jpg',
            'images/products/velvet-fabric-3.jpg',
            'images/products/velvet-fabric-4.jpg'
        ],
        priceTiers: [
            { moq: 25, price: 450, label: '25-49 meters' },
            { moq: 50, price: 425, label: '50-99 meters' },
            { moq: 100, price: 400, label: '100+ meters' }
        ],
        basePrice: 475,
        unit: 'meter',
        stock: 800,
        tags: ['velvet', 'upholstery', 'luxury', 'fabric', 'home decor'],
        specifications: {
            'Material': '100% Polyester',
            'Width': '54 inches',
            'Weight': '380 GSM',
            'Pile Height': '2mm',
            'Abrasion Resistance': '50,000+ double rubs',
            'Care': 'Professional cleaning recommended'
        },
        featured: true,
        bestSeller: false,
        new: false,
        rating: 4.8,
        reviewCount: 67
    },
    {
        id: 'p007',
        name: 'Wool Suiting Fabric',
        description: 'Premium wool suiting fabric with a refined finish. Ideal for tailored suits, blazers, and formal wear with excellent drape and durability.',
        longDescription: `<p>Our Wool Suiting Fabric represents the gold standard for tailored garments, offering exceptional quality and performance for professional and formal attire.</p>
        <ul>
            <li>100% pure wool from select merino sheep</li>
            <li>Super 120s thread count for refined appearance</li>
            <li>Natural stretch and recovery for comfort</li>
            <li>Excellent drape and shape retention</li>
            <li>Breathable and temperature-regulating properties</li>
        </ul>
        <p>This premium suiting fabric is ideal for creating tailored suits, blazers, trousers, and skirts with a luxurious hand feel and professional appearance. The natural properties of wool ensure comfort across seasons, with inherent moisture-wicking and odor-resistant qualities.</p>
        <p>Available in classic business colors including navy, charcoal, black, and subtle pinstripes and herringbone patterns. Our wool suiting fabric undergoes a specialized finishing process to reduce itchiness while maintaining the natural benefits of wool.</p>`,
        sku: 'WOL-SUT-007',
        category: 'Fabrics',
        subcategory: 'Wool',
        image: 'images/products/wool-suiting-1.jpg',
        images: [
            'images/products/wool-suiting-1.jpg',
            'images/products/wool-suiting-2.jpg',
            'images/products/wool-suiting-3.jpg'
        ],
        priceTiers: [
            { moq: 25, price: 950, label: '25-49 meters' },
            { moq: 50, price: 900, label: '50-99 meters' },
            { moq: 100, price: 850, label: '100+ meters' }
        ],
        basePrice: 1000,
        unit: 'meter',
        stock: 600,
        tags: ['wool', 'suiting', 'tailoring', 'fabric', 'formal'],
        specifications: {
            'Material': '100% Merino Wool',
            'Width': '60 inches',
            'Weight': '260 GSM',
            'Thread Count': 'Super 120s',
            'Weave': 'Twill',
            'Care': 'Dry clean only'
        },
        featured: false,
        bestSeller: true,
        new: false,
        rating: 4.9,
        reviewCount: 45
    },
    {
        id: 'p008',
        name: 'Chiffon Fabric',
        description: 'Lightweight, sheer chiffon fabric with elegant drape. Perfect for overlays, scarves, evening wear, and delicate garments.',
        longDescription: `<p>Our Chiffon Fabric epitomizes delicate elegance with its lightweight, sheer quality and fluid drape. This ethereal fabric adds a touch of sophistication to any garment or accessory.</p>
        <ul>
            <li>100% polyester construction for durability and color retention</li>
            <li>Ultra-lightweight with characteristic sheer appearance</li>
            <li>Slight texture with matte finish</li>
            <li>Excellent drape with gentle movement</li>
            <li>Quick-drying properties</li>
        </ul>
        <p>This versatile fabric is ideal for creating flowing overlays, scarves, blouses, evening wear, and decorative elements where a light, airy quality is desired. The fabric's transparency makes it perfect for layering to create depth and visual interest.</p>
        <p>Available in a wide spectrum of colors from subtle pastels to vibrant jewel tones, our chiffon takes dye beautifully for rich, consistent color. The fabric's slight texture adds subtle visual interest while maintaining its characteristic flowing quality.</p>`,
        sku: 'CHF-PLY-008',
        category: 'Fabrics',
        subcategory: 'Chiffon',
        image: 'images/products/chiffon-fabric-1.jpg',
        images: [
            'images/products/chiffon-fabric-1.jpg',
            'images/products/chiffon-fabric-2.jpg',
            'images/products/chiffon-fabric-3.jpg'
        ],
        priceTiers: [
            { moq: 50, price: 95, label: '50-99 meters' },
            { moq: 100, price: 90, label: '100-499 meters' },
            { moq: 500, price: 85, label: '500+ meters' }
        ],
        basePrice: 100,
        unit: 'meter',
        stock: 2000,
        tags: ['chiffon', 'sheer', 'lightweight', 'fabric', 'textile'],
        specifications: {
            'Material': '100% Polyester',
            'Width': '58 inches',
            'Weight': '40 GSM',
            'Weave': 'Plain',
            'Transparency': 'Sheer',
            'Care': 'Hand wash cold, line dry'
        },
        featured: false,
        bestSeller: false,
        new: true,
        rating: 4.5,
        reviewCount: 38
    },
    {
        id: 'p009',
        name: 'Canvas Duck Fabric',
        description: 'Heavy-duty canvas duck fabric for upholstery, bags, outdoor gear, and craft projects requiring durability and structure.',
        longDescription: `<p>Our Canvas Duck Fabric offers exceptional durability and structure for heavy-duty applications. This utilitarian fabric combines strength with versatility for a wide range of practical uses.</p>
        <ul>
            <li>100% cotton construction</li>
            <li>Heavy-weight with tight, plain weave</li>
            <li>Water-resistant with natural stiffness</li>
            <li>Excellent tear and abrasion resistance</li>
            <li>Takes well to printing, painting, and dyeing</li>
        </ul>
        <p>This robust fabric is ideal for creating tote bags, backpacks, aprons, work wear, slipcovers, outdoor cushions, and other items requiring durability and structure. The tight weave provides excellent resistance to wind and light moisture, making it suitable for outdoor applications.</p>
        <p>Available in natural (unbleached) and a range of dyed colors, our canvas duck fabric maintains its structural integrity while offering versatility for both functional and decorative projects. The fabric softens slightly with washing while maintaining its essential durability.</p>`,
        sku: 'CNV-DCK-009',
        category: 'Fabrics',
        subcategory: 'Canvas',
        image: 'images/products/canvas-fabric-1.jpg',
        images: [
            'images/products/canvas-fabric-1.jpg',
            'images/products/canvas-fabric-2.jpg',
            'images/products/canvas-fabric-3.jpg'
        ],
        priceTiers: [
            { moq: 50, price: 190, label: '50-99 meters' },
            { moq: 100, price: 180, label: '100-499 meters' },
            { moq: 500, price: 170, label: '500+ meters' }
        ],
        basePrice: 200,
        unit: 'meter',
        stock: 1800,
        tags: ['canvas', 'duck', 'heavy-duty', 'fabric', 'textile'],
        specifications: {
            'Material': '100% Cotton',
            'Width': '60 inches',
            'Weight': '400 GSM (12 oz)',
            'Weave': 'Plain',
            'Shrinkage': '3-5%',
            'Care': 'Machine wash cold, tumble dry low'
        },
        featured: false,
        bestSeller: false,
        new: false,
        rating: 4.7,
        reviewCount: 62
    },
    {
        id: 'p010',
        name: 'Satin Fabric',
        description: 'Smooth, lustrous satin fabric with elegant sheen. Ideal for special occasion garments, linings, bedding, and decorative applications.',
        longDescription: `<p>Our Satin Fabric offers a luxurious appearance with its characteristic smooth surface and lustrous sheen. This elegant fabric adds a touch of opulence to any project.</p>
        <ul>
            <li>100% polyester construction for durability and easy care</li>
            <li>Smooth face with high sheen and matte back</li>
            <li>Medium weight with excellent drape</li>
            <li>Rich color depth with light-reflecting properties</li>
            <li>Resistant to wrinkles and creases</li>
        </ul>
        <p>This versatile fabric is perfect for creating special occasion garments, linings, bedding, drapery, and decorative accents where a luxurious appearance is desired. The fabric's smooth surface showcases colors beautifully, creating a rich, dimensional appearance.</p>
        <p>Available in a wide range of colors from subtle neutrals to vibrant jewel tones, our satin fabric maintains its lustrous appearance through repeated use and washing. The medium weight provides enough body for structure while maintaining elegant drape.</p>`,
        sku: 'STN-PLY-010',
        category: 'Fabrics',
        subcategory: 'Satin',
        image: 'images/products/satin-fabric-1.jpg',
        images: [
            'images/products/satin-fabric-1.jpg',
            'images/products/satin-fabric-2.jpg',
            'images/products/satin-fabric-3.jpg',
            'images/products/satin-fabric-4.jpg'
        ],
        priceTiers: [
            { moq: 50, price: 150, label: '50-99 meters' },
            { moq: 100, price: 140, label: '100-499 meters' },
            { moq: 500, price: 130, label: '500+ meters' }
        ],
        basePrice: 160,
        unit: 'meter',
        stock: 1500,
        tags: ['satin', 'shiny', 'smooth', 'fabric', 'textile'],
        specifications: {
            'Material': '100% Polyester',
            'Width': '58 inches',
            'Weight': '150 GSM',
            'Weave': 'Satin',
            'Finish': 'High sheen',
            'Care': 'Machine wash gentle, line dry or tumble dry low'
        },
        featured: true,
        bestSeller: true,
        new: false,
        rating: 4.6,
        reviewCount: 84
    }
];

// Export products array for use in other scripts
window.ShubhamProducts = products;