pipeline {
    agent any

    environment {
        DOCKER_HUB_USER = 'camilaacevedo'
        IMAGE_NAME = "${DOCKER_HUB_USER}/backend-incentivos"
        TAG = "${env.BUILD_NUMBER}-${env.GIT_COMMIT.take(7)}"
        AZURE_VM_IP = '20.12.74.86'
        SSH_USER = 'azureuser'
        ARM_USE_CLI = 'true'
        PATH = "C:\\Users\\cacevedo\\AppData\\Local\\Microsoft\\WinGet\\Links;${env.PATH}"
    }

    stages {
        stage('Terraform Init') {
            steps {
                bat 'cd terraform && terraform init'
            }
        }

        stage('Terraform Plan') {
            steps {
                bat 'cd terraform && terraform plan -out=tfplan'
            }
        }

        stage('Terraform Apply') {
            steps {
                bat 'cd terraform && terraform apply -auto-approve tfplan'
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

        stage('Deploy to Azure VM') {
            steps {
                bat """
                    ssh ${SSH_USER}@${AZURE_VM_IP} "sudo docker compose --env-file /opt/incentivos/.env -f /opt/incentivos/docker-compose.yml pull"
                    ssh ${SSH_USER}@${AZURE_VM_IP} "sudo docker compose --env-file /opt/incentivos/.env -f /opt/incentivos/docker-compose.yml up -d"
                """
            }
        }
    }

    post {
        failure {
            echo "Pipeline failed for backend build ${BUILD_NUMBER}"
        }
        success {
            echo "Backend deployed: ${IMAGE_NAME}:${TAG}"
        }
    }
}
