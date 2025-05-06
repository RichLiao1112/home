### docker-compose
```yaml
services:
  home:
    image: 2458006757/home:latest
    volumes:
      - ./dh.json:/app/home.json # home.json 为你本地存储的配置文件
      - ./assets:/app/public/custom # 用于存放图片等资源，
    restart: always
    environment:
      - UNSPLASH_ACCESS_KEY= $
    ports:
      - 13456:3000 # 3131为你本地机器的端口
```
