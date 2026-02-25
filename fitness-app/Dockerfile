FROM node:20-alpine AS build
WORKDIR /app

# Függőségek telepítése
COPY package*.json ./
RUN npm install

# Alkalmazás buildelése
COPY . ./
RUN npm run build


FROM nginx:alpine
# Töröljük az alapértelmezett konfigot
RUN rm /etc/nginx/conf.d/default.conf
# Másoljuk be a sajátunkat
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Másoljuk be a buildelt React fájlokat
COPY --from=build /app/dist /usr/share/nginx/html 

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]