docker build -t solarcalc-frontend .

docker run -p 3000:3000 solarcalc-frontend

## Deploying backend-api to Render

1. **Push your code to GitHub (or GitLab).**

2. **On Render:**
   - Create a new Web Service.
   - Connect your repository.
   - Set the root directory to `backend-api` if prompted.
   - Select "Docker" as the environment.
   - Render will automatically detect and use the `Dockerfile` in `backend-api/`.
   - No custom build or start command is needed (Render uses the Dockerfile's `CMD`).
   - The service will be available on port 8000 by default.

3. **Test your deployment:**
   - Visit `https://<your-service-name>.onrender.com/docs` for the interactive API docs.
   - The root endpoint `/` will return a welcome message.

**Note:**
- You do NOT need to run any local build scripts for Render deployment.
- For local Docker testing, use `backend-deploy.sh` from the project root.


## Deploying front-end to Render

