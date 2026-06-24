const mockVideos = [
  {
    id: 1,
    title: '狗狗洗澡全流程教程',
    url: '',
    cover: '',
    duration: '03:25',
    durationSeconds: 205,
    viewCount: 12560,
    author: '宠物达人',
    category: 'dogs',
    description: '教你如何在家给狗狗洗澡，包括准备工作、洗澡步骤、吹干技巧等。',
    tags: ['宠物护理', '洗澡教程', '狗狗'],
    createTime: '2024-01-15',
    relatedProduct: { id: 101, name: '宠物沐浴露', price: 39 },
  },
  {
    id: 2,
    title: '猫咪逗猫棒互动教程',
    url: '',
    cover: '',
    duration: '05:12',
    durationSeconds: 312,
    viewCount: 8560,
    author: '猫奴日记',
    category: 'cats',
    description: '如何正确使用逗猫棒与猫咪互动，让猫咪爱上运动。',
    tags: ['猫咪', '逗猫棒', '互动'],
    createTime: '2024-01-14',
    relatedProduct: { id: 102, name: '逗猫棒', price: 19 },
  },
  {
    id: 3,
    title: '狗狗训练：坐下、握手、趴下',
    url: '',
    cover: '',
    duration: '02:48',
    durationSeconds: 168,
    viewCount: 23000,
    author: '训练师老王',
    category: 'training',
    description: '基础狗狗训练教程，让你的狗狗学会基本指令。',
    tags: ['狗狗训练', '服从训练', '新手'],
    createTime: '2024-01-13',
  },
  {
    id: 4,
    title: '萌宠搞笑瞬间合集',
    url: '',
    cover: '',
    duration: '08:33',
    durationSeconds: 513,
    viewCount: 56000,
    author: '搞笑宠物',
    category: 'funny',
    description: '超搞笑的萌宠瞬间，让你笑到停不下来！',
    tags: ['搞笑', '萌宠', '合集'],
    createTime: '2024-01-12',
  },
]

export function getVideoList(category) {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (category && category !== 'all') {
        resolve(mockVideos.filter((v) => v.category === category))
      } else {
        resolve([...mockVideos])
      }
    }, 200)
  })
}

export function formatCount(count) {
  if (!count) return '0'
  if (count >= 10000) return (count / 10000).toFixed(1) + '万'
  return count.toString()
}
