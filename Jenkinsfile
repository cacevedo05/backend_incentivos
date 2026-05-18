pipeline {
    agent any

    environment {
        DOCKER_HUB_USER = 'camilaacevedo'
        IMAGE_NAME = "${DOCKER_HUB_USER}/backend-incentivos"
        TAG = "${env.BUILD_NUMBER}-${env.GIT_COMMIT.take(7)}"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    docker.build("${IMAGE_NAME}:${TAG}")
                    docker.build("${IMAGE_NAME}:latest")
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                script {
                    docker.withRegistry('', 'docker-hub-credentials') {
                        docker.image("${IMAGE_NAME}:${TAG}").push()
                        docker.image("${IMAGE_NAME}:latest").push()
                    }
                }
            }
        }
    }

    post {
        failure {
            echo "Pipeline failed for backend build ${BUILD_NUMBER}"
        }
        success {
            echo "Backend image pushed: ${IMAGE_NAME}:${TAG}"
        }
    }
}
