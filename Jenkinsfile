pipeline {
    agent any

    environment {
        DOCKER_HUB_USER = 'camilaacevedo'
        IMAGE_NAME = "${DOCKER_HUB_USER}/backend-incentivos"
        TAG = "${env.BUILD_NUMBER}-${env.GIT_COMMIT.take(7)}"
        AZURE_VM_IP = '20.7.65.69'
        SSH_USER = 'azureuser'
        ARM_ACCESS_KEY = credentials('ARM_ACCESS_KEY')
        ARM_USE_CLI = 'true'
        DB_PASSWORD = credentials('TF_VAR_db_password')
        JWT_SECRET = credentials('TF_VAR_jwt_secret')
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
                bat 'cd terraform && terraform show -no-color tfplan > tfplan.txt'
                bat 'cd terraform && findstr /C:"will be destroyed" /C:"must be replaced" tfplan.txt && (echo Terraform plan destructivo detectado. Revisar tfplan.txt antes de aplicar. && exit /b 1) || exit /b 0'
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
                    withCredentials([usernamePassword(credentialsId: 'docker-hub-token', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                        powershell '$env:DOCKER_PASSWORD | docker login -u $env:DOCKER_USERNAME --password-stdin'
                        bat "docker push ${IMAGE_NAME}:${TAG}"
                        bat "docker push ${IMAGE_NAME}:latest"
                    }
                }
            }
        }

        stage('Deploy to Azure VM') {
            steps {
                bat """
                    ssh ${SSH_USER}@${AZURE_VM_IP} "echo 'POSTGRES_PASSWORD=${DB_PASSWORD}' | sudo tee /opt/incentivos/.env"
                    ssh ${SSH_USER}@${AZURE_VM_IP} "echo 'JWT_SECRET=${JWT_SECRET}' | sudo tee -a /opt/incentivos/.env"
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
