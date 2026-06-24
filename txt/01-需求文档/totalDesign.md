

# 宠物商店（PetStore）代码设计文档

## 一、项目结构

### 1.1 后端项目结构（SpringBoot）

```
petstore-server/
├── src/main/java/com/petstore/
│   ├── PetstoreApplication.java          // 启动类
│   ├── common/
│   │   ├── Result.java                   // 统一响应体
│   │   └── GlobalExceptionHandler.java   // 全局异常处理
│   ├── config/
│   │   └── WebMvcConfig.java             // 跨域、静态资源配置
│   ├── entity/
│   │   ├── User.java
│   │   ├── Shop.java
│   │   ├── Product.java
│   │   ├── Order.java
│   │   ├── OrderItem.java
│   │   ├── Video.java
│   │   ├── Address.java
│   │   └── CartItem.java
│   ├── dto/
│   │   ├── LoginDTO.java
│   │   ├── RegisterDTO.java
│   │   ├── OrderCreateDTO.java
│   │   └── ...
│   ├── repository/
│   │   ├── UserRepository.java
│   │   ├── ShopRepository.java
│   │   ├── ProductRepository.java
│   │   ├── OrderRepository.java
│   │   ├── VideoRepository.java
│   │   └── AddressRepository.java
│   ├── service/
│   │   ├── UserService.java
│   │   ├── ShopService.java
│   │   ├── ProductService.java
│   │   ├── OrderService.java
│   │   ├── VideoService.java
│   │   ├── AIService.java
│   │   └── FileService.java
│   └── controller/
│       ├── UserController.java
│       ├── ShopController.java
│       ├── ProductController.java
│       ├── OrderController.java
│       ├── VideoController.java
│       ├── AIController.java
│       └── FileController.java
├── src/main/resources/
│   ├── application.yml
│   └── static/uploads/                   // 上传文件存储目录
└── pom.xml
```

### 1.2 前端项目结构（Vue 3 + Element Plus）

```
petstore-web/
├── public/
├── src/
│   ├── main.js
│   ├── App.vue
│   ├── router/
│   │   └── index.js
│   ├── api/
│   │   ├── user.js
│   │   ├── shop.js
│   │   ├── product.js
│   │   ├── order.js
│   │   ├── video.js
│   │   ├── ai.js
│   │   └── upload.js
│   ├── views/
│   │   ├── Login.vue
│   │   ├── Register.vue
│   │   ├── Home.vue
│   │   ├── ShopList.vue
│   │   ├── ShopDetail.vue
│   │   ├── ProductDetail.vue
│   │   ├── Cart.vue
│   │   ├── OrderList.vue
│   │   ├── OrderDetail.vue
│   │   ├── PersonalCenter.vue
│   │   ├── VideoList.vue
│   │   ├── AIChat.vue
│   │   └── admin/
│   │       ├── AdminLayout.vue
│   │       ├── ShopManage.vue
│   │       ├── ProductManage.vue
│   │       ├── VideoManage.vue
│   │       ├── UserManage.vue
│   │       └── OrderManage.vue
│   ├── components/
│   │   ├── MapView.vue
│   │   ├── ProductCard.vue
│   │   └── ...
│   └── store/
│       └── user.js                       // Pinia 用户状态
├── package.json
└── vite.config.js
```

---

## 二、数据库SQL脚本
-- SQLite 开启外键约束（必须放在最开头）
PRAGMA foreign_keys = ON;

-- 用户表
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    nickname TEXT,
    avatar TEXT,
    role TEXT DEFAULT 'member', -- 原ENUM，业务代码限制仅 tourist/member/admin
    level INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 商店表
CREATE TABLE shops (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    longitude REAL NOT NULL,
    latitude REAL NOT NULL,
    image TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 商品表
CREATE TABLE products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    shop_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    type TEXT NOT NULL, -- 原ENUM，限制 pet/accessory
    stock INTEGER NOT NULL DEFAULT 0,
    price TEXT NOT NULL, -- 用TEXT存金额防止浮点误差，如 "99.90"
    image TEXT,
    video_id INTEGER,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (shop_id) REFERENCES shops(id) ON DELETE CASCADE
);

