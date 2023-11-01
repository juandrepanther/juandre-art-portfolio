## BUILD THE CHANGES

- `git pull`
- `yarn install` (if new dependencies)
- `yarn build`

- `docker build -t juandre-art-portfolio .`
- `docker run -d --restart=unless-stopped --network proxy --name juandre-art-portfolio juandre-art-portfolio`

# Notes

- Check if proxy network is present. If no, run `docker network create proxy`
