### docker-compose
```yaml
services:
  home:
    image: 2458006757/home:latest
    volumes:
      - ./home.json:/app/home.json
    ports:
      - 3131:80
    environment:
      - UNSPLASH_ACCESS_KEY=jM_e5xFaPxyIxfx9WmnVbyoV-RK2yqO_c-nDetFHuVs
    restart: always
```