-- 视频表
CREATE TABLE videos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    product_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 收货地址表
CREATE TABLE addresses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    receiver_name TEXT,
    phone TEXT,
    province TEXT,
    city TEXT,
    district TEXT,
    detail TEXT,
    is_default INTEGER DEFAULT 0, -- 替换TINYINT
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 订单表
CREATE TABLE orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    address_snapshot TEXT,
    total_amount TEXT, -- TEXT存金额
    status INTEGER DEFAULT 0,
    cancel_reason TEXT,
    refund_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 无ON UPDATE，代码更新时手动赋值
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 订单明细表
CREATE TABLE order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    product_name TEXT,
    product_image TEXT,
    price TEXT,
    quantity INTEGER,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- 购物车表
CREATE TABLE cart_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER DEFAULT 1,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- 评价表
CREATE TABLE reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    content TEXT,
    rating INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

---

## 三、后端代码设计

### 3.1 实体类示例

```java
// User.java
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String username;
    private String password; // 明文
    private String nickname;
    private String avatar;
    @Enumerated(EnumType.STRING)
    private Role role; // tourist, member, admin
    private Integer level;
    // getters/setters...
}

// Shop.java
@Entity
@Table(name = "shops")
public class Shop {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String address;
    private Double longitude;
    private Double latitude;
    private String image;
    // getters/setters...
}

// Product.java
@Entity
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long shopId;
    private String name;
    @Enumerated(EnumType.STRING)
    private ProductType type; // pet, accessory
    private Integer stock;
    private BigDecimal price;
    private String image;
    private Long videoId;
    private String description;
    // getters/setters...
}

// Order.java
@Entity
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long userId;
    private String addressSnapshot; // JSON格式存储收货地址快照
    private BigDecimal totalAmount;
    private Integer status;
    private String cancelReason;
    private String refundReason;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    // getters/setters...
}
```

### 3.2 Repository层（JPA）

```java
public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername(String username);
}

public interface ShopRepository extends JpaRepository<Shop, Long> {
    // 附近搜索：按经纬度距离排序（可使用MySQL空间函数或MongoDB）
    @Query(value = "SELECT *, (6371 * acos(cos(radians(?1)) * cos(radians(latitude)) * cos(radians(longitude) - radians(?2)) + sin(radians(?1)) * sin(radians(latitude)))) AS distance FROM shops ORDER BY distance", nativeQuery = true)
    List<Shop> findNearbyShops(Double userLat, Double userLng);
}

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByShopId(Long shopId);
    List<Product> findByType(ProductType type);
}

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserId(Long userId);
}
```

### 3.3 控制器示例（用户、商店、商品管理）

```java
@RestController
@RequestMapping("/api/user")
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public Result register(@RequestBody RegisterDTO dto) {
        // 校验字段
        User user = userService.register(dto);
        return Result.success(user);
    }

    @PostMapping("/login")
    public Result login(@RequestBody LoginDTO dto) {
        User user = userService.login(dto.getUsername(), dto.getPassword());
        if (user != null) {
            return Result.success(user); // 返回角色等信息
        }
        return Result.error("用户名或密码错误");
    }

    @GetMapping("/profile/{id}")
    public Result profile(@PathVariable Long id) {
        return Result.success(userService.getById(id));
    }

    @PutMapping("/profile")
    public Result updateProfile(@RequestBody User user) {
        userService.update(user);
        return Result.success();
    }
}

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    // 商店管理
    @PostMapping("/shops")
    public Result addShop(@RequestParam("name") String name,
                          @RequestParam("address") String address,
                          @RequestParam("longitude") Double lng,
                          @RequestParam("latitude") Double lat,
                          @RequestParam(value = "image", required = false) MultipartFile image) {
        String imageUrl = fileService.uploadImage(image);
        Shop shop = shopService.addShop(name, address, lng, lat, imageUrl);
        return Result.success(shop);
    }

    @PutMapping("/shops/{id}")
    public Result updateShop(@PathVariable Long id,
                             @RequestParam("name") String name,
                             @RequestParam("address") String address,
                             @RequestParam("longitude") Double lng,
                             @RequestParam("latitude") Double lat,
                             @RequestParam(value = "image", required = false) MultipartFile image) {
        String imageUrl = null;
        if (image != null && !image.isEmpty()) {
            imageUrl = fileService.uploadImage(image);
        }
        Shop shop = shopService.updateShop(id, name, address, lng, lat, imageUrl);
        return Result.success(shop);
    }

    @DeleteMapping("/shops/{id}")
    public Result deleteShop(@PathVariable Long id) {
        shopService.delete(id);
        return Result.success();
    }

    // 商品管理（类似）
    @PostMapping("/products")
    public Result addProduct(@RequestParam("shopId") Long shopId,
                             @RequestParam("name") String name,
                             @RequestParam("type") String type,
                             @RequestParam("stock") Integer stock,
                             @RequestParam("price") BigDecimal price,
                             @RequestParam(value = "image", required = false) MultipartFile image,
                             @RequestParam(value = "videoId", required = false) Long videoId,
                             @RequestParam(value = "description", required = false) String desc) {
        String imageUrl = fileService.uploadImage(image);
        Product product = productService.addProduct(shopId, name, type, stock, price, imageUrl, videoId, desc);
        return Result.success(product);
    }
    // 其他管理接口...
}
```

