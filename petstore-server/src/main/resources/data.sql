-- 初始化种子数据
-- 仅在表为空时插入（使用 INSERT OR IGNORE 避免重复）

-- 管理员
INSERT OR IGNORE INTO users (id, username, password, nickname, role, level) VALUES (1, 'admin', 'admin123', X'E7AEA1E79086E59198', 'admin', 10);
-- 会员
INSERT OR IGNORE INTO users (id, username, password, nickname, role, level) VALUES (2, 'user1', '123456', X'E5B08FE6988E', 'member', 1);
-- 游客
INSERT OR IGNORE INTO users (id, username, password, nickname, role, level) VALUES (3, 'tourist', '123456', X'E6B8B8E5AEA2', 'tourist', 0);

-- 商店
INSERT OR IGNORE INTO shops (id, name, address, longitude, latitude, image) VALUES (1, X'E5BFABE4B990E5AEA0E789A9E5BA97', X'E58C97E4BAACE5B882E69C9DE998B3E58CBAE5BBBAE59BBDE8B7AF3838E58FB7', 116.46, 39.92, '/uploads/images/petshop1.jpg');
INSERT OR IGNORE INTO shops (id, name, address, longitude, latitude, image) VALUES (2, X'E8908CE5AEA0E4B98BE5AEB6', X'E58C97E4BAACE5B882E6B5B7E6B780E58CBAE4B8ADE585B3E69D91E5A4A7E8A19731E58FB7', 116.32, 39.98, '/uploads/images/petshop2.jpg');
INSERT OR IGNORE INTO shops (id, name, address, longitude, latitude, image) VALUES (3, X'E5AEA0E789A9E4B990E59BAD', X'E4B88AE6B5B7E5B882E6B5A6E4B89CE696B0E58CBAE99986E5AEB6E598B4E78EAFE8B7AF313030E58FB7', 121.50, 31.24, '/uploads/images/petshop3.jpg');

-- 商品：宠物（pet）
INSERT OR IGNORE INTO products (id, shop_id, name, type, stock, price, video_id, description) VALUES (1, 1, X'E88BB1E79FADE8939DE78CAB', 'pet', 5, '2800.00', 1, X'E7BAAFE7A78DE88BB1E79FADE8939DE78CABEFBC8C33E4B8AAE69C88E5A4A7EFBC8CE5B7B2E68993E796ABE88B97');
INSERT OR IGNORE INTO products (id, shop_id, name, type, stock, price, video_id, description) VALUES (2, 1, X'E5B883E581B6E78CAB', 'pet', 3, '4500.00', 1, X'E6B5B7E58F8CE5B883E581B6E78CABEFBC8CE680A7E6A0BCE6B8A9E9A1BAEFBC8CE98082E59088E5AEB6E5BAADE9A5B2E585BB');
INSERT OR IGNORE INTO products (id, shop_id, name, type, stock, price, video_id, description) VALUES (3, 1, X'E98791E6AF9BE5B9BCE78AAC', 'pet', 4, '3200.00', 2, X'E7BAAFE7A78DE98791E6AF9BE5B9BCE78AACEFBC8C32E4B8AAE69C88EFBC8CE8A180E7BB9FE7BAAFE6ADA3');
INSERT OR IGNORE INTO products (id, shop_id, name, type, stock, price, video_id, description) VALUES (4, 2, X'E6B3B0E8BFAAE78AAC', 'pet', 6, '1800.00', 2, X'E78EA9E585B7E6B3B0E8BFAAEFBC8CE4B88DE68E89E6AF9BEFBC8CE98082E59088E585ACE5AF93E9A5B2E585BB');
INSERT OR IGNORE INTO products (id, shop_id, name, type, stock, price, description) VALUES (5, 2, X'E69FAFE59FBAE78AAC', 'pet', 2, '5000.00', X'E5BDADE5B883E7BD97E5858BE5A881E5B094E5A3ABE69FAFE59FBAEFBC8C33E4B8AAE69C88E5A4A7');
INSERT OR IGNORE INTO products (id, shop_id, name, type, stock, price, video_id, description) VALUES (6, 3, X'E69AB9E7BD97E78CAB', 'pet', 3, '3500.00', 1, X'E69AB9E7BD97E78CABE5B9BCE5B4BDEFBC8CE8939DE79CBCE79D9BEFBC8CE6B4BBE6B3BCE5A5BDE58AA8');
INSERT OR IGNORE INTO products (id, shop_id, name, type, stock, price, video_id, description) VALUES (7, 3, X'E59388E5A3ABE5A587', 'pet', 2, '2800.00', 2, X'E8A5BFE4BCAFE588A9E4BA9AE99BAAE6A987E78AACEFBC8C32E4B8AAE69C88EFBC8CE4B889E68A8AE781AB');

