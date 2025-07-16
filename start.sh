#!/bin/sh
# 启动 nextjs
node_modules/.bin/next start &
# 启动 nginx
nginx -g 'daemon off;' 