# 1. Build Stage (빌드하기)
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
# 의존성 설치
RUN npm install
# 소스 코드 복사 및 빌드
COPY . .
RUN npm run build

# 2. Serve Stage (서빙하기)
FROM nginx:alpine
# 빌드된 결과물(dist 폴더)만 쏙 빼서 Nginx 폴더로 복사
COPY --from=build /app/dist /usr/share/nginx/html
# 위에서 만든 nginx.conf 설정을 복사
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]