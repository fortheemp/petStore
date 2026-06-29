package com.petstore.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.Statement;

/**
 * 启动时自动执行 ALTER TABLE 增量迁移（SQLite 兼容）
 * 每个迁移语句用 try-catch 包裹，已存在的列不会报错中断
 */
@Component
public class SchemaMigration implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(SchemaMigration.class);

    @Autowired
    private DataSource dataSource;

    private static final String[] MIGRATIONS = {
            // Review 表 — 支持多商品评价
            "ALTER TABLE reviews ADD COLUMN product_id INTEGER",
            // Product 表 — 评分字段
            "ALTER TABLE products ADD COLUMN avg_rating REAL DEFAULT 0",
            "ALTER TABLE products ADD COLUMN review_count INTEGER DEFAULT 0",
            "ALTER TABLE products ADD COLUMN subcategory VARCHAR(50)",
            // Shop 表 — 新字段
            "ALTER TABLE shops ADD COLUMN status VARCHAR(10) DEFAULT 'open'",
            "ALTER TABLE shops ADD COLUMN rating REAL DEFAULT 0",
            "ALTER TABLE shops ADD COLUMN review_count INTEGER DEFAULT 0",
            "ALTER TABLE shops ADD COLUMN phone VARCHAR(20)",
            "ALTER TABLE shops ADD COLUMN business_hours VARCHAR(50)",
            // User 表 — gender、email 和 phone 字段
            "ALTER TABLE users ADD COLUMN gender VARCHAR(10) DEFAULT 'secret'",
            "ALTER TABLE users ADD COLUMN email VARCHAR(100)",
            "ALTER TABLE users ADD COLUMN phone VARCHAR(20)",
            // Video 表 — 富信息字段
            "ALTER TABLE videos ADD COLUMN duration VARCHAR(10)",
            "ALTER TABLE videos ADD COLUMN duration_seconds INTEGER",
            "ALTER TABLE videos ADD COLUMN view_count INTEGER DEFAULT 0",
            "ALTER TABLE videos ADD COLUMN author VARCHAR(50)",
            "ALTER TABLE videos ADD COLUMN description TEXT",
            "ALTER TABLE videos ADD COLUMN category VARCHAR(20)",
            "ALTER TABLE videos ADD COLUMN cover VARCHAR(500)",
    };

    @Override
    public void run(ApplicationArguments args) throws Exception {
        try (Connection conn = dataSource.getConnection();
             Statement stmt = conn.createStatement()) {
            for (String sql : MIGRATIONS) {
                try {
                    stmt.execute(sql);
                    log.info("Migration executed: {}", sql);
                } catch (Exception e) {
                    // SQLite: 列已存在时报错 "duplicate column name"，忽略即可
                    log.debug("Migration skipped (already applied): {} — {}", sql, e.getMessage());
                }
            }
        }
    }
}