# MedusaJS Production Deployment Guide

This guide covers building and deploying a production-ready MedusaJS application using Docker.

## 🏗️ Production Dockerfile Features

The optimized Dockerfile includes:

- **Multi-stage build** for smaller production images
- **Security hardening** with non-root user
- **Health checks** for container monitoring
- **Signal handling** with dumb-init
- **Production dependencies only** in final image
- **Optimized caching** for faster builds

## 🚀 Quick Start

### 1. Build and Test Locally

```bash
# Test the production image locally
./test-production.sh
```

This will:
- Build the production Docker image
- Start test databases (PostgreSQL + Redis)
- Run the application in a test container
- Verify all endpoints are working

### 2. Deploy to Production

```bash
# Deploy the production image
./deploy-production.sh
```

This will:
- Build the production Docker image
- Stop any existing containers
- Start the production container
- Show deployment status and logs

### 3. Using Docker Compose (Recommended for Local Development)

```bash
# Start all services with docker-compose
docker-compose up --build -d

# View logs
docker-compose logs -f medusa

# Stop services
docker-compose down
```

## 📋 Environment Configuration

### Production Environment Variables

Create a `env.yaml` file with your production settings:

```yaml
# Database
DATABASE_URL: "postgresql://user:password@host:port/database"

# Redis
REDIS_URL: "redis://host:port"

# CORS Configuration
STORE_CORS: "https://your-storefront.com"
ADMIN_CORS: "https://your-admin.com"
AUTH_CORS: "https://your-storefront.com,https://your-admin.com"

# Security
JWT_SECRET: "your-jwt-secret"
COOKIE_SECRET: "your-cookie-secret"

# Server Configuration
NODE_ENV: "production"
PORT: "9000"
MEDUSA_WORKER_MODE: "server"
```

### Local Testing Environment

For local testing, use `env.local.yaml` which contains safe defaults for development.

## 🔧 Available Scripts

| Script | Purpose |
|--------|---------|
| `./test-production.sh` | Test production image locally |
| `./deploy-production.sh` | Deploy production image |
| `./cleanup-test.sh` | Clean up test containers |
| `docker-compose up` | Start full stack locally |

## 🐳 Docker Commands

### Build Production Image

```bash
docker build -t medusa-raqueto-backend:latest -f Dockerfile .
```

### Run Production Container

```bash
docker run -d \
  --name medusa-backend \
  -p 9000:9000 \
  --env-file env.yaml \
  medusa-raqueto-backend:latest
```

### View Logs

```bash
docker logs -f medusa-backend
```

### Health Check

```bash
curl http://localhost:9000/health
```

## 🌐 Endpoints

Once deployed, your MedusaJS application will be available at:

- **Admin Dashboard**: `http://localhost:9000/admin`
- **Store API**: `http://localhost:9000/store`
- **Health Check**: `http://localhost:9000/health`

## 🔍 Monitoring

### Container Health

The container includes built-in health checks that monitor:
- Application startup
- HTTP endpoint availability
- Database connectivity

### Logs

Monitor your application with:

```bash
# Follow logs in real-time
docker logs -f medusa-backend

# View last 100 lines
docker logs --tail 100 medusa-backend
```

## 🛠️ Troubleshooting

### Common Issues

1. **Container won't start**
   - Check environment variables
   - Verify database connectivity
   - Review container logs

2. **Health check fails**
   - Ensure application is fully started
   - Check if port 9000 is accessible
   - Verify health endpoint exists

3. **Database connection issues**
   - Verify DATABASE_URL format
   - Check database server is running
   - Ensure network connectivity

### Debug Commands

```bash
# Enter running container
docker exec -it medusa-backend sh

# Check environment variables
docker exec medusa-backend env

# Test database connection
docker exec medusa-backend npx medusa db:migrate
```

## 🔒 Security Considerations

- The production image runs as a non-root user
- Environment variables should be properly secured
- Use strong secrets for JWT_SECRET and COOKIE_SECRET
- Configure proper CORS settings for production
- Enable HTTPS in production environments

## 📦 Image Optimization

The multi-stage build process:
1. **Builder stage**: Installs all dependencies and builds the application
2. **Production stage**: Only includes production dependencies and built assets

This results in a smaller, more secure production image.

## 🚀 Deployment Options

### Cloud Platforms

- **Google Cloud Run**: Use the provided Dockerfile
- **AWS ECS/Fargate**: Compatible with the multi-stage build
- **Azure Container Instances**: Direct Docker deployment
- **DigitalOcean App Platform**: Container-based deployment

### Container Orchestration

- **Kubernetes**: Use the production image with proper resource limits
- **Docker Swarm**: Deploy with the provided docker-compose.yml
- **Nomad**: Use the container with proper service discovery

## 📚 Additional Resources

- [MedusaJS Documentation](https://docs.medusajs.com/)
- [Docker Best Practices](https://docs.docker.com/develop/best-practices/)
- [Production Deployment Guide](https://docs.medusajs.com/deployment/general)
