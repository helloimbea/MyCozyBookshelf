-- Migration inicial. Crie as proximas como V2__descricao.sql, V3__..., etc.
CREATE TABLE IF NOT EXISTS app_info (
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