### 3.4 订单服务核心逻辑（状态流转）

```java
@Service
public class OrderService {
    @Autowired
    private OrderRepository orderRepository;

    // 创建订单（从购物车）
    public Order createOrder(Long userId, Long addressId, List<CartItem> cartItems) {
        // 检查库存（宠物唯一性）
        // 生成订单快照，计算总金额
        // 创建订单 status=0，清空购物车
    }

    // 支付
    public void payOrder(Long orderId) {
        Order order = orderRepository.findById(orderId).orElseThrow();
        if (order.getStatus() != 0) throw new RuntimeException("订单状态错误");
        order.setStatus(1);
        orderRepository.save(order);
    }

    // 取消订单（用户取消或超时）
    public void cancelOrder(Long orderId, String reason, boolean isAuto) {
        Order order = orderRepository.findById(orderId).orElseThrow();
        if (order.getStatus() != 0 && order.getStatus() != 1) throw new RuntimeException("不可取消");
        order.setStatus(-1);
        order.setCancelReason(isAuto ? "超时自动取消" : "用户取消：" + reason);
        // 恢复库存
        orderRepository.save(order);
    }

    // 申请退单
    public void applyRefund(Long orderId, String reason) {
        Order order = orderRepository.findById(orderId).orElseThrow();
        if (order.getStatus() != 2 && order.getStatus() != 3) throw new RuntimeException("不可申请退单");
        order.setStatus(-2);
        order.setRefundReason(reason);
        orderRepository.save(order);
    }

    // 管理员审核退单
    public void approveRefund(Long orderId, boolean approved) {
        Order order = orderRepository.findById(orderId).orElseThrow();
        if (order.getStatus() != -2) throw new RuntimeException("状态错误");
        if (approved) {
            order.setStatus(-3);
        } else {
            // 恢复为原状态（需要记录原状态，可在退单时保存 previousStatus 字段）
            order.setStatus(order.getPreviousStatus());
            order.setRefundReason(null);
        }
        orderRepository.save(order);
    }

    // 管理员直接退单
    public void directRefund(Long orderId, String reason) {
        Order order = orderRepository.findById(orderId).orElseThrow();
        if (order.getStatus() != 3) throw new RuntimeException("仅已收货可退");
        order.setStatus(-4);
        order.setRefundReason(reason);
        orderRepository.save(order);
    }

    // 确认收货
    public void confirmReceipt(Long orderId) {
        Order order = orderRepository.findById(orderId).orElseThrow();
        if (order.getStatus() != 2) throw new RuntimeException("状态错误");
        order.setStatus(3);
        orderRepository.save(order);
    }

    // 评价
    public void review(Long orderId, Long userId, String content, Integer rating) {
        Order order = orderRepository.findById(orderId).orElseThrow();
        if (order.getStatus() != 3) throw new RuntimeException("状态错误");
        // 保存评价
        order.setStatus(4);
        orderRepository.save(order);
    }
}
```

### 3.5 文件上传服务

```java
@Service
public class FileService {
    @Value("${file.upload-dir}")
    private String uploadDir;

    public String uploadImage(MultipartFile file) {
        if (file == null || file.isEmpty()) return null;
        String originalFilename = file.getOriginalFilename();
        String ext = originalFilename.substring(originalFilename.lastIndexOf("."));
        String newFileName = UUID.randomUUID().toString() + ext;
        File dest = new File(uploadDir + "/images/" + newFileName);
        dest.getParentFile().mkdirs();
        file.transferTo(dest);
        return "/uploads/images/" + newFileName; // 返回访问URL
    }

    public String uploadVideo(MultipartFile file) {
        // 类似处理，限制大小
    }
}
```

### 3.6 AI问答服务（调用大模型）

