pipeline {
    agent any
    environment {
        IMAGE = "sumeer16/myapp"
    }
    stages {
        stage('Checkout') {
            steps { checkout scm }
        }
        stage('Build Docker Image') {
            steps { sh 'docker build -t $IMAGE:$BUILD_NUMBER .' }
        }
        stage('Push Image') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds',
                    usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                    sh 'echo $PASS | docker login -u $USER --password-stdin'
                    sh 'docker push $IMAGE:$BUILD_NUMBER'
                }
            }
        }
        stage('Deploy to Kubernetes') {
            steps {
                withCredentials([file(credentialsId: 'kubeconfig', variable: 'KUBECONFIG')]) {
                    sh 'sed -i "s|image:.*|image: $IMAGE:$BUILD_NUMBER|" deployment.yaml'
                    sh 'kubectl apply -f deployment.yaml'
                    sh 'kubectl rollout status deployment/myapp'
                }
            }
        }
    }
}
