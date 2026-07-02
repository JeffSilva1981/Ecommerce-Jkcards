-- JKCards dev seed
-- Use only in local/dev database.

INSERT INTO tb_role (id, authority) VALUES (1, 'ROLE_ADMIN');
INSERT INTO tb_role (id, authority) VALUES (2, 'ROLE_OPERATOR');

INSERT INTO tb_user (id, name, email, phone, birth_date, password) VALUES (1, 'Admin JKCards', 'admin@jkcards.com', '15999990000', '1990-01-01', '$2a$10$xD2JWG2SWVJV9XEF2wpSlennrmExBRuAtAPBv.6SH/bAo8Dc2fsxC');
INSERT INTO tb_user (id, name, email, phone, birth_date, password) VALUES (2, 'Cliente Teste', 'cliente@jkcards.com', '15988880000', '1995-05-20', '$2a$10$/f19j0/p3tnhoBu3ckCGd..o6SEFQ2WiRd.g0R9HxHDS4SOqoo.Ni');
INSERT INTO tb_user (id, name, email, phone, birth_date, password) VALUES (3, 'Maria Compradora', 'maria@jkcards.com', '15977770000', '1998-09-12', '$2a$10$/f19j0/p3tnhoBu3ckCGd..o6SEFQ2WiRd.g0R9HxHDS4SOqoo.Ni');

INSERT INTO tb_user_role (user_id, role_id) VALUES (1, 1);
INSERT INTO tb_user_role (user_id, role_id) VALUES (1, 2);
INSERT INTO tb_user_role (user_id, role_id) VALUES (2, 2);
INSERT INTO tb_user_role (user_id, role_id) VALUES (3, 2);

INSERT INTO tb_category (id, name) VALUES (1, 'Boosters');
INSERT INTO tb_category (id, name) VALUES (2, 'Decks');
INSERT INTO tb_category (id, name) VALUES (3, 'Acessorios');
INSERT INTO tb_category (id, name) VALUES (4, 'Jogos');
INSERT INTO tb_category (id, name) VALUES (5, 'Colecionaveis');

INSERT INTO tb_product (id, name, description, price, img_url, stock_quantity) VALUES (1, 'Booster Box Pokemon Mega Evolucao', 'Booster box lacrada para colecionadores e jogadores de Pokemon TCG.', 399.90, 'https://res.cloudinary.com/detskmzps/image/upload/v1782307265/jkcards/products/p5ppzfvnwqgalpzdlxar.png', 8);
INSERT INTO tb_product (id, name, description, price, img_url, stock_quantity) VALUES (2, 'Deck Batalha Pokemon TCG', 'Deck pronto para jogar com cartas selecionadas para partidas casuais.', 89.90, 'https://res.cloudinary.com/detskmzps/image/upload/v1782307769/jkcards/products/lcfpacf6rbyeqktzvcko.png', 12);
INSERT INTO tb_product (id, name, description, price, img_url, stock_quantity) VALUES (3, 'Sleeves Premium 100 unidades', 'Pacote com 100 sleeves para proteger cartas colecionaveis.', 39.90, 'https://res.cloudinary.com/detskmzps/image/upload/v1782305847/jkcards/products/gxmq8jwsphvg18uvevxe.jpg', 25);
INSERT INTO tb_product (id, name, description, price, img_url, stock_quantity) VALUES (4, 'Deck Box Azul', 'Deck box rigida para armazenar cartas com seguranca.', 34.90, 'https://res.cloudinary.com/detskmzps/image/upload/v1782307265/jkcards/products/p5ppzfvnwqgalpzdlxar.png', 15);
INSERT INTO tb_product (id, name, description, price, img_url, stock_quantity) VALUES (5, 'Playmat Pokemon TCG', 'Playmat para partidas de Pokemon TCG com superficie emborrachada.', 79.90, 'https://res.cloudinary.com/detskmzps/image/upload/v1782307769/jkcards/products/lcfpacf6rbyeqktzvcko.png', 5);
INSERT INTO tb_product (id, name, description, price, img_url, stock_quantity) VALUES (6, 'Jogo do Mico Copag', 'Jogo de cartas classico para familia.', 24.00, 'https://res.cloudinary.com/detskmzps/image/upload/v1782305847/jkcards/products/gxmq8jwsphvg18uvevxe.jpg', 20);
INSERT INTO tb_product (id, name, description, price, img_url, stock_quantity) VALUES (7, 'Carta Avulsa Holografica', 'Carta avulsa para colecionadores em bom estado de conservacao.', 49.90, 'https://res.cloudinary.com/detskmzps/image/upload/v1782307265/jkcards/products/p5ppzfvnwqgalpzdlxar.png', 0);
INSERT INTO tb_product (id, name, description, price, img_url, stock_quantity) VALUES (8, 'Bundle Iniciante Pokemon', 'Kit com booster, sleeves e deck box para novos jogadores.', 149.90, 'https://res.cloudinary.com/detskmzps/image/upload/v1782307769/jkcards/products/lcfpacf6rbyeqktzvcko.png', 3);

