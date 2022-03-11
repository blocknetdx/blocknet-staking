# pull the base image, we're using 14- for compatibility
FROM node:14-alpine as build-step

# add `/web/node_modules/.bin` to $PATH
ENV PATH /web/node_modules/.bin:$PATH

# This doesn't work for some reason? welp..
WORKDIR /web/

COPY web/src ./src
COPY web/public ./public

# Install frontend dependencies
COPY web/package.json ./
COPY web/package-lock.json ./

# Run the frontend build 
RUN npm install
RUN npm run build 

# Alright now we need backend 
FROM python:3.9 

COPY --from=build-step /web/build ./build

# Include all the files we need
ADD web/server/__init.py .
ADD web/server/__api.py .
ADD web/server/flask_domain.txt .

# Install backend dependencies
COPY web/server/requirements.txt requirements.txt
RUN python -m pip install -r requirements.txt

# Expose the port 
EXPOSE 3000

# Notify backend that we're on production
ENV PRODUCTION=True

# Let's run the app with 2 threads since we need the API thread
# Just 1 worker otherwise we get complications with Socket IO.
CMD ["gunicorn", "-b", ":3000", "-w", "1", "-k", "gevent", "__init:app", "--threads", "2", "--worker-connections", "1000"]