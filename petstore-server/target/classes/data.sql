-- 初始化种子数据
-- 仅在表为空时插入（使用 INSERT OR IGNORE 避免重复）

-- 管理员
INSERT OR IGNORE INTO users (id, username, password, nickname, role, level) VALUES (1, 'admin', 'admin123', '管理员', 'admin', 10);
-- 会员
INSERT OR IGNORE INTO users (id, username, password, nickname, role, level) VALUES (2, 'user1', '123456', '小明', 'member', 1);
-- 游客
INSERT OR IGNORE INTO users (id, username, password, nickname, role, level) VALUES (3, 'tourist', '123456', '游客', 'tourist', 0);

-- 视频
INSERT OR IGNORE INTO videos (id, title, url) VALUES (1, '可爱的小猫咪', 'https://www.w3schools.com/html/mov_bbb.mp4');
INSERT OR IGNORE INTO videos (id, title, url) VALUES (2, '金毛犬日常', 'https://www.w3schools.com/html/mov_bbb.mp4');
INSERT OR IGNORE INTO videos (id, title, url) VALUES (3, '宠物用品介绍', 'https://www.w3schools.com/html/mov_bbb.mp4');

-- 商店
INSERT OR IGNORE INTO shops (id, name, address, longitude, latitude, image) VALUES (1, '快乐宠物店', '北京市朝阳区建国路88号', 116.46, 39.92, '/uploads/images/petshop1.jpg');
INSERT OR IGNORE INTO shops (id, name, address, longitude, latitude, image) VALUES (2, '萌宠之家', '北京市海淀区中关村大街1号', 116.32, 39.98, '/uploads/images/petshop2.jpg');
INSERT OR IGNORE INTO shops (id, name, address, longitude, latitude, image) VALUES (3, '宠物乐园', '上海市浦东新区陆家嘴环路100号', 121.50, 31.24, '/uploads/images/petshop3.jpg');

-- 商品：宠物（pet）
INSERT OR IGNORE INTO products (id, shop_id, name, type, stock, price, video_id, description) VALUES (1, 1, '英短蓝猫', 'pet', 5, '2800.00', 1, '纯种英短蓝猫，3个月大，已打疫苗');
INSERT OR IGNORE INTO products (id, shop_id, name, type, stock, price, video_id, description) VALUES (2, 1, '布偶猫', 'pet', 3, '4500.00', 1, '海双布偶猫，性格温顺，适合家庭饲养');
INSERT OR IGNORE INTO products (id, shop_id, name, type, stock, price, video_id, description) VALUES (3, 1, '金毛幼犬', 'pet', 4, '3200.00', 2, '纯种金毛幼犬，2个月，血统纯正');
INSERT OR IGNORE INTO products (id, shop_id, name, type, stock, price, video_id, description) VALUES (4, 2, '泰迪犬', 'pet', 6, '1800.00', 2, '玩具泰迪，不掉毛，适合公寓饲养');
INSERT OR IGNORE INTO products (id, shop_id, name, type, stock, price, description) VALUES (5, 2, '柯基犬', 'pet', 2, '5000.00', '彭布罗克威尔士柯基，3个月大');
INSERT OR IGNORE INTO products (id, shop_id, name, type, stock, price, video_id, description) VALUES (6, 3, '暹罗猫', 'pet', 3, '3500.00', 1, '暹罗猫幼崽，蓝眼睛，活泼好动');
INSERT OR IGNORE INTO products (id, shop_id, name, type, stock, price, video_id, description) VALUES (7, 3, '哈士奇', 'pet', 2, '2800.00', 2, '西伯利亚雪橇犬，2个月，三把火');

-- 商品：用品（accessory）
INSERT OR IGNORE INTO products (id, shop_id, name, type, stock, price, description) VALUES (8, 1, '皇家猫粮 2kg', 'accessory', 100, '158.00', '法国皇家猫粮，适合成年猫');
INSERT OR IGNORE INTO products (id, shop_id, name, type, stock, price, description) VALUES (9, 1, '智能饮水机', 'accessory', 50, '199.00', '循环过滤，静音设计');
INSERT OR IGNORE INTO products (id, shop_id, name, type, stock, price, description) VALUES (10, 2, '狗粮 5kg', 'accessory', 80, '238.00', '天然粮，添加益生菌');
INSERT OR IGNORE INTO products (id, shop_id, name, type, stock, price, description) VALUES (11, 2, '猫砂 10L', 'accessory', 200, '39.90', '豆腐猫砂，结团快，可冲厕所');
INSERT OR IGNORE INTO products (id, shop_id, name, type, stock, price, description) VALUES (12, 3, '宠物牵引绳', 'accessory', 150, '49.90', '反光设计，夜间安全');
INSERT OR IGNORE INTO products (id, shop_id, name, type, stock, price, description) VALUES (13, 3, '猫爬架', 'accessory', 30, '299.00', '多层猫爬架，含剑麻柱');

-- 收货地址
INSERT OR IGNORE INTO addresses (id, user_id, receiver_name, phone, province, city, district, detail, is_default) VALUES (1, 2, '小明', '13800138000', '北京市', '北京市', '朝阳区', '建国路88号', 1);
INSERT OR IGNORE INTO addresses (id, user_id, receiver_name, phone, province, city, district, detail, is_default) VALUES (2, 2, '小明', '13900139000', '上海市', '上海市', '浦东新区', '张江高科技园区', 0);