INSERT INTO tb_product_category (product_id, category_id) VALUES (1, 1);
INSERT INTO tb_product_category (product_id, category_id) VALUES (1, 5);
INSERT INTO tb_product_category (product_id, category_id) VALUES (2, 2);
INSERT INTO tb_product_category (product_id, category_id) VALUES (3, 3);
INSERT INTO tb_product_category (product_id, category_id) VALUES (4, 3);
INSERT INTO tb_product_category (product_id, category_id) VALUES (5, 3);
INSERT INTO tb_product_category (product_id, category_id) VALUES (6, 4);
INSERT INTO tb_product_category (product_id, category_id) VALUES (7, 5);
INSERT INTO tb_product_category (product_id, category_id) VALUES (8, 1);
INSERT INTO tb_product_category (product_id, category_id) VALUES (8, 3);

INSERT INTO tb_order (id, moment, status, client_id) VALUES (1, '2026-07-01T10:00:00Z', 'WAITING_PAYMENT', 2);
INSERT INTO tb_order (id, moment, status, client_id) VALUES (2, '2026-07-01T11:00:00Z', 'PAID', 2);
INSERT INTO tb_order (id, moment, status, client_id) VALUES (3, '2026-07-01T12:00:00Z', 'SHIPPED', 3);
INSERT INTO tb_order (id, moment, status, client_id) VALUES (4, '2026-07-01T13:00:00Z', 'DELIVERED', 3);
INSERT INTO tb_order (id, moment, status, client_id) VALUES (5, '2026-07-01T14:00:00Z', 'CANCELED', 2);

INSERT INTO tb_order_item (order_id, product_id, quantity, price) VALUES (1, 1, 1, 399.90);
INSERT INTO tb_order_item (order_id, product_id, quantity, price) VALUES (1, 3, 2, 39.90);
INSERT INTO tb_order_item (order_id, product_id, quantity, price) VALUES (2, 2, 1, 89.90);
INSERT INTO tb_order_item (order_id, product_id, quantity, price) VALUES (2, 4, 1, 34.90);
INSERT INTO tb_order_item (order_id, product_id, quantity, price) VALUES (3, 5, 1, 79.90);
INSERT INTO tb_order_item (order_id, product_id, quantity, price) VALUES (3, 6, 2, 24.00);
INSERT INTO tb_order_item (order_id, product_id, quantity, price) VALUES (4, 8, 1, 149.90);
INSERT INTO tb_order_item (order_id, product_id, quantity, price) VALUES (4, 3, 1, 39.90);
INSERT INTO tb_order_item (order_id, product_id, quantity, price) VALUES (5, 7, 1, 49.90);

SELECT setval('tb_role_id_seq', (SELECT MAX(id) FROM tb_role));
SELECT setval('tb_user_id_seq', (SELECT MAX(id) FROM tb_user));
SELECT setval('tb_category_id_seq', (SELECT MAX(id) FROM tb_category));
SELECT setval('tb_product_id_seq', (SELECT MAX(id) FROM tb_product));
SELECT setval('tb_order_id_seq', (SELECT MAX(id) FROM tb_order));