```java
@Service
public class AIService {
    @Value("${ai.api-key}")
    private String apiKey;
    @Value("${ai.endpoint}")
    private String endpoint;

    public String chat(String question) {
        // 构建请求体，调用通义千问等API
        // 使用 RestTemplate 发送POST请求
        // 返回模型回答
        // 可添加上下文提示：你是宠物商店助手...
    }
}
```

---

## 四、前端代码设计

### 4.1 路由配置

```javascript
// router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/store/user'

const routes = [
  { path: '/', component: () => import('@/views/Home.vue') },
  { path: '/login', component: () => import('@/views/Login.vue') },
  { path: '/register', component: () => import('@/views/Register.vue') },
  { path: '/shops', component: () => import('@/views/ShopList.vue') },
  { path: '/shop/:id', component: () => import('@/views/ShopDetail.vue') },
  { path: '/product/:id', component: () => import('@/views/ProductDetail.vue') },
  { path: '/cart', component: () => import('@/views/Cart.vue'), meta: { requiresAuth: true } },
  { path: '/orders', component: () => import('@/views/OrderList.vue'), meta: { requiresAuth: true } },
  { path: '/order/:id', component: () => import('@/views/OrderDetail.vue'), meta: { requiresAuth: true } },
  { path: '/profile', component: () => import('@/views/PersonalCenter.vue'), meta: { requiresAuth: true } },
  { path: '/videos', component: () => import('@/views/VideoList.vue') },
  { path: '/ai', component: () => import('@/views/AIChat.vue') },
  { 
    path: '/admin', 
    component: () => import('@/views/admin/AdminLayout.vue'),
    meta: { requiresAdmin: true },
    children: [
      { path: 'shops', component: () => import('@/views/admin/ShopManage.vue') },
      { path: 'products', component: () => import('@/views/admin/ProductManage.vue') },
      { path: 'videos', component: () => import('@/views/admin/VideoManage.vue') },
      { path: 'users', component: () => import('@/views/admin/UserManage.vue') },
      { path: 'orders', component: () => import('@/views/admin/OrderManage.vue') },
    ]
  }
]

const router = createRouter({ history: createWebHistory(), routes })

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    next('/login')
  } else if (to.meta.requiresAdmin && userStore.user?.role !== 'admin') {
    next('/')
  } else {
    next()
  }
})
```

### 4.2 API封装示例

```javascript
// api/shop.js
import axios from 'axios'
const BASE = '/api'

export function getNearbyShops(lat, lng) {
  return axios.get(`${BASE}/shops`, { params: { lat, lng } })
}
export function getShopDetail(id) {
  return axios.get(`${BASE}/shops/${id}`)
}
export function addShop(formData) {
  return axios.post(`${BASE}/admin/shops`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
}
export function updateShop(id, formData) {
  return axios.put(`${BASE}/admin/shops/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
}
export function deleteShop(id) {
  return axios.delete(`${BASE}/admin/shops/${id}`)
}
```

### 4.3 管理员动态添加商店/商品前端实现

**商店管理页面核心代码：**

```vue
<!-- views/admin/ShopManage.vue -->
<template>
  <div>
    <el-button @click="showAddDialog">添加商店</el-button>
    <el-table :data="shops">
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column label="图片">
        <template #default="scope">
          <img :src="scope.row.image" width="80" />
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button @click="editShop(scope.row)">编辑</el-button>
          <el-button @click="deleteShop(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑商店' : '添加商店'">
      <el-form ref="formRef" :model="form">
        <el-form-item label="名称" prop="name" :rules="[{ required: true }]">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="form.address" />
        </el-form-item>
        <el-form-item label="经度" prop="longitude">
          <el-input-number v-model="form.longitude" />
        </el-form-item>
        <el-form-item label="纬度" prop="latitude">
          <el-input-number v-model="form.latitude" />
        </el-form-item>
        <el-form-item label="商店图片">
          <el-upload
            :action="uploadUrl"
            :on-success="handleImageSuccess"
            :before-upload="beforeUpload"
            list-type="picture"
            :limit="1">
            <el-button>上传图片</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getNearbyShops, addShop, updateShop, deleteShop } from '@/api/shop'
import { ElMessage } from 'element-plus'

const shops = ref([])
const dialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref(null)
const uploadUrl = '/api/upload/image'
const form = ref({ name: '', address: '', longitude: 0, latitude: 0, image: '' })
let editId = null

