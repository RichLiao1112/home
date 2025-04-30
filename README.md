## 部署准备

新建本地文件（名字随意取)，如： home.json
新建本地文件夹（名字随意取） 如：/assets

### 启动容器

挂载本地文件 home.json 至 /app/home.json
挂载文件夹 /assets 至 /app/public/custom


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
      - UNSPLASH_ACCESS_KEY=jM_e5xFaPxyIxfx9WmnVbyoV-RK2yqO_c-nDetFHuVs
    ports:
      - 13456:3000 # 3131为你本地机器的端口
```
