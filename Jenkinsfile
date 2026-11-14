pipeline {
    agent any
    environment {
        IMAGE = "sumeer16/myapp"
        KUBECONFIG = "/var/lib/jenkins/.kube/config"
    }
    stages {
        stage('Checkout') {
            steps { checkout scm }
        }
        stage('Secret Scan') {
            steps { sh 'trivy fs --scanners secret --exit-code 1 .' }
        }
        stage('Build Docker Image') {
            steps { sh 'docker build -t $IMAGE:$BUILD_NUMBER .' }
        }
        stage('Image Scan') {
            steps { sh 'trivy image --severity HIGH,CRITICAL --exit-code 0 $IMAGE:$BUILD_NUMBER' }
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
                sh 'sed -i "s|image:.*|image: $IMAGE:$BUILD_NUMBER|" deployment.yaml'
                sh 'kubectl apply -f deployment.yaml'
                sh 'kubectl rollout status deployment/myapp'
            }
        }
    }
}