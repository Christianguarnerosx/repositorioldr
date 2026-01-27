FROM php:8.2-fpm

# Dependencias del sistema
RUN apt-get update && apt-get install -y \
    git curl zip unzip libpng-dev libonig-dev libxml2-dev libzip-dev libpq-dev \
    && docker-php-ext-install pdo pdo_mysql mbstring exif pcntl bcmath gd zip

# Composer
RUN curl -sS https://getcomposer.org/installer | php -- \
    --install-dir=/usr/local/bin --filename=composer

WORKDIR /var/www/html

# Copiamos TODO el proyecto
COPY . .

# Fix Git ownership (Docker + volumes)
RUN git config --global --add safe.directory /var/www/html

# 👇 CLAVE: sin scripts
RUN composer install --no-interaction --prefer-dist --no-scripts

CMD ["php-fpm"]