const loadShops = async () => {
  // 获取所有商店（可传入默认经纬度）
  const res = await getNearbyShops(0, 0) // 简单获取全部
  shops.value = res.data
}

const showAddDialog = () => {
  isEdit.value = false
  form.value = { name: '', address: '', longitude: 0, latitude: 0, image: '' }
  dialogVisible.value = true
}

const editShop = (row) => {
  isEdit.value = true
  editId = row.id
  form.value = { ...row }
  dialogVisible.value = true
}

const handleImageSuccess = (response) => {
  form.value.image = response.data // 假设返回 { data: "url" }
}

const beforeUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  if (!isImage) ElMessage.error('只能上传图片')
  return isImage
}

const submitForm = async () => {
  await formRef.value.validate()
  const fd = new FormData()
  fd.append('name', form.value.name)
  fd.append('address', form.value.address)
  fd.append('longitude', form.value.longitude)
  fd.append('latitude', form.value.latitude)
  // 图片已通过单独上传得到URL，也可在此一起上传
  fd.append('imageUrl', form.value.image) // 后端需兼容接收URL
  if (isEdit.value) {
    await updateShop(editId, fd)
  } else {
    await addShop(fd)
  }
  ElMessage.success('操作成功')
  dialogVisible.value = false
  loadShops()
}

onMounted(loadShops)
</script>
```

### 4.4 地图组件示例（MapView.vue）

```vue
<template>
  <div id="map-container" style="height: 400px;"></div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { getNearbyShops } from '@/api/shop'

const props = defineProps({ center: Array }) // [lat, lng]
const map = ref(null)

onMounted(() => {
  // 初始化高德地图
  map.value = new AMap.Map('map-container', {
    center: props.center || [116.397428, 39.90923],
    zoom: 13
  })
  loadShops()
})

const loadShops = async () => {
  const res = await getNearbyShops(props.center[0], props.center[1])
  res.data.forEach(shop => {
    const marker = new AMap.Marker({
      position: [shop.longitude, shop.latitude],
      title: shop.name,
      icon: new AMap.Icon({ image: shop.image, size: new AMap.Size(36,36) })
    })
    marker.setMap(map.value)
    marker.on('click', () => {
      // 导航至商店详情
    })
  })
}
</script>
```

### 4.5 AI问答组件

```vue
<template>
  <div class="chat-container">
    <div class="messages">
      <div v-for="(msg, i) in messages" :key="i" :class="msg.role">
        {{ msg.content }}
      </div>
    </div>
    <el-input v-model="input" @keyup.enter="send" placeholder="输入问题..." />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { chat } from '@/api/ai'

const messages = ref([])
const input = ref('')

const send = async () => {
  if (!input.value.trim()) return
  messages.value.push({ role: 'user', content: input.value })
  const res = await chat(input.value)
  messages.value.push({ role: 'assistant', content: res.data })
  input.value = ''
}
</script>
```

---

## 五、订单状态流转前端展示

在订单详情页根据 `status` 显示不同操作按钮：

```javascript
// 订单状态映射
const statusMap = {
  0: '待支付',
  1: '待发货',
  2: '待收货',
  3: '待评价',
  4: '已完成',
  '-1': '已取消',
  '-2': '退单申请中',
  '-3': '退单成功',
  '-4': '管理员退单'
}

// 可用操作
function getActions(order) {
  const actions = []
  if (order.status === 0 || order.status === 1) {
    actions.push({ label: '取消订单', action: () => cancelOrder(order.id) })
  }
  if (order.status === 0) {
    actions.push({ label: '去支付', action: () => payOrder(order.id) })
  }
  if (order.status === 2) {
    actions.push({ label: '确认收货', action: () => confirmReceipt(order.id) })
    actions.push({ label: '申请退单', action: () => applyRefund(order.id) })
  }
  if (order.status === 3) {
    actions.push({ label: '去评价', action: () => review(order.id) })
    actions.push({ label: '申请退单', action: () => applyRefund(order.id) })
  }
  return actions
}
```

管理员端可看到所有订单，并提供审核退单、直接退单按钮。

---

## 六、总结

本代码设计文档覆盖了：
- 项目前后端完整目录结构
- 数据库建表语句
- 后端实体、Repository、Service、Controller 关键代码
- 前端路由、API封装、管理页面表单、地图组件、AI问答
- 订单状态流转核心逻辑
- 文件上传处理
