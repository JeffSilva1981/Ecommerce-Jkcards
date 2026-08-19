-- Dados fictícios utilizados somente no ambiente de desenvolvimento.

INSERT INTO tb_category (name)
SELECT 'Boosters'
WHERE NOT EXISTS (
    SELECT 1 FROM tb_category WHERE name = 'Boosters'
);

INSERT INTO tb_category (name)
SELECT 'Decks'
WHERE NOT EXISTS (
    SELECT 1 FROM tb_category WHERE name = 'Decks'
);

INSERT INTO tb_category (name)
SELECT 'Acessorios'
WHERE NOT EXISTS (
    SELECT 1 FROM tb_category WHERE name = 'Acessorios'
);

INSERT INTO tb_category (name)
SELECT 'Colecionaveis'
WHERE NOT EXISTS (
    SELECT 1 FROM tb_category WHERE name = 'Colecionaveis'
);

INSERT INTO tb_product (
    name,
    description,
    price,
    img_url,
    stock_quantity,
    weight,
    width,
    height,
    length
)
SELECT
    'Booster Box Pokemon Mega Evolucao',
    'Booster box lacrada para colecionadores e jogadores de Pokemon TCG.',
    399.90,
    'https://res.cloudinary.com/detskmzps/image/upload/v1782307265/jkcards/products/p5ppzfvnwqgalpzdlxar.png',
    8,
    0.80,
    20.0,
    12.0,
    14.0
WHERE NOT EXISTS (
    SELECT 1
    FROM tb_product
    WHERE name = 'Booster Box Pokemon Mega Evolucao'
);

INSERT INTO tb_product (
    name,
    description,
    price,
    img_url,
    stock_quantity,
    weight,
    width,
    height,
    length
)
SELECT
    'Deck Batalha Pokemon TCG',
    'Deck pronto para jogar com cartas selecionadas para partidas casuais.',
    89.90,
    'https://res.cloudinary.com/detskmzps/image/upload/v1782307769/jkcards/products/lcfpacf6rbyeqktzvcko.png',
    12,
    0.40,
    12.0,
    8.0,
    18.0
WHERE NOT EXISTS (
    SELECT 1
    FROM tb_product
    WHERE name = 'Deck Batalha Pokemon TCG'
);

INSERT INTO tb_product (
    name,
    description,
    price,
    img_url,
    stock_quantity,
    weight,
    width,
    height,
    length
)
SELECT
    'Sleeves Premium 100 unidades',
    'Pacote com 100 sleeves para proteger cartas colecionaveis.',
    39.90,
    'https://res.cloudinary.com/detskmzps/image/upload/v1782305847/jkcards/products/gxmq8jwsphvg18uvevxe.jpg',
    25,
    0.20,
    8.0,
    3.0,
    12.0
WHERE NOT EXISTS (
    SELECT 1
    FROM tb_product
    WHERE name = 'Sleeves Premium 100 unidades'
);

INSERT INTO tb_product (
    name,
    description,
    price,
    img_url,
    stock_quantity,
    weight,
    width,
    height,
    length
)
SELECT
    'Carta Avulsa Holografica',
    'Carta avulsa para colecionadores em bom estado de conservacao.',
    49.90,
    'https://res.cloudinary.com/detskmzps/image/upload/v1782307265/jkcards/products/p5ppzfvnwqgalpzdlxar.png',
    10,
    0.10,
    7.0,
    1.0,
    10.0
WHERE NOT EXISTS (
    SELECT 1
    FROM tb_product
    WHERE name = 'Carta Avulsa Holografica'
);

INSERT INTO tb_product_category (product_id, category_id)
SELECT p.id, c.id
FROM tb_product p
JOIN tb_category c ON c.name = 'Boosters'
WHERE p.name = 'Booster Box Pokemon Mega Evolucao'
AND NOT EXISTS (
    SELECT 1
    FROM tb_product_category pc
    WHERE pc.product_id = p.id
    AND pc.category_id = c.id
);

INSERT INTO tb_product_category (product_id, category_id)
SELECT p.id, c.id
FROM tb_product p
JOIN tb_category c ON c.name = 'Decks'
WHERE p.name = 'Deck Batalha Pokemon TCG'
AND NOT EXISTS (
    SELECT 1
    FROM tb_product_category pc
    WHERE pc.product_id = p.id
    AND pc.category_id = c.id
);

INSERT INTO tb_product_category (product_id, category_id)
SELECT p.id, c.id
FROM tb_product p
JOIN tb_category c ON c.name = 'Acessorios'
WHERE p.name = 'Sleeves Premium 100 unidades'
AND NOT EXISTS (
    SELECT 1
    FROM tb_product_category pc
    WHERE pc.product_id = p.id
    AND pc.category_id = c.id
);

INSERT INTO tb_product_category (product_id, category_id)
SELECT p.id, c.id
FROM tb_product p
JOIN tb_category c ON c.name = 'Colecionaveis'
WHERE p.name = 'Carta Avulsa Holografica'
AND NOT EXISTS (
    SELECT 1
    FROM tb_product_category pc
    WHERE pc.product_id = p.id
    AND pc.category_id = c.id
);