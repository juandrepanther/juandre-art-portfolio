### BUILD THE CHANGES (manual)

- `git pull`
- `yarn install` (if new dependencies)
- `yarn build`

- remove docker container and image by using Docker Portainer extension
- `docker build -t juandre-art-portfolio .`
- `docker run -d --restart=unless-stopped --network proxy --name juandre-art-portfolio juandre-art-portfolio`

Check if proxy network is present. If no, run `docker network create proxy`

### DEVELOPMENT LOCAL (manual):

For development the port can be exposed and app can be opened in the browser at localhost:8080

For this matter, in the nginx.conf use `server_name localhost;` instead of production host,
In the command bellow there are no network configurations and added exposed port.
Port 8080 is access port via browser. Port 80 is the containers nginx web server exposed port where nginx transfers the build site files

- `docker run -d --restart=unless-stopped --name juandre-art-portfolio -p 8080:80 juandre-art-portfolio`

At the production do not forget to add `server_name localhost;` at the nginx.conf file.