-- 商品：用品（accessory）
INSERT OR IGNORE INTO products (id, shop_id, name, type, stock, price, description) VALUES (8, 1, X'E79A87E5AEB6E78CABE7B2AE20326B67', 'accessory', 100, '158.00', X'E6B395E59BBDE79A87E5AEB6E78CABE7B2AEEFBC8CE98082E59088E68890E5B9B4E78CAB');
INSERT OR IGNORE INTO products (id, shop_id, name, type, stock, price, description) VALUES (9, 1, X'E699BAE883BDE9A5AEE6B0B4E69CBA', 'accessory', 50, '199.00', X'E5BEAAE78EAFE8BF87E6BBA4EFBC8CE99D99E99FB3E8AEBEE8AEA1');
INSERT OR IGNORE INTO products (id, shop_id, name, type, stock, price, description) VALUES (10, 2, X'E78B97E7B2AE20356B67', 'accessory', 80, '238.00', X'E5A4A9E784B6E7B2AEEFBC8CE6B7BBE58AA0E79B8AE7949FE88F8C');
INSERT OR IGNORE INTO products (id, shop_id, name, type, stock, price, description) VALUES (11, 2, X'E78CABE7A0822031304C', 'accessory', 200, '39.90', X'E8B186E88590E78CABE7A082EFBC8CE7BB93E59BA2E5BFABEFBC8CE58FAFE586B2E58E95E68980');
INSERT OR IGNORE INTO products (id, shop_id, name, type, stock, price, description) VALUES (12, 3, X'E5AEA0E789A9E789B5E5BC95E7BBB3', 'accessory', 150, '49.90', X'E58F8DE58589E8AEBEE8AEA1EFBC8CE5A49CE997B4E5AE89E585A8');
INSERT OR IGNORE INTO products (id, shop_id, name, type, stock, price, description) VALUES (13, 3, X'E78CABE788ACE69EB6', 'accessory', 30, '299.00', X'E5A49AE5B182E78CABE788ACE69EB6EFBC8CE590ABE58991E9BABBE69FB1');

-- 收货地址
INSERT OR IGNORE INTO addresses (id, user_id, receiver_name, phone, province, city, district, detail, is_default) VALUES (1, 2, X'E5B08FE6988E', '13800138000', X'E58C97E4BAACE5B882', X'E58C97E4BAACE5B882', X'E69C9DE998B3E58CBA', X'E5BBBAE59BBDE8B7AF3838E58FB7', 1);
INSERT OR IGNORE INTO addresses (id, user_id, receiver_name, phone, province, city, district, detail, is_default) VALUES (2, 2, X'E5B08FE6988E', '13900139000', X'E4B88AE6B5B7E5B882', X'E4B88AE6B5B7E5B882', X'E6B5A6E4B89CE696B0E58CBA', X'E5BCA0E6B19FE9AB98E7A791E68A80E59BADE58CBA', 0);
-- ===== 更新种子数据（新字段默认值）=====
UPDATE shops SET status='open', rating=4.5, review_count=0, phone='010-88886666', business_hours='09:00-21:00' WHERE id=1 AND phone IS NULL;
UPDATE shops SET status='open', rating=4.2, review_count=0, phone='010-66668888', business_hours='10:00-22:00' WHERE id=2 AND phone IS NULL;
UPDATE shops SET status='open', rating=4.8, review_count=0, phone='021-99995555', business_hours='08:30-21:30' WHERE id=3 AND phone IS NULL;
-- 补充子分类
UPDATE products SET subcategory='cat_food' WHERE id=8 AND subcategory IS NULL;
UPDATE products SET subcategory='pet_supplies' WHERE id=9 AND subcategory IS NULL;
UPDATE products SET subcategory='dog_food' WHERE id=10 AND subcategory IS NULL;
UPDATE products SET subcategory='cat_litter' WHERE id=11 AND subcategory IS NULL;
UPDATE products SET subcategory='dog_supplies' WHERE id=12 AND subcategory IS NULL;
UPDATE products SET subcategory='cat_supplies' WHERE id=13 AND subcategory IS NULL;

