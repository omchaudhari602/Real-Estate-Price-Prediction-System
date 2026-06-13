from locust import HttpUser, task, between
import random


class APITestUser(HttpUser):
    wait_time = between(1, 3)

    @task(3)
    def health(self):
        self.client.get('/api/v1/health')

    @task(7)
    def predict(self):
        features = {f'feat{i}': random.random() for i in range(5)}
        self.client.post('/api/v1/predict', json={'features': features